// src/redux/features/payout/payoutApi.ts

import { baseApi } from "@/redux/hooks/baseApi";
import {
    PayoutsResponse,
    WithdrawalRequestsResponse,
    WithdrawalRequestSingleResponse,
} from "./payoutTypes";

interface ApprovePayload {
    id: string;
    note?: string;
}

interface RejectPayload {
    id: string;
    reason: string;
}

interface MarkPaidPayload {
    id: string;
    transferReference: string;
    note?: string;
}

export const payoutApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /payouts
        getPayouts: builder.query<PayoutsResponse, void>({
            query: () => ({ url: "/payouts", method: "GET" }),
            providesTags: ["PayoutRequests"],
            keepUnusedDataFor: 60,
        }),

        // GET /payouts/withdrawal-requests
        getWithdrawalRequests: builder.query<
            WithdrawalRequestsResponse,
            { page?: number; limit?: number; sortBy?: string; sortOrder?: string }
        >({
            query: ({
                page = 1,
                limit = 20,
                sortBy = "createdAt",
                sortOrder = "desc",
            } = {}) => ({
                url: `/payouts/withdrawal-requests?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
                method: "GET",
            }),
            providesTags: ["PayoutRequests"],
            keepUnusedDataFor: 30,
        }),

        // PATCH /payouts/withdrawal-requests/:id/approve
        approveWithdrawalRequest: builder.mutation<
            WithdrawalRequestSingleResponse,
            ApprovePayload
        >({
            query: ({ id, note }) => ({
                url: `/payouts/withdrawal-requests/${id}/approve`,
                method: "PATCH",
                body: { note },
            }),
            invalidatesTags: ["PayoutRequests"],
        }),

        // PATCH /payouts/withdrawal-requests/:id/reject
        rejectWithdrawalRequest: builder.mutation<
            WithdrawalRequestSingleResponse,
            RejectPayload
        >({
            query: ({ id, reason }) => ({
                url: `/payouts/withdrawal-requests/${id}/reject`,
                method: "PATCH",
                body: { reason },
            }),
            invalidatesTags: ["PayoutRequests"],
        }),

        // PATCH /payouts/withdrawal-requests/:id/mark-paid
        markWithdrawalRequestPaid: builder.mutation<
            WithdrawalRequestSingleResponse,
            MarkPaidPayload
        >({
            query: ({ id, transferReference, note }) => ({
                url: `/payouts/withdrawal-requests/${id}/mark-paid`,
                method: "PATCH",
                body: { transferReference, note },
            }),
            invalidatesTags: ["PayoutRequests"],
        }),
    }),
});

export const {
    useGetPayoutsQuery,
    useGetWithdrawalRequestsQuery,
    useApproveWithdrawalRequestMutation,
    useRejectWithdrawalRequestMutation,
    useMarkWithdrawalRequestPaidMutation,
} = payoutApi;