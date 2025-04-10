export interface Montaj {
    id: string;
    projeNo: string;
    baslik: string;
    parcaNo: string;
    baslangic: string;
    bitis: string;
    uygunsuzluk: number;
    sorun: number;
    yonetici: string;
    atananlar: string[];
    durum: 'açık' | 'kapalı';
  }
  