import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { addDoc, collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Montaj } from '../types/Montaj';

interface Props {
  id?: string
}
const AddMontajScreen: React.FC = (props: Props) => {
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);
  
  const db = getFirestore(app);
  const getDocumentById = async () => {
    const docRef = doc(db, "montajlar", props.id ?? "");
    const docSnap = await getDoc(docRef);
    console.log(docSnap);
  }
  useEffect(() => {

  }, [])

  const [form, setForm] = useState<Montaj>({
    projeNo: '',
    baslik: '',
    parcaNo: '',
    baslangic: new Date(),
    bitis: new Date(),
    uygunsuzluk: [],
    sorun: [],
    yonetici: '',
    atananlar: [],
    durum: 'açık'
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const data = {
        ...form,
        uygunsuzluk: form.uygunsuzluk,
        sorun: form.sorun
      };
      console.log(data);
      await addDoc(collection(db, 'montajlar'), data);
      Alert.alert('Başarılı', 'Kayıt başarıyla eklendi!');
      setForm({
        projeNo: '',
        baslik: '',
        parcaNo: '',
        baslangic: new Date(),
        bitis: new Date(),
        uygunsuzluk: [],
        sorun: [],
        yonetici: '',
        atananlar: [],
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
      <TextInput label="Başlangıç Tarihi" value={form.baslangic.toLocaleDateString()} readOnly right={<TextInput.Icon onPress={() => setShowStartPicker(true)} icon="eye" />}  placeholder="12 Şubat 2025" />
      {
        showStartPicker?
        <DateTimePicker value={form.baslangic} onChange={(v, d) =>{ handleChange('baslangic', d); setShowStartPicker(false);}} /> :null
      }
      {
        showEndPicker ?
        <DateTimePicker value={form.bitis} onChange={(v, d) => {handleChange('bitis', d); setShowEndPicker(false);}} /> :null
      }
      <TextInput label="Bitiş Tarihi" value={form.bitis.toLocaleDateString()} readOnly right={<TextInput.Icon onPress={() => setShowEndPicker(true)} icon="eye" />}placeholder="12 Nisan 2025" />
      <TextInput label="Uygunsuzluk" keyboardType="numeric" value={form.uygunsuzluk.toString()} onChangeText={(v) => handleChange('uygunsuzluk', v)} />
      <TextInput label="Sorun" keyboardType="numeric" value={form.sorun.toString()} onChangeText={(v) => handleChange('sorun', v)} />

      <View style={{ marginVertical: 12 }}>
        <Text style={{ marginBottom: 4 }}>Durum:</Text>
        <RadioButton.Group onValueChange={(v) => handleChange('durum', v)} value={form.durum}>
          <RadioButton.Item label="Açık" value="açık" />
          <RadioButton.Item label="Kapalı" value="kapalı" />
          <RadioButton.Item label="Beklemede" value="beklemede" />
        </RadioButton.Group>
      </View>

      <Button mode="contained" onPress={handleSave}>
        Kaydet
      </Button>
    </ScrollView>
  );
};

export default AddMontajScreen;
