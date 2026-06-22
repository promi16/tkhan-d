

import { baseApi } from "@/redux/hooks/baseApi";
import {
    CategoryListResponse,
    CategorySingleResponse,
    CreateCategoryRequest,
    UpdateCategoryRequest,
} from "./categoryTypes";

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        
        getCategories: builder.query<CategoryListResponse, void>({
            query: () => ({
                url: "/categories",
                method: "GET",
                params: {
                    page: 1,
                    limit: 20,
                    sortBy: "createdAt",
                    sortOrder: "desc",
                },
            }),
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ id }) => ({
                            type: "Categories" as const,
                            id,
                        })),
                        { type: "Categories", id: "LIST" },
                    ]
                    : [{ type: "Categories", id: "LIST" }],
            keepUnusedDataFor: 120,
        }),

        
        getCategoryById: builder.query<CategorySingleResponse, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Categories", id }],
            keepUnusedDataFor: 120,
        }),

        
        createCategory: builder.mutation<CategorySingleResponse, CreateCategoryRequest>({
            query: ({ name, description, active, image }) => {
                const formData = new FormData();
                formData.append("name", name);
                formData.append("description", description);
                formData.append("active", String(active));
                if (image) formData.append("image", image);

                return {
                    url: "/categories",
                    method: "POST",
                    body: formData,
                  
                };
            },
            invalidatesTags: [{ type: "Categories", id: "LIST" }],
        }),

      
        updateCategory: builder.mutation<CategorySingleResponse, UpdateCategoryRequest>({
            query: ({ id, name, description, active, image }) => {
                const formData = new FormData();
                if (name !== undefined) formData.append("name", name);
                if (description !== undefined) formData.append("description", description);
                if (active !== undefined) formData.append("active", String(active));
                if (image) formData.append("image", image);

                return {
                    url: `/categories/${id}`,
                    method: "PATCH",
                    body: formData,
                    
                };
            },
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Categories", id },
                { type: "Categories", id: "LIST" },
            ],
        }),

      
        deleteCategory: builder.mutation<CategorySingleResponse, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Categories", id },
                { type: "Categories", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;