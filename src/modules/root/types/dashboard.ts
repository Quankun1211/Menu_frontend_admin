export type DashboardOrder = {
  _id: string;
  userId?: { name?: string; email?: string };
  totalPrice: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
};

export type DashboardData = {
  period: number;
  generatedAt: string;
  summary: {
    revenue: number;
    orders: number;
    activeCustomers: number;
    averageOrderValue: number;
    growth: {
      revenue: number;
      orders: number;
      activeCustomers: number;
    };
  };
  orderStatuses: Record<string, number>;
  daily: Array<{ date: string; orders: number; revenue: number }>;
  recentOrders: DashboardOrder[];
  topProducts: Array<{
    _id: { productId: string; itemType: string };
    name: string;
    image?: string;
    quantity: number;
    revenue: number;
  }>;
  inventory: { total: number; lowStock: number; outOfStock: number };
  catalog: {
    customers: number;
    shippers: number;
    products: number;
    specials: number;
    menus: number;
    recipes: number;
  };
};
