
export enum Category {
  BAHAN_BAKU = 'Bahan Baku',
  PACKAGING = 'Packaging',
  TENAGA_KERJA = 'Tenaga Kerja',
  OPERASIONAL = 'Operasional'
}

export interface CostItem {
  id: string;
  category: Category;
  name: string;
  unitPrice: number;
}

export interface Product {
  id: string;
  name: string;
  productionYield: number; // Jumlah unit yang dihasilkan
  items: CostItem[];
}

export interface HPPResult {
  totalCost: number;
  hppPerUnit: number;
  categoryBreakdown: Record<Category, number>;
}

export interface SavedRecord {
  id: string;
  timestamp: number;
  product: Product;
  totalCost: number;
  hppPerUnit: number;
}
