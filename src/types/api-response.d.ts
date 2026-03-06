type UserRecord = {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    avatar: string;
    classId: string;
}

export type MetaResponse = {
    total: number;
    page: number;
    limit: number;
}

export type PaginationResponse<T> = {
    success: boolean;
    data: T[];
    meta: {
        total: number;
        page: number;
        pages: number;
    };
};