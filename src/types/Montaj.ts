export interface Montaj {
    id?:string
    projeNo: string;
    baslik: string;
    parcaNo: string;
    baslangic: Date;
    bitis: Date;
    uygunsuzluk: 
    [];
    sorun: [];
    yonetici: string;
    atananlar: string[];
    durum: 'açık' | 'kapalı' |"beklemede";
    fileBase64?:{name:string,data:string,mimeType:string}
  }
  