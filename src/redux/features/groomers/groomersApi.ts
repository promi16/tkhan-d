// src/redux/features/groomers/groomersApi.ts

import { baseApi } from "@/redux/hooks/baseApi";
import type {
    PendingGroomersResponse,
    GroomerActionResponse,
    RejectGroomerRequest,
} from "./groomersType";

export const groomersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /admin/groomers/pending
        getPendingGroomers: builder.query<PendingGroomersResponse, void>({
            query: () => ({
                url: "/admin/groomers/pending",
                method: "GET",
            }),
            providesTags: ["PendingGroomers"],
            keepUnusedDataFor: 60,
        }),

        // PATCH /admin/groomers/:id/approve
        approveGroomer: builder.mutation<GroomerActionResponse, string>({
            query: (id) => ({
                url: `/admin/groomers/${id}/approve`,
                method: "PATCH",
            }),
            invalidatesTags: ["PendingGroomers", "Groomers"],
        }),

        // PATCH /admin/groomers/:id/reject
        rejectGroomer: builder.mutation<GroomerActionResponse, RejectGroomerRequest>({
            query: ({ id, reason }) => ({
                url: `/admin/groomers/${id}/reject`,
                method: "PATCH",
                body: { reason },
            }),
            invalidatesTags: ["PendingGroomers", "Groomers"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetPendingGroomersQuery,
    useApproveGroomerMutation,
    useRejectGroomerMutation,
} = groomersApi;