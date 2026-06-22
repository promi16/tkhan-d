
export interface Category {
    id: string;
    name: string;
    description: string;
    imageUrl: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryListResponse {
    success: boolean;
    data: {
        items: Category[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

export interface CategorySingleResponse {
    success: boolean;
    data: Category;
}

export interface CreateCategoryRequest {
    name: string;
    description: string;
    active: boolean;
    image?: File | null;
}

export interface UpdateCategoryRequest {
    id: string;
    name?: string;
    description?: string;
    active?: boolean;
    image?: File | null;
}