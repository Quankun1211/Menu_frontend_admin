import api from "../../../services/axios";

export type AdminTransaction = {
  _id: string;
  orderId?: {
    _id: string;
    status: string;
    paymentStatus: string;
    refundStatus: string;
    totalPrice: number;
  };
  userId?: { name: string; email: string };
  amount: number;
  paymentMethod: string;
  status: string;
  refundRetryCount: number;
  lastRefundError?: string;
  nextRefundRetryAt?: string;
  createdAt: string;
};

export const getTransactionsApi = async (params: Record<string, unknown>) => {
  const response = await api.get("/admin/transactions", { params });
  return response.data;
};

export const retryRefundApi = async (orderId: string) => {
  const response = await api.post(`/admin/refunds/${orderId}/attempts`);
  return response.data;
};
