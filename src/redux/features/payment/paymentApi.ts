// src/redux/features/payment/paymentApi.ts

import { baseApi } from "@/redux/hooks/baseApi";
import { PaymentListResponse } from "./paymentTypes";

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /admin/payments
        getPayments: builder.query<PaymentListResponse, void>({
            query: () => ({
                url: "/admin/payments",
                method: "GET",
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({
                            type: "Payments" as const,
                            id,
                        })),
                        { type: "Payments", id: "LIST" },
                    ]
                    : [{ type: "Payments", id: "LIST" }],
            keepUnusedDataFor: 60,
        }),
    }),
});

export const { useGetPaymentsQuery } = paymentApi;