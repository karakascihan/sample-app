export interface Montaj {
    projeNo: string;
    baslik: string;
    parcaNo: string;
    baslangic: string;
    bitis: string;
    uygunsuzluk: number;
    sorun: number;
    yonetici: string;
    atananlar: string[];
    durum: 'açık' | 'kapalı' |"beklemede";
    fileBase64?:{name:string,data:string,mimeType:string}
  }
  