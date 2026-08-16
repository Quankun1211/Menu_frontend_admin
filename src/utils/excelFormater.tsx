import ExcelJS from "exceljs";
import type { OrderResponse } from "../modules/order_manage/types/api-response";

const ColumnOrder = (item: OrderResponse) => {
    return [
          {
            header: "Mã đơn hàng",
            key: "_id",
            width: 20,
            value: (item: OrderResponse) => `#VN-${item._id.slice(-5).toUpperCase()}`,
          },
          {
            header: "Khách hàng",
            key: "customer",
            width: 25,
            value: (item: OrderResponse) => item.userId?.name || item.address?.name || "",
          },
          {
            header: "Số điện thoại",
            key: "phone",
            width: 18,
            value: (item: OrderResponse) => item.address?.phone || "",
          },
          {
            header: "Địa chỉ",
            key: "address",
            width: 40,
            value: (item: OrderResponse) => item.address?.address || "",
          },
          {
            header: "Trạng thái",
            key: "status",
            width: 25,
            value: (item: OrderResponse) => getStatus(item.status),
          },
          {
            header: "Phương thức thanh toán",
            key: "paymentMethod",
            width: 22,
            value: (item: OrderResponse) => (item.paymentMethod || "cod").toUpperCase(),
          },
          {
            header: "Trạng thái thanh toán",
            key: "paymentStatus",
            width: 22,
            value: (item: OrderResponse) =>
              item.paymentStatus === "paid"
                ? "Đã thanh toán"
                : "Chưa thanh toán",
          },
          {
            header: "Shipper",
            key: "shipper",
            width: 25,
            value: (item: OrderResponse) => item.shipperInfo?.name || "Chưa phân công",
          },
          {
            header: "Tạm tính",
            key: "subTotal",
            width: 18,
            value: (item: OrderResponse) => item.subTotal || 0,
          },
          {
            header: "Phí vận chuyển",
            key: "shippingFee",
            width: 18,
            value: (item: OrderResponse) => item.shippingFee || 0,
          },
          {
            header: "Giảm giá",
            key: "couponDiscount",
            width: 18,
            value: (item: OrderResponse) => item.couponDiscount || 0,
          },
          {
            header: "Tổng tiền",
            key: "totalPrice",
            width: 18,
            value: (item: OrderResponse) => item.totalPrice || 0,
          },
          {
            header: "Ngày đặt",
            key: "createdAt",
            width: 22,
            value: (item: OrderResponse) =>
              item.createdAt
                ? new Date(item.createdAt).toLocaleString("vi-VN")
                : "",
          },
        ],
}

const getExcelColumnName = (index: number) => {
  let result = "";
  let number = index;

  while (number > 0) {
    const remainder = (number - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    number = Math.floor((number - 1) / 26);
  }

  return result;
};

type ColumnProps = {
    header: string;
    key: string;
    width?: number;
}

export const exportExcel = async ({
  data = [],
  columns = [],
  sheetName = "Data",
  fileName = "export.xlsx",
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = columns.map((column: ColumnProps) => ({
    header: column.header,
    key: column.key,
    width: column.width || 20,
  }));

  data.forEach((item) => {
    const row = {};

    columns.forEach((column) => {
      row[column.key] =
        typeof column.value === "function"
          ? column.value(item)
          : item[column.key];
    });

    worksheet.addRow(row);
  });

  const headerRow = worksheet.getRow(1);

  headerRow.font = {
    bold: true,
  };

  headerRow.alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  headerRow.height = 22;

  worksheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];

  if (columns.length > 0) {
    worksheet.autoFilter = {
      from: "A1",
      to: `${getExcelColumnName(columns.length)}1`,
    };
  }

  worksheet.eachRow((row) => {
    row.alignment = {
      vertical: "middle",
    };
  });

  return {
    workbook,
    fileName,
  };
};