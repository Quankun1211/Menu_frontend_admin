export type LoginResponse = {
    access_token: string;
    refresh_token: string;
    csrfToken?: string;
    username: string,
    _id: string,
    role: string,
    avatar: string,
    name: string,
    email: string
}
