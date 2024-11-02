import { MenuItem, Order } from "../types/pos";

class DatabaseService {
  private static instance: DatabaseService;
  private orderCounter: number = 0;

  private constructor() {
    const savedCounter = localStorage.getItem('orderCounter');
    if (savedCounter) {
      this.orderCounter = parseInt(savedCounter);
    }
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    const items = await this.getMenuItems();
    if (items.length === 0) {
      const defaultItems: MenuItem[] = [
        {
          id: 1,
          name: "Classic Burger",
          description: "1/3 lb beef patty with lettuce, tomato, and cheese",
          price: 12.99,
          category: "Burgers",
          imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
          available: true
        },
        {
          id: 2,
          name: "Caesar Salad",
          description: "Romaine lettuce, croutons, parmesan cheese",
          price: 9.99,
          category: "Salads",
          imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500",
          available: true
        }
      ];
      await this.setMenuItems(defaultItems);
    }
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    const items = localStorage.getItem('menuItems');
    return items ? JSON.parse(items) : [];
  }

  async setMenuItems(items: MenuItem[]): Promise<void> {
    localStorage.setItem('menuItems', JSON.stringify(items));
  }

  async getOrders(): Promise<Order[]> {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  }

  async addOrder(orderData: Omit<Order, 'orderNumber'>): Promise<Order> {
    const order: Order = {
      ...orderData,
      orderNumber: ++this.orderCounter
    };
    
    const orders = await this.getOrders();
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('orderCounter', this.orderCounter.toString());
    
    return order;
  }

  async updateOrder(order: Order): Promise<void> {
    const orders = await this.getOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index !== -1) {
      orders[index] = { ...order, updatedAt: new Date() };
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }

  async deleteOrder(orderId: string): Promise<void> {
    const orders = await this.getOrders();
    const filteredOrders = orders.filter(o => o.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(filteredOrders));
  }
}

export const db = DatabaseService.getInstance();