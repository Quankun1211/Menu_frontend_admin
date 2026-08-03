export type OrderResponse = {
  _id: string;
  userId: {
    _id: string,
    name: string
  };
  subTotal: number;
  couponCode: string | null;
  couponDiscount: number;
  shippingFee: number;
  totalPrice: number;
  paymentMethod: "cod" | "vnpay";
  items: OrderItemResponse[];
  itemsForRebuy: OrderProductResponse[],
  status:
    | "pending"
    | "confirmed"
    | "delivered"
    | "cancelled"
    | "shipping"
    | "assigned"
    | "completed"
    | "pending_cancel";
  createdAt: string;
  cancelReason: string; 
  cancelledAt: string;
  cancelledBy: string;
  address: {
    _id: string;
    name: string;
    phone: string;
    address: string;
  };
  shipperInfo: {
    _id: string,
    name: string,
    phone: string
  },
  productSummary: string;
  thumbnail: string;
  updatedAt: string;
  paymentUrl?: string;
  paymentStatus: string;
  shippedAt: string,
  deliveredAt: string,
  cancelRequest?: {
    reason: string;
    requestedAt: string;
    adminNote?: string;
    isAccepted: boolean;
  };
  customer: {
    _id: string,
    name: string
  }
};

export type OrderItemResponse = {
  _id: string;
  productId: string;
  itemType: "Product" | "Special";
  productName: string;
  productImage: string | string[];
  productUnit: string;
  originalPrice?: number;
  salePercent: number;
  price: number;
  quantity: number;
};

export type OrderProductResponse = {
  productId: string;
  name: string;
  image: string;
  unit: string;
  price: number;
  quantity: number;
  total: number
}
