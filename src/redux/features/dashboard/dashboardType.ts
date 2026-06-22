

export interface BookingTrend {
    _count: {
        _all: number;
    };
    status: string;
}

export interface RecentUser {
    id: string;        // ← ADD THIS
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
}


export interface RecentUser {
    fullName: string;
    phone: string;
    email: string;
    profileImage: string | null;
    locationText: string;
    state: string;
    role: string;
    status: string;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RevenueTrend {
    date?: string;
    revenue?: number;
    bookingCount?: number;
    status?: string;
    _count?: {
        _all: number;
    };
}

export interface DashboardOverviewResponse {
    success: boolean;
    data: {
        totalUsers: number;
        activeGroomers: number;
        todaysBookings: number;
        totalPlatformRevenue: number;
        bookingTrend: BookingTrend[];
        revenueTrend: RevenueTrend[];
        recentUserRegistrations: RecentUser[];
    };
}

export interface ChartDataPoint {
    name: string;
    bookings: number;
    revenue: number;
}

export interface StatsData {
    totalUsers: number;
    activeGroomers: number;
    todaysBookings: number;
    totalPlatformRevenue: number;
}