import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import type {
  BookingTrendItem,
  RevenueTrendItem,
  ChartDataPoint,
} from "../../../redux/features/chart/chartTypes";

interface ChartsSectionProps {
  bookingTrend: BookingTrendItem[];
  revenueTrend: RevenueTrendItem[];
  totalPlatformRevenue?: string | number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    payload?: { isToday?: boolean };
  }>;
  label?: string;
  type: "bookings" | "revenue";
}

const formatDisplayLabel = (dateStr: string): string => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getTodayStr = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  type,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-sm">
      <p className="text-[11px] text-gray-400 mb-1">{label}</p>
      {type === "bookings" ? (
        <p className="font-semibold text-[#FF6B35]">
          Bookings: {payload[0]?.value ?? 0}
        </p>
      ) : (
        <p className="font-semibold text-[#FF6B35]">
          $
          {(payload[0]?.value ?? 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          {payload[0]?.payload?.isToday && (
            <span className="text-green-500 text-[10px] ml-1">(Today)</span>
          )}
        </p>
      )}
    </div>
  );
};

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  bookingTrend,
  revenueTrend,
  totalPlatformRevenue = "0",
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const todayStr = useMemo(() => getTodayStr(), []);

  const revenueString = String(totalPlatformRevenue || "0");

  const bookingChartData: ChartDataPoint[] = useMemo(() => {
    return bookingTrend.map((item) => ({
      name: formatDisplayLabel(item.day),
      fullDate: item.day,
      bookings: item.count,
      isToday: item.day === todayStr,
    }));
  }, [bookingTrend, todayStr]);

  const revenueChartData: ChartDataPoint[] = useMemo(() => {
    return revenueTrend.map((item) => ({
      name: formatDisplayLabel(item.day),
      fullDate: item.day,
      revenue: parseFloat(String(item.revenue)) || 0,
      isToday: item.day === todayStr,
    }));
  }, [revenueTrend, todayStr]);

  const hasRevenueData = revenueChartData.some((d) => (d.revenue ?? 0) > 0);

  const maxBookings = useMemo(() => {
    const max = Math.max(...bookingChartData.map((d) => d.bookings ?? 0), 0);
    if (max === 0) return 10;
    return Math.ceil(max * 1.3);
  }, [bookingChartData]);

  const maxRevenue = useMemo(() => {
    const max = Math.max(...revenueChartData.map((d) => d.revenue ?? 0), 0);
    if (max === 0) return 10;
    return Math.ceil(max * 1.3);
  }, [revenueChartData]);

  const cardClass =
    "bg-white p-4 sm:p-6 lg:p-8 rounded-xl border border-gray-100 shadow-sm";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 font-inter">
      {/* Bookings Trend */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{
          y: -6,
          boxShadow: "0 20px 40px -12px rgba(255,107,53,0.15)",
          transition: { duration: 0.25 },
        }}
        onHoverStart={() => setHoveredCard("bookings")}
        onHoverEnd={() => setHoveredCard(null)}
        transition={{ duration: 0.45, type: "spring", stiffness: 110 }}
        className={cardClass}
      >
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3
              className="text-[17px] font-semibold transition-colors duration-200"
              style={{
                color: hoveredCard === "bookings" ? "#FF6B35" : "#0f2f1d",
              }}
            >
              Bookings Trend
            </h3>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Last {bookingChartData.length} Days Overview
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#FFF4EF] flex items-center justify-center">
            <svg
              className="w-4 h-4 text-[#FF6B35]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={bookingChartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="gradBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                dy={10}
                height={50}
                interval={
                  bookingChartData.length > 14
                    ? Math.floor(bookingChartData.length / 7)
                    : 0
                }
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                domain={[0, maxBookings]}
                width={30}
              />
              <Tooltip content={<CustomTooltip type="bookings" />} />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#FF6B35"
                strokeWidth={2.5}
                fill="url(#gradBookings)"
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#FF6B35",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Revenue Trend */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{
          y: -6,
          boxShadow: "0 20px 40px -12px rgba(255,107,53,0.15)",
          transition: { duration: 0.25 },
        }}
        onHoverStart={() => setHoveredCard("revenue")}
        onHoverEnd={() => setHoveredCard(null)}
        transition={{
          duration: 0.45,
          delay: 0.1,
          type: "spring",
          stiffness: 110,
        }}
        className={cardClass}
      >
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3
              className="text-[17px] font-semibold transition-colors duration-200"
              style={{
                color: hoveredCard === "revenue" ? "#FF6B35" : "#0f2f1d",
              }}
            >
              Revenue Trend
            </h3>
            <p className="text-[12px] text-gray-400 mt-0.5">
              Last {revenueChartData.length} Days Overview
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#FFF4EF] flex items-center justify-center">
            <svg
              className="w-4 h-4 text-[#FF6B35]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueChartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              barSize={32}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                dy={10}
                height={50}
                interval={
                  revenueChartData.length > 14
                    ? Math.floor(revenueChartData.length / 7)
                    : 0
                }
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                domain={[0, maxRevenue]}
                width={42}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`
                }
              />
              <Tooltip content={<CustomTooltip type="revenue" />} />
              <Bar
                dataKey="revenue"
                radius={[0, 0, 0, 0]}
                animationDuration={1200}
                animationBegin={150}
              >
                {revenueChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.isToday
                        ? "#e55a2b"
                        : (entry.revenue ?? 0) > 0
                          ? "#FF6B35"
                          : "#f3f4f6"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {hasRevenueData ? (
          <p className="text-center text-[12px] text-gray-400 mt-3">
            Total Platform Revenue:{" "}
            <span className="font-bold text-[#FF6B35]">
              $
              {parseFloat(revenueString).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </p>
        ) : (
          <p className="text-center text-[11px] text-gray-400 mt-2">
            Revenue will appear once bookings are completed
          </p>
        )}
      </motion.div>
    </div>
  );
};
