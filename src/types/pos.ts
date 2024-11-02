export type OrderStatus = "ORDERED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

export interface Product {
  id: number;
  imageUrl?: string;
  name: string;
  description?: string;
  modifiers?: ModifierGroup[];
  available: boolean;
}

export type ModifierOption = {
  id: string;
  name: string;
  exclusive: false;
};

export type ModifierExclusive = {
  id: string;
  name: string;
  exclusive: true;
};

export type Modifiers = ModifierOption | ModifierExclusive;

export interface ModifierGroup {
  id: string;
  name: string;
  options: Modifiers[];
  exclusive?: boolean;
  defaultOptionId?: string;
}

export interface OrderProduct extends Product {
  quantity: number;
  selectedModifiers: Modifiers[];
  notes?: string;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  products: OrderProduct[];
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}