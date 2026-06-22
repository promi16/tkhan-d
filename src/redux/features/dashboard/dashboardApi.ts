import { baseApi } from "@/redux/hooks/baseApi";

export interface RecentUser {
    id: string;
    fullName: string;
    email: string;
    createdAt: string;
    role: string;
}

export interface DashboardOverview {
    totalUsers: number;
    activeGroomers: number;
    todaysBookings: number;
    totalPlatformRevenue: string;
    recentUserRegistrations: RecentUser[];
}

interface OverviewApiResponse {
    success: boolean;
    data: DashboardOverview;
}

export interface BookingTrendItem {
    day: string;
    count: number;
}

export interface RevenueTrendItem {
    day: string;
    revenue: string | number;
}

export interface TrendsApiResponse {
    success: boolean;
    data: {
        days: number;
        bookingTrend: BookingTrendItem[];
        revenueTrend: RevenueTrendItem[];
    };
}

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getDashboardOverview: builder.query<OverviewApiResponse, void>({
            query: () => ({
                url: "/dashboard/overview",
                method: "GET",
            }),
            providesTags: ["Dashboard"],
        }),

        getDashboardTrends: builder.query<TrendsApiResponse, { days?: number }>({
            query: ({ days = 7 } = {}) => ({
                url: `/dashboard/trends?days=${days}`,
                method: "GET",
            }),
            providesTags: ["Dashboard"],
        }),

    }),
});

export const {
    useGetDashboardOverviewQuery,
    useGetDashboardTrendsQuery,
} = dashboardApi;


