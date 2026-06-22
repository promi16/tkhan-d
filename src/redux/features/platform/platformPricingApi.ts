// src/redux/features/platformPricing/platformPricingApi.ts

import { baseApi } from "@/redux/hooks/baseApi";
import {
    PlatformPricingResponse,
    UpdatePlatformPricingRequest,
} from "./platformPricingTypes";

export const platformPricingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /admin/platform-pricing
        getPlatformPricing: builder.query<PlatformPricingResponse, void>({
            query: () => ({
                url: "/admin/platform-pricing",
                method: "GET",
            }),
            providesTags: ["PlatformPricing"],
            // Pricing config rarely changes — safe to cache for 5 minutes
            keepUnusedDataFor: 300,
        }),

        // PATCH /admin/platform-pricing
        updatePlatformPricing: builder.mutation<
            PlatformPricingResponse,
            UpdatePlatformPricingRequest
        >({
            query: (body) => ({
                url: "/admin/platform-pricing",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["PlatformPricing"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetPlatformPricingQuery,
    useUpdatePlatformPricingMutation,
} = platformPricingApi;