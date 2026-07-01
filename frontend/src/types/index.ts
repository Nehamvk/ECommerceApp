export interface AuthResponse {
  token: string;
  expiresAt: string;
  email: string;
  fullName: string;
  roles: string[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string | null;
  categoryId: number;
  categoryName?: string;
}

export interface Category {
  id: number;
  name: string;
}
