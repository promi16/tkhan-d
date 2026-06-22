// src/types/chartTypes.ts

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

export interface ChartDataPoint {
    name: string;
    fullDate: string;
    bookings?: number;
    revenue?: number;
    isToday?: boolean;
}