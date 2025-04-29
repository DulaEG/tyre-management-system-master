export interface Stock {
  id: string;
  name: string;
  description: string;
  lifespan?: number;
  inStock: number;
  deleteStatus: boolean;
  price: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
}
