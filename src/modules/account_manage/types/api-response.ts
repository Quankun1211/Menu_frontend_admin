export type UserResponse = {
    _id: string,
    username: string,
    role: string,
    name: string,
    email: string,
    phone: string
    isOnline?: boolean
    distanceKm?: number | null
    activeOrderCount?: number
    maxActiveOrders?: number
}
