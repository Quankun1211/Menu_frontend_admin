export type logInRequest = {
    username: string;
    password: string;
}

export type RegisterRequest = {
    username: string;
    email: string;
    name: string;
    password: string;
    confirm_password: string;
    agree: boolean;
}
