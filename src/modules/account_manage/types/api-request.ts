export type UserRegisterRequest = {
    name: string,
    username: string,
    email: string
    password: string,
    phone: string,
    role: string,
}

export type UserUpdateRequest = {
    name: string,
    username: string,
    email: string
    password?: string,
    phone: string,
    role: string,
}