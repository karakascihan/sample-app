// 📁 screens/ListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { Card, Text, Button, DataTable, TextInput, IconButton, MD3Colors } from 'react-native-paper';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { Montaj } from '../types/Montaj';
import * as FileSystem from "expo-file-system";
import * as mime from "react-native-mime-types";
import * as DocumentPicker from "expo-document-picker";
import { DocumentPickerResult, DocumentPickerSuccessResult } from 'expo-document-picker';


const db = getFirestore(app);
const ListScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const [montajlar, setMontajlar] = useState<any[]>([]);

  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, 'montajlar'));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMontajlar(data);
  };
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'montajlar', id));
    fetchData();
  };
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      fetchData();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );
  type UploadedFile = {
    id: string;
    name: string;
    url: string;
  };
  const pickDocument = async () => {
    const result:any= await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });

    if (result.type === "success") {
      const fileUri = result.uri;
      const fileName = result.name;
      const mimeType = mime.lookup(fileName) || "application/octet-stream";

      const response = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileRef = ref(storage, `uploads/${fileName}`);
      const blob = await (await fetch(fileUri)).blob();

      await uploadBytes(fileRef, blob, {
        contentType: mimeType,
      });

      const downloadUrl = await getDownloadURL(fileRef);

      const docRef = await addDoc(collection(db, "uploadedFiles"), {
        name: fileName,
        url: downloadUrl,
      });

      setFiles((prev) => [...prev, { id: docRef.id, name: fileName, url: downloadUrl }]);
    }
  };
  useEffect(() => {
    // fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ flexDirection: width > 768 ? 'row' : 'column', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {/* <Card  style={{ marginBottom: 12, padding: 12, width: width > 768 ? '48%' : '100%', marginHorizontal: width > 768 ? '1%' : 0 }}> */}
        {/* <Card.Title title={item.baslik || 'Başlık Yok'} subtitle={`Proje: ${item.projeNo}`} /> */}
        {/* <Card.Content style={{ flexDirection: "column" }}> */}
        {/* <Text>Parça No: {item.parcaNo}</Text>
              <Text>Başlangıç: {item.baslangic}</Text>
              <Text>Bitiş: {item.bitis}</Text>
              <Text>Uygunsuzluk: {item.uygunsuzluk}</Text>
              <Text>Sorun: {item.sorun}</Text>
              <Text>Yönetici: {item.yonetici}</Text>
              <Text>Durum: {item.durum}</Text> */}
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Proje No</DataTable.Title>
            <DataTable.Title>Başlık</DataTable.Title>
            <DataTable.Title>Parça No</DataTable.Title>
            <DataTable.Title>Başlangıç Tarihi</DataTable.Title>
            <DataTable.Title >Bitiş Tarihi</DataTable.Title>
            <DataTable.Title >Uygunsuzluk</DataTable.Title>
            <DataTable.Title >Sorun</DataTable.Title>
            <DataTable.Title >Proje Yöneticisi</DataTable.Title>
            <DataTable.Title >Atananlar</DataTable.Title>
            <DataTable.Title >Durumu</DataTable.Title>
            <DataTable.Title >Kalan Süre</DataTable.Title>
            <DataTable.Title > </DataTable.Title>
            <DataTable.Title > </DataTable.Title>
          </DataTable.Header>

          {montajlar.map((item: Montaj) => (
            <DataTable.Row key={item.id}>
              <DataTable.Cell>{item.projeNo}</DataTable.Cell>
              <DataTable.Cell>{item.parcaNo}</DataTable.Cell>
              <DataTable.Cell>{item.baslangic}</DataTable.Cell>
              <DataTable.Cell>{item.bitis}</DataTable.Cell>
              <DataTable.Cell><TextInput value={item.sorun.toString()} /></DataTable.Cell>
              <DataTable.Cell>{item.uygunsuzluk}</DataTable.Cell>
              <DataTable.Cell>{item.uygunsuzluk}</DataTable.Cell>
              <DataTable.Cell>{item.uygunsuzluk}</DataTable.Cell>
              <DataTable.Cell>{item.uygunsuzluk}</DataTable.Cell>
              <DataTable.Cell>{item.uygunsuzluk}</DataTable.Cell>
              <DataTable.Cell>{item.uygunsuzluk}</DataTable.Cell>
              <DataTable.Cell>  
                <IconButton
                icon="delete"
                iconColor={MD3Colors.error50}
                size={20}
                onPress={() => handleDelete(item.id)}
              />
                            </DataTable.Cell>
                            <DataTable.Cell>


                <IconButton
                icon="update"
                iconColor={MD3Colors.error50}
                size={20}
                onPress={() => handleDelete(item.id)}
              />
              </DataTable.Cell>
            </DataTable.Row>
          ))}

        </DataTable>
        {/* </Card.Content> */}
        {/* <Card.Actions> */}
        {/* <Button onPress={() => handleDelete(item.id)}>Sil</Button> */}
        {/* <Button onPress={() => navigation.navigate('duzenle')}>Düzenle</Button> */}
        {/* </Card.Actions> */}
        {/* </Card> */}
      </View>
    </ScrollView>
  );
};

export default ListScreen;
