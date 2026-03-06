import type { RcFile } from 'antd/es/upload';

export type CreateCategoryRequest = {
    name: string;
    title?: string;
    description?: string;
    type: 'product' | 'menu' | 'recipe';
    image?: RcFile | File | any; 
};