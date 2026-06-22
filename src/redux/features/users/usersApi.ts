// src/redux/features/users/usersApi.ts

import { baseApi } from "@/redux/hooks/baseApi";
import {
    UsersListResponse,
    UserDetailsResponse,
    BlockUserResponse,
    BlockUserRequest,
    GetUsersParams,
} from "./usersType";

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /admin/users
        getUsers: builder.query<UsersListResponse, GetUsersParams>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params.page) queryParams.append("page", params.page.toString());
                if (params.limit) queryParams.append("limit", params.limit.toString());
                if (params.sortBy) queryParams.append("sortBy", params.sortBy);
                if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
                if (params.role) queryParams.append("role", params.role);
                if (params.status) queryParams.append("status", params.status);
                if (params.search) queryParams.append("search", params.search);

                return {
                    url: "/admin/users",
                    method: "GET",
                    params: queryParams,
                };
            },
            providesTags: (result) =>
                result?.data?.items
                    ? [
                        ...result.data.items.map(({ id }: { id: string }) => ({
                            type: "User" as const,
                            id,
                        })),
                        { type: "User", id: "LIST" },
                    ]
                    : [{ type: "User", id: "LIST" }],
            keepUnusedDataFor: 30,
        }),

        // GET /admin/users/:id
        getUserDetails: builder.query<UserDetailsResponse, string>({
            query: (userId) => ({
                url: `/admin/users/${userId}`,
                method: "GET",
            }),
            providesTags: (_result, _error, userId) => [{ type: "User", id: userId }],
            keepUnusedDataFor: 60,
        }),

        // PATCH /admin/users/:id/block
        blockUser: builder.mutation<
            BlockUserResponse,
            { userId: string; data: BlockUserRequest }
        >({
            query: ({ userId, data }) => ({
                url: `/admin/users/${userId}/block`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { userId }) => [
                { type: "User", id: userId },
                { type: "User", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserDetailsQuery,
    useBlockUserMutation,
} = usersApi;