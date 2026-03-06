import { useNotification } from "../context/NotifycationContex";

export const lazyLoad = (importFunc: () => Promise<any>) => {
    return async () => {
        const module = await importFunc()
        return { Component: module.default }
    }
}

export const formatVND = (price: any) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
};

export const calcSale = (price: number, salePercent: number) => {
    return formatVND(price - (price * (salePercent / 100)))
}