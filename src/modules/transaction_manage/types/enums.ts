export const TransactionStatus = {
    "pending": "Chờ xử lý",
    "completed": "Hoàn tất",
    "failed": "Thất bại",
    "refunded": "Đã hoàn tiền",
}

export const transactionStatusTransfer = (status: string) => {
    switch (status) {
        case "pending":
            return "Chờ xử lý";
        case "completed":
            return "Hoàn tất";
        case "failed":
            return "Thất bại";
        case "refunded":
            return "Đã hoàn tiền";
        default:
            return "Không xác định";
    }
}