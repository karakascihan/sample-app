import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { addDoc, collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig';

interface Props {
  id?: string
}
const AddMontajScreen: React.FC = (props: Props) => {
  
  const db = getFirestore(app);
  const getDocumentById = async()=>{
    const docRef = doc(db, "montajlar", props.id??"");
    const docSnap = await getDoc(docRef);
    console.log(docSnap);
  }
  useEffect(() => {
  
  }, [])

  const [form, setForm] = useState({
    projeNo: '',
    baslik: '',
    parcaNo: '',
    baslangic: '',
    bitis: '',
    uygunsuzluk: '',
    sorun: '',
    yonetici: '',
    atananlar: '',
    durum: 'açık',
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {


      const atananlarArray = form.atananlar
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean);

      const data = {
        ...form,
        uygunsuzluk: parseInt(form.uygunsuzluk),
        sorun: parseInt(form.sorun),
        atananlar: atananlarArray,
      };
      console.log(data);
      await addDoc(collection(db, 'montajlar'), data);
      alert('Kayıt başarıyla eklendi!');
      setForm({
        projeNo: '',
        baslik: '',
        parcaNo: '',
        baslangic: '',
        bitis: '',
        uygunsuzluk: '',
        sorun: '',
        yonetici: '',
        atananlar: '',
        durum: 'açık',
      });
    } catch (error) {
      alert(error)
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <TextInput label="Proje No" value={form.projeNo} onChangeText={(v) => handleChange('projeNo', v)} />
      <TextInput label="Başlık" value={form.baslik} onChangeText={(v) => handleChange('baslik', v)} />
      <TextInput label="Parça No" value={form.parcaNo} onChangeText={(v) => handleChange('parcaNo', v)} />
      <TextInput label="Başlangıç Tarihi" value={form.baslangic} onChangeText={(v) => handleChange('baslangic', v)} placeholder="12 Şubat 2025" />
      <TextInput label="Bitiş Tarihi" value={form.bitis} onChangeText={(v) => handleChange('bitis', v)} placeholder="12 Nisan 2025" />
      <TextInput label="Uygunsuzluk" keyboardType="numeric" value={form.uygunsuzluk} onChangeText={(v) => handleChange('uygunsuzluk', v)} />
      <TextInput label="Sorun" keyboardType="numeric" value={form.sorun} onChangeText={(v) => handleChange('sorun', v)} />
      <TextInput label="Proje Yöneticisi Avatar URL" value={form.yonetici} onChangeText={(v) => handleChange('yonetici', v)} />
      <TextInput
        label="Atananlar Avatar URL’leri (virgülle ayır)"
        value={form.atananlar}
        onChangeText={(v) => handleChange('atananlar', v)}
        multiline
      />

      <View style={{ marginVertical: 12 }}>
        <Text style={{ marginBottom: 4 }}>Durum:</Text>
        <RadioButton.Group onValueChange={(v) => handleChange('durum', v)} value={form.durum}>
          <RadioButton.Item label="Açık" value="açık" />
          <RadioButton.Item label="Kapalı" value="kapalı" />
        </RadioButton.Group>
      </View>

      <Button mode="contained" onPress={handleSave}>
        Kaydet
      </Button>
    </ScrollView>
  );
};

export default AddMontajScreen;
