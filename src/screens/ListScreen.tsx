// 📁 screens/ListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, useWindowDimensions, Modal, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Card, Text, Button, DataTable, TextInput, IconButton, MD3Colors, Checkbox, Badge } from 'react-native-paper';
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { app

 } from '../firebase/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import WebView from 'react-native-webview';
import moment from 'moment';
import { FileItem } from '../types/Product';
import { Montaj } from '../types/Montaj';


const db = getFirestore(app);
const ListScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const [montajlar, setMontajlar] = useState<Montaj[]>([]);
  const [file, setFile] = useState<FileItem>();
  const [fileVisible, setFileVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editMontaj, setEditMontaj] = useState<any>(null);
  const [editList, setEditList] = useState<any[]>([]);
  const [teknisyenAdi, setTeknisyenAdi] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [currentEditField, setCurrentEditField] = useState<'sorun' | 'uygunsuzluk' | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null); // düzenlenecek satırın index'i

  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, 'montajlar'));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMontajlar(data as Montaj[]);
  };
  const handleDelete = async (id: string) => {
    Alert.alert(
      "Onay Gerekiyor",
      "Montaj kaydını silmek  istediğinize emin misiniz?",
      [
        {
          text: "İptal",
          onPress: () => console.log("İptal edildi"),
          style: "cancel", // 'cancel' butonu stilini belirtir
        },
        {
          text: "Evet",
          onPress: async () => {
            await deleteDoc(doc(db, 'montajlar', id));
            fetchData();
          },
        },
      ],
      { cancelable: true }
    );


  };
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      return () => {
      };
    }, [])
  );

  const getWebViewHtml = (file: FileItem) => {
    let result = `<html><body><p>Bu dosya WebView ile gösterilemiyor.</p></body></html>`;
    const base64 = file.base64Data;
    const mime = file.mimeType;
    console.log("getWebView :" + mime);
    if (mime?.startsWith("image/")) {
      result = `<html><body style="margin:0;padding:0;"><img src="data:${mime};base64,${base64}" style="width:100%;height:auto;" /></body></html>`;
    }
    // if (mime === "application/pdf") {
    //   result = `<html><body style="margin:0;padding:0;"><embed src="data:application/pdf;base64,${base64}" type="application/pdf" width="100%" height="100%"/></body></html>`;
    // }
    if (mime === "application/pdf") {
      result = ` <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-text-size-adjust: none;
          }
          
          html, body {
            width: 100%;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 16px;
          }
          
          #pdf-container {
            width: 100%;
            max-width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
          }
          
          .pdf-page {
            width: 100% !important;
            height: auto !important;
            margin: 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            background-color: white;
            border-radius: 8px;
            touch-action: manipulation;
          }
        </style>
      </head>
      <body>
        <div id="pdf-container"></div>
        <script>
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          
          async function loadPDF() {
            try {
              const pdfData = atob('${base64}');
              const loadingTask = pdfjsLib.getDocument({data: pdfData});
              const pdf = await loadingTask.promise;
              const container = document.getElementById('pdf-container');
              const viewportWidth = document.body.clientWidth - 32; // Account for padding
              
              // Get device pixel ratio for better resolution
              const pixelRatio = window.devicePixelRatio || 1;
              
              for(let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const originalViewport = page.getViewport({scale: 1});
                
                // Calculate base scale to fit width
                const baseScale = viewportWidth / originalViewport.width;
                
                // Apply higher resolution scale for better quality when zooming
                const qualityScale = baseScale * Math.max(pixelRatio * 2, 2); // minimum 2x for quality
                const viewport = page.getViewport({scale: qualityScale});
                
                const canvas = document.createElement('canvas');
                canvas.className = 'pdf-page';
                const context = canvas.getContext('2d', { alpha: false });
                
                // Set canvas dimensions to the high-resolution size
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                // Set display size to the original size
                canvas.style.width = (viewport.width / qualityScale * baseScale) + 'px';
                canvas.style.height = (viewport.height / qualityScale * baseScale) + 'px';
                
                // Enable image smoothing for better quality
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = 'high';
                
                await page.render({
                  canvasContext: context,
                  viewport: viewport,
                  background: 'rgb(255, 255, 255)'
                }).promise;
                
                container.appendChild(canvas);
              }
              
              // Send total height to React Native
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'dimensions',
                height: document.body.scrollHeight
              }));
            } catch (error) {
              console.error('Error loading PDF:', error);
            }
          }
          
          loadPDF();
        </script>
      </body>
    </html>`;
    }
    return result;
  };
  const ClearState = ()=>{
    setTeknisyenAdi('');
    setAciklama('');
    setEditIndex(null);
  }
  const pickDocument = async (montaj: any) => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (result.canceled !== true) {
      try {
        const fileUri = result.assets[0].uri;
        const fileName = result.assets[0].name;;
        const mimeType = result.assets[0].mimeType || "application/octet-stream";
        const base64Data = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        // montaj.fileBase64={name:fileName,data:base64Data,mimeType:mimeType}
        await updateDoc(doc(db, "montajlar", montaj.id), { fileBase64: { name: fileName, data: base64Data, mimeType: mimeType } }
        );

        await fetchData();
        Alert.alert("Başarılı", "Dosya Yükleme İşlemi Başarılı");

      } catch (error: any) {
        Alert.alert("Dosya Yükleme Hatası", error.message);
      }

    }
  }
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }} horizontal>
      <View style={{ flexDirection: width > 768 ? 'row' : 'column', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Modal visible={fileVisible} animationType='slide' transparent onRequestClose={() => setFileVisible(false)} onDismiss={() => setFileVisible(false)}>
          <View style={{ flex: 1 }}>
            <IconButton
              style={{ alignSelf: 'flex-end', marginEnd: 20 }}
              icon="close-circle"
              iconColor={MD3Colors.error40}
              size={30}
              onPress={() => setFileVisible(false)}
            />
            <WebView
              originWhitelist={["*"]}
              source={{ html: file ? getWebViewHtml(file) : "dosya bulunamadı." }}
              style={{ flex: 1, padding: 10 }}
              scalesPageToFit
              javaScriptEnabled
            />
          </View>
        </Modal>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={{ width: 100, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>#</Text>
            </DataTable.Title>
            <DataTable.Title
              style={{ width: 100, justifyContent: 'center' }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Proje No</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 200, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Başlık</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 200, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Parça No</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Başlangıç</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Bitiş</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Kalan Süre</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Sorun</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Uygunsuzluk</Text>
            </DataTable.Title>

            <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Proje Yöneticisi</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Atananlar</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Durumu</Text>
            </DataTable.Title>
            <DataTable.Title style={{ width: 200, justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>İşlemler</Text>
            </DataTable.Title>
          </DataTable.Header>
          {montajlar.map((item: Montaj, index: number) => (
            <DataTable.Row key={index}>
              <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>{index + 1}</DataTable.Cell>
              <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>{item.projeNo}</DataTable.Cell>
              <DataTable.Cell style={{ width: 200, justifyContent: 'center' }}>{item.baslik}</DataTable.Cell>
              <DataTable.Cell style={{ width: 200, justifyContent: 'center' }}>{item.parcaNo}</DataTable.Cell>
              <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>{item.baslangic.toDate().toLocaleDateString()}</DataTable.Cell>
              <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>{item.bitis.toDate().toLocaleDateString()}</DataTable.Cell>
              <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>
                {(() => {
                  const today = moment();
                  const endDate = moment(item.bitis.toDate(), "YYYY-MM-DD"); // Gerekirse formatı değiştir
                  const diff = endDate.diff(today, 'days');

                  if (diff < 0) {
                    return <Text style={{ color: 'red', fontWeight: 'bold' }}>Süre Doldu</Text>;
                  } else if (diff === 0) {
                    return <Text style={{ color: 'orange', fontWeight: 'bold' }}>Son Gün</Text>;
                  } else if (diff <= 3) {
                    return <Text style={{ color: 'orange', fontWeight: 'bold' }}>{diff} gün kaldı</Text>;
                  } else {
                    return <Text style={{ color: 'green', fontWeight: 'bold' }}>{diff} gün kaldı</Text>;
                  }
                })()}
              </DataTable.Cell>
              <DataTable.Cell  onPress={() => {
                      ClearState();
                      setCurrentEditField('sorun');
                      setEditMontaj(item);
                      setEditList(item.sorun || []);
                      setEditModalVisible(true);
                    }} style={{ width: 150, justifyContent: 'center' }}>
                <View style={{ alignItems: 'center' }  }>
                  <IconButton
                    icon="alert-circle-outline"
                    size={20}
                   
                  />
                  <Badge
                    style={{ position: 'absolute', top: 2, right: 2 }}
                    size={16}
                  >
                    {(item.sorun?.length || 0).toString()}
                  </Badge>
                </View>
              </DataTable.Cell>
              <DataTable.Cell onPress={() => {
                       ClearState();
                      setCurrentEditField('uygunsuzluk');
                      setEditMontaj(item);
                      setEditList(item.uygunsuzluk || []);
                      setEditModalVisible(true);
                    }} style={{ width: 150, justifyContent: 'center' }}>
                <View style={{ alignItems: 'center' }}>
                  <IconButton
                    icon="alert-octagon-outline"
                    size={20}
                    
                  />
                  <Badge
                    style={{ position: 'absolute', top: 2, right: 2 }}
                    size={16}
                  >
                    {(item.uygunsuzluk?.length || 0).toString()}
                  </Badge>
                </View>
              </DataTable.Cell>
              <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>{item.yonetici}</DataTable.Cell>
              <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>{item.atananlar}</DataTable.Cell>
              <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>{item.durum}</DataTable.Cell>
              <DataTable.Cell style={{ width: 200, justifyContent: 'center', flexDirection: 'row' }}>
                <IconButton icon="delete" iconColor={MD3Colors.error50} size={20} onPress={() => handleDelete(item.id ?? "")} />
                <IconButton icon="upload" iconColor={MD3Colors.error50} size={20} onPress={async () => await pickDocument(item)} />
                <IconButton
                  icon="file-document"
                  iconColor={MD3Colors.error50}
                  size={20}
                  onPress={() => {
                    setFile(item.fileBase64
                      ? {
                        id: item.id ?? "",
                        name: item.fileBase64?.name,
                        base64Data: item.fileBase64?.data,
                        mimeType: item.fileBase64?.mimeType
                      }
                      : { id: "", name: "", mimeType: "", base64Data: "" });
                    setFileVisible(!fileVisible);
                  }}
                />
              </DataTable.Cell>
            </DataTable.Row>

          ))}

        </DataTable>
        <Modal visible={editModalVisible}  onDismiss={() => setEditModalVisible(false)}>
        <KeyboardAvoidingView   behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}>
          
          <View  style={{ flexDirection: 'row', justifyContent: 'flex-end' ,zIndex:9999}}>
            <IconButton
                  icon="close-circle"
                  iconColor={MD3Colors.error40}
              size={24}
              onPress={() => setEditModalVisible(false)}
             
            />
          </View>
          <Card style={{ margin: 16, padding: 16 }}>
            <Text variant="titleLarge" style={{ marginBottom: 8 }}>
              {currentEditField === 'sorun' ? 'Sorun Ekle' : 'Uygunsuzluk Ekle'}
            </Text>

            <TextInput
              label="Teknisyen"
              value={teknisyenAdi}
              onChangeText={setTeknisyenAdi}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Açıklama"
              value={aciklama}
              onChangeText={setAciklama}
              multiline
              style={{ marginBottom: 8 }}
            />
            <Button
              mode="contained"
              onPress={() => {
                if (teknisyenAdi && aciklama) {
                  if (editIndex !== null) {
                    const updated = [...editList];
                    updated[editIndex] = { teknisyen: teknisyenAdi, aciklama };
                    setEditList(updated);
                    setEditIndex(null);
                  } else {
                    setEditList([...editList, { teknisyen: teknisyenAdi, aciklama }]);
                  }
                  setTeknisyenAdi('');
                  setAciklama('');
                }
              }}
            >
              {editIndex !== null ? 'Güncelle' : 'Ekle'}
            </Button>

            <ScrollView  style={{ maxHeight: 200, marginTop: 10 }}>
              {editList.map((entry, index) => (
                <Card key={index} style={{ marginVertical: 4, padding: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text>{entry.teknisyen}: {entry.aciklama}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <IconButton
                        icon="pencil"
                        size={20}
                        onPress={() => {
                          setTeknisyenAdi(entry.teknisyen);
                          setAciklama(entry.aciklama);
                          setEditIndex(index);
                        }}
                      />
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => {
                          const updated = editList.filter((_, i) => i !== index);
                          setEditList(updated);
                        }}
                      />
                    </View>
                  </View>
                </Card>
              ))}
            </ScrollView>
            <Button
              mode="contained-tonal"
              style={{ marginTop: 12 }}
              onPress={async () => {
                try {
                  if (editMontaj && currentEditField) {
                    await updateDoc(doc(db, 'montajlar', editMontaj.id), {
                      [currentEditField]: editList
                    });
                    setEditList([]);
                    await fetchData();
                    Alert.alert("Başarılı", "Kayıt Başarıyla Gerçekleşti");
                    setEditModalVisible(false);

                  }

                } catch (error: any) {
                  Alert.alert("Kayıt Ekleme Hatası", error.message);
                }
                
              }}
            >
              Kaydet
            </Button>
          </Card>
        </KeyboardAvoidingView>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default ListScreen;
