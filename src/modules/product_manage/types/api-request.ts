import type { RcFile } from 'antd/es/upload';

export type ProductAddRequest = {
    name: string;
    price: number;
    unit: string;
    description: string;
    stock: number;
    region: 'bac' | 'trung' | 'nam';
    isSpecialty: boolean;
    
    categoryId?: string;
    salePercent?: string; 

    origin: string;
    originDescription?: string;
    originFound?: string;
    story?: string;

    nutrition: {
        calories: number;
        protein: number;
        fat: number;
        carbs: number;
    };
    usage_instruction: string[];
    season: string[];
    image?: RcFile | File | any; 
    isActive?: boolean;
}