import api from "../../../services/axios";

export const getShippingFee = async (): Promise<number> => {
  const response = await api.get("/config/shipping");
  return Number(response.data?.data?.shippingFee ?? 25000);
};

export const updateShippingFee = async (shippingFee: number): Promise<number> => {
  const response = await api.put("/config/shipping", { shippingFee });
  return Number(response.data?.data?.shippingFee);
};
