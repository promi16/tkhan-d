import React from "react";
import { motion } from "framer-motion";

interface UserBookingsProps {
  user?: {
    name: string;
  };
}

export const UserBookings: React.FC<UserBookingsProps> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 md:p-8 lg:p-10 rounded-[10px] border border-gray-100 shadow-sm w-full max-w-[1200px] min-h-fit lg:h-auto mb-10 md:mb-20"
    >
      <div className="flex justify-end mb-6">
        <span className="bg-[#10B981] text-white text-[10px] md:text-xs font-medium px-4 md:px-5 py-2 rounded-lg tracking-wide md:mr-5">
          Ongoing
        </span>
      </div>

      {/* Grid Breakpoint Logic:
          - Default (Mobile): 1 column (Add-ons & Seller both below)
          - md (Tablet/Small Laptop): 2 columns (Service & Add-ons side by side, Seller below)
          - 2xl (Large Desktop): 3 columns (All 3 parts side by side)
          Ami xl er jaygay 2xl diyechi jeno r o agei seller niche chole jay.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-12 gap-8 2xl:gap-12">
        {/* Left Column: Service Info */}
        <div className="2xl:col-span-4 space-y-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#FF6B35] p-5 w-full md:max-w-[400px] rounded-2xl text-white shadow-lg shadow-orange-100"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">$</span>
              <p className="text-[10px] font-medium opacity-90 tracking-widest uppercase">
                Total Package
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
              $173
            </h2>
          </motion.div>

          <div className="space-y-4">
            <h4 className="font-medium text-[#1E293B] text-[13px] sm:ml-3">
              Service Information
            </h4>
            <div className="space-y-4 sm:ml-3">
              <div className="flex justify-between items-center">
                <p className="text-xs text-[#64748B] font-normal">Service</p>
                <p className="text-md font-medium text-[#FF6B35]">$120</p>
              </div>
              <p className="text-sm font-medium text-[#1E293B] -mt-2">
                Premium Service Package
              </p>

              <div className="bg-[#FFF7F4] p-4 rounded-xl border border-[#FFEDE8] space-y-1 w-full md:max-w-[350px]">
                <div className="flex items-center gap-2 text-[#FF6B35]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <p className="text-[13px] font-light text-gray-400">
                    Date & Time
                  </p>
                </div>
                <p className="text-sm font-light text-[#1E293B]">
                  Apr 13, 2026
                </p>
                <p className="text-sm font-light text-[#FF6B35]">10:00 AM</p>
              </div>

              <div>
                <p className="text-[13px] text-[#94A3B8] font-light">
                  Duration
                </p>
                <p className="text-md font-medium text-[#1E293B]">2 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Add-Ons */}
        <div className="2xl:col-span-5 space-y-12 md:space-y-20 2xl:ml-8">
          <div>
            <h4 className="font-medium text-black text-[16px] flex items-center gap-2 mb-6">
              <span className="text-[#FF6B35]">✦</span> Add-Ons Selected
            </h4>

            <div className="space-y-6 w-full md:max-w-[380px]">
              {[
                { n: "De-shedding Treatment", p: 25, d: "20 mins" },
                { n: "Nail Grinding", p: 10, d: "10 mins" },
                { n: "Ear Deep Clean", p: 18, d: "15 mins" },
              ].map((a, i) => (
                <div
                  key={i}
                  className="border-b border-gray-100 pb-3 flex justify-between items-start"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1E293B]">{a.n}</p>
                    <p className="text-[11px] text-[#94A3B8] font-normal">
                      {a.d}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-[#FF6B35]">
                    ${a.p}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-[#1E293B] text-[15px]">
              Service Location
            </h4>
            <div className="bg-orange-50 p-3 px-4 max-w-fit rounded-xl border border-gray-100 inline-flex items-center gap-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FF6B35"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <motion.span
                whileHover={{ scale: 1.05, color: "#e55a2b" }}
                className="text-sm font-light text-[#FF6B35] cursor-pointer inline-block"
              >
                At-home Groom
              </motion.span>
            </div>
            <div className="space-y-1">
              <p className="text-[14px] text-gray-500 font-light flex items-center gap-2">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  color="#FF6B35"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Complete Address
              </p>
              <p className="text-sm font-medium text-[#1E293B] max-w-[250px] leading-relaxed">
                123 Main Street, Apt 4B, New York, NY 10001
              </p>
            </div>
          </div>
        </div>

        {/* Right/Bottom Column: Seller */}
        {/* md:col-span-2 ensures it takes full width on tablets, 2xl:col-span-3 brings it back to row on large screens */}
        <div className="md:col-span-2 2xl:col-span-3">
          <div className="bg-white px-6 md:px-10 py-5 rounded-2xl text-center border border-[#FFEDE8] shadow-sm max-w-sm mx-auto 2xl:mx-0 2xl:mt-0 mt-8">
            <p className="text-[15px] text-[#94A3B8] font-medium mb-4">
              Seller
            </p>
            <div className="relative inline-block">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
                className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover shadow-sm"
                alt="seller"
              />
            </div>
            <h3 className="font-medium text-[#1E293B] text-base mb-6 tracking-tight">
              {user?.name || "Sarah Jenkins"}
            </h3>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-2 bg-[#FF6B35] text-white rounded-xl font-medium text-[12px] whitespace-nowrap tracking-[0.15em] cursor-pointer transition-all"
            >
              View Details
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
