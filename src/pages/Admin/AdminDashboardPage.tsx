// src/pages/AdminDashboardPage.tsx
import type { RecentUser } from "@/redux/features/dashboard/dashboardType";
import {
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import {
  StatsCard,
  StatsGrid,
} from "@/components/AdminDashboard/Dashboard/StatsCard";
import { ChartsSection } from "@/components/AdminDashboard/Dashboard/ChartsSection";
import { RecentUsers } from "@/components/AdminDashboard/Dashboard/RecentUsers";
import {
  useGetDashboardOverviewQuery,
  useGetDashboardTrendsQuery,
} from "@/redux/features/dashboard/dashboardApi";

const AdminDashboardPage = () => {
  const {
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview,
  } = useGetDashboardOverviewQuery();

  const {
    data: trendsData,
    isLoading: trendsLoading,
    error: trendsError,
    refetch: refetchTrends,
  } = useGetDashboardTrendsQuery({ days: 7 });

  const isLoading = overviewLoading || trendsLoading;
  const hasError = overviewError || trendsError;

  const handleRefetch = () => {
    refetchOverview();
    refetchTrends();
  };

  if (isLoading) {
    return (
      <div className="bg-[#F9FAFB] w-full overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 md:p-8 rounded-[20px] border border-gray-100 shadow-sm animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-8 bg-gray-200 rounded w-16" />
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <div className="h-[360px] bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse" />
          <div className="h-[360px] bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse" />
        </div>
        <div className="h-[320px] bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-[#F9FAFB] min-h-full w-full flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to Load Dashboard
          </h3>
          <p className="text-gray-500 mb-6">
            Something went wrong while fetching the dashboard data.
          </p>
          <button
            onClick={handleRefetch}
            className="px-6 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const overview = overviewData?.data;
  const trends = trendsData?.data;

  return (
    <div className="bg-[#F9FAFB] w-full overflow-hidden">
      <div className="w-full">
        <StatsGrid>
          <StatsCard
            title="Total Users"
            value={overview?.totalUsers ?? 0}
            icon={Users}
          />
          <StatsCard
            title="Active Groomers"
            value={overview?.activeGroomers ?? 0}
            icon={Briefcase}
          />
          <StatsCard
            title="Today's Bookings"
            value={overview?.todaysBookings ?? 0}
            icon={Calendar}
          />
          <StatsCard
            title="Platform Revenue"
            value={`$${overview?.totalPlatformRevenue ?? "0"}`}
            icon={DollarSign}
          />
        </StatsGrid>

        <ChartsSection
          bookingTrend={trends?.bookingTrend ?? []}
          revenueTrend={trends?.revenueTrend ?? []}
          totalPlatformRevenue={overview?.totalPlatformRevenue ?? "0"}
        />

        <div className="mt-8 w-full">
          <RecentUsers
            users={(overview?.recentUserRegistrations as RecentUser[]) ?? []}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
