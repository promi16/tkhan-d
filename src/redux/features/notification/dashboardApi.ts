// src/redux/features/dashboard/dashboardApi.ts

import { baseApi } from "../../hooks/baseApi";

export interface BookingTrend {
    date: string;
    count: number;
}

export interface RevenueTrend {
    date: string;
    amount: number;
}

export interface RecentUser {
    id: string;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface DashboardOverview {
    totalUsers: number;
    activeGroomers: number;
    todaysBookings: number;
    totalPlatformRevenue: number;
    bookingTrend: BookingTrend[];
    revenueTrend: RevenueTrend[];
    recentUserRegistrations: RecentUser[];
}

export interface DashboardOverviewResponse {
    success: boolean;
    data: DashboardOverview;
}

const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardOverview: builder.query<DashboardOverviewResponse, void>({
            query: () => ({
                url: `/dashboard/overview`,
                method: "GET",
            }),
            providesTags: ["Dashboard"],
            keepUnusedDataFor: 120,
        }),
    }),
    overrideExisting: false,
});

export const { useGetDashboardOverviewQuery } = dashboardApi;