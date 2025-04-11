
  export interface Product {
    id: number;
    code: string;
    name: string;
    stock: number;
    order: number;
    shipment: number;
    price: string;
    unit: string;
  }
  
  export interface StockRecord {
    id: string;
    product: Product;
    count: string;
    description: string;
  }
  export interface FileItem  {
    id: string;
    name: string;
    base64Data: string;
    mimeType: string;
  };