// 📁 screens/ListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, useWindowDimensions, Modal, Alert } from 'react-native';
import { Card, Text, Button, DataTable, TextInput, IconButton, MD3Colors, Checkbox } from 'react-native-paper';
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { app, storage } from '../firebase/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from "expo-file-system";
import * as mime from "react-native-mime-types";
import * as DocumentPicker from "expo-document-picker";
import WebView from 'react-native-webview';
import { FileItem } from '../types/Product';


const db = getFirestore(app);
const ListScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const [montajlar, setMontajlar] = useState<any[]>([]);
  const [file, setFile] = useState<FileItem>();
  const [fileVisible, setFileVisible] = useState<boolean>(false);

  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, 'montajlar'));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMontajlar(data);
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
          onPress:async () => {
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
  const pickDocument = async (montaj:any) => {
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
        await updateDoc(doc(db,"montajlar",montaj.id), {base64Data:{name:fileName,data:base64Data,mimeType:mimeType}}
     );

     await  fetchData();
     Alert.alert("Başarılı", "Dosya Yükleme İşlemi Başarılı");

      } catch (error: any) {
        Alert.alert("Dosya Yükleme Hatası", error.message);
      }

    }
  }
  const [sortColumn, setSortColumn] = useState<string>("projeNo");
  const [sortAscending, setSortAscending] = useState(true);

  const sortedData = [...montajlar].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortAscending ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortAscending ? 1 : -1;
    return 0;
  });

  const handleSort = (column:string) => {
    if (sortColumn === column) {
      setSortAscending(!sortAscending);
    } else {
      setSortColumn(column);
      setSortAscending(true);
    }
  };
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}  horizontal>
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
            <DataTable.Title  style={{width:100}}>#</DataTable.Title>
            <DataTable.Title sortDirection={sortColumn === "projeNo" ? (sortAscending ? "ascending" : "descending") : undefined}
            onPress={() => handleSort("projeNo")}  style={{width:100}}>Proje No</DataTable.Title>
            <DataTable.Title sortDirection={sortColumn === "baslik" ? (sortAscending ? "ascending" : "descending") : undefined}
            onPress={() => handleSort("baslik")}  style={{width:100}}>Başlık</DataTable.Title>
            <DataTable.Title  style={{width:200}}>Parça No</DataTable.Title>
            <DataTable.Title style={{width:100}}>Başlangıç Tarihi</DataTable.Title>
            <DataTable.Title style={{width:100}} >Bitiş Tarihi</DataTable.Title>
            <DataTable.Title style={{width:100}} >Uygunsuzluk</DataTable.Title>
            <DataTable.Title style={{width:100}} >Sorun</DataTable.Title>
            <DataTable.Title style={{width:100}} >Proje Yöneticisi</DataTable.Title>
            <DataTable.Title style={{width:100}} >Atananlar</DataTable.Title>
            <DataTable.Title style={{width:100}} >Durumu</DataTable.Title>
            <DataTable.Title style={{width:100}} >Kalan Süre</DataTable.Title>
            <DataTable.Title style={{width:200}} >İşlemler</DataTable.Title>
          </DataTable.Header>

          {montajlar.map((item: any,index:number) => (
            <DataTable.Row key={index}>
              <DataTable.Cell style={{width:100}}>{index+1}</DataTable.Cell>
              <DataTable.Cell style={{width:100}}>{item.projeNo}</DataTable.Cell>
              <DataTable.Cell style={{width:200}}>{item.baslik}</DataTable.Cell>
              <DataTable.Cell style={{width:200}}>{item.parcaNo}</DataTable.Cell>
              <DataTable.Cell style={{width:100}}>{item.baslangic}</DataTable.Cell>
              <DataTable.Cell style={{width:100}}>{item.bitis}</DataTable.Cell>
              <DataTable.Cell style={{width:100}}>{item.uygunsuzluk}</DataTable.Cell>
              <DataTable.Cell style={{width:100}}>{item.sorun}</DataTable.Cell>
              <DataTable.Cell style={{width:100}}>{item.uygunsuzluk}</DataTable.Cell>
              <DataTable.Cell style={{width:100}}>{item.yonetici}</DataTable.Cell>
              <DataTable.Cell style={{width:100}}>{item.atananlar}</DataTable.Cell>
              <DataTable.Cell style={{width:100}}>{item.durum}</DataTable.Cell>
              <DataTable.Cell style={{width:100}}>{""}</DataTable.Cell>
              <DataTable.Cell style={{width:200,flex:1,justifyContent:'space-between'}}>
                <IconButton
                  icon="delete"
                  iconColor={MD3Colors.error50}
                  size={20}
                  onPress={() => handleDelete(item.id)}
                />
                <IconButton
                  icon="update"
                  iconColor={MD3Colors.error50}
                  size={20}
                />
                <IconButton
                  icon="upload"
                  iconColor={MD3Colors.error50}
                  size={20}
                  onPress={async () => await pickDocument(item)}
                />
                <IconButton
                  icon="looks"
                  iconColor={MD3Colors.error50}
                  size={20}
                  onPress={() => {setFile(item.base64Data?{id:item.id,name:item.base64Data?.name,base64Data:item.base64Data?.data,mimeType:item.base64Data?.mimeType}:{id:"",name:"",mimeType:"",base64Data:""}); setFileVisible(!fileVisible);}}
                />
              </DataTable.Cell>
            </DataTable.Row>
          ))}

        </DataTable>

      </View>
    </ScrollView>
  );
};

export default ListScreen;
