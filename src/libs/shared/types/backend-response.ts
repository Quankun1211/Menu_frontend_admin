export type BackendResponse<T> = {
    code: T;
    data: T;
}
export type Pagination = {
    meta: {
        page: number;
        limit: number;
        total: number;
    }
}

export type BackendErrorResponse = {
    error: number;
    message: string;
    statusCode: number;
}