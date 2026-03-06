export type AssignOrderRequest = {
    orderId: string,
    shipperId: string
}

export type CancelProcessRequest = {
    orderId: string,
    action: "accept" | "reject"
}