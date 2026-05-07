import React from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { motion } from "framer-motion";

interface ChartDataPoint {
  name: string;

  bookings: number;

  revenue: number;
}

interface ChartProps {
  data: ChartDataPoint[];
}

export const ChartsSection: React.FC<ChartProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 font-inter">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 md:p-8 rounded-[12px] border border-gray-100 shadow-sm"
      >
        <div className="mb-6">
          <h3 className="text-[18px] font-semibold text-[#0f2f1d]">
            Bookings Trend
          </h3>

          <p className="text-[13px] text-gray-400 font-normal">Last 7 days</p>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.1} />

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
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",

                  border: "none",

                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />

              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#FF6B35"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBookings)"
                dot={{ r: 4, fill: "#FF6B35", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-6 md:p-8 rounded-[12px] border border-gray-100 shadow-sm"
      >
        <div className="mb-6">
          <h3 className="text-[18px] font-semibold text-[#0f2f1d]">
            Revenue Trend
          </h3>

          <p className="text-[13px] text-gray-400 font-normal">Last 7 days</p>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
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
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />

              <Tooltip
                cursor={{ fill: "#f8f9fa" }}
                contentStyle={{
                  borderRadius: "12px",

                  border: "none",

                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />

              <Bar
                dataKey="revenue"
                fill="#FF6B35"
                radius={[6, 6, 0, 0]}
                barSize={35}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};
