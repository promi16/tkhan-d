import React, { useState } from "react";
import { motion } from "framer-motion";
import { User } from "../../../redux/features/users/usersType";

interface UserDetailsProps {
  user: User | undefined;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!user) {
    return (
      <div className="text-center py-10 text-gray-500">
        No user data available
      </div>
    );
  }

  const infoBlocks = [
    { label: "Full Name", value: user.fullName },
    { label: "User ID", value: user.id },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Role", value: user.role, type: "badge" },
    {
      label: "Status",
      value: user.isBlocked ? "BLOCKED" : user.status,
      type: "badge",
    },
    {
      label: "Join Date",
      value: new Date(user.createdAt).toLocaleDateString(),
    },
    { label: "Location", value: user.locationText || "Not specified" },
    {
      label: "Email Verified",
      value: user.emailVerified ? "Yes" : "No",
      type: "badge",
    },
    {
      label: "Total Bookings",
      value: user._count.bookingsAsBuyer + user._count.bookingsAsGroomer,
    },
  ];

  const getBadgeStyles = (value: string) => {
    const styles: Record<string, string> = {
      ADMIN: "bg-purple-100 text-purple-700",
      GROOMER: "bg-blue-100 text-blue-700",
      BUYER: "bg-slate-200 text-black",
      ACTIVE: "bg-emerald-100 text-emerald-800",
      INACTIVE: "bg-slate-100 text-slate-600",
      SUSPENDED: "bg-amber-100 text-amber-800",
      BLOCKED: "bg-rose-100 text-rose-800",
      Yes: "bg-green-100 text-green-700",
      No: "bg-red-100 text-red-700",
    };
    return styles[value] || "bg-gray-100 text-gray-700";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white p-4 sm:p-6 md:p-7 lg:p-8 rounded-[10px] border border-[#F1F5F9] shadow-sm w-full max-w-[650px] font-inter mx-auto md:mx-0"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 sm:gap-x-6 md:gap-x-10 lg:gap-x-12 gap-y-4 sm:gap-y-5 md:gap-y-6 lg:gap-y-8">
        {infoBlocks.map((item, idx) => {
          const isActive = activeIndex === idx;
          const stringValue = String(item.value);

          return (
            <div
              key={idx}
              className="flex flex-col gap-0.5 md:gap-1 cursor-pointer select-none"
              onClick={() => setActiveIndex(idx)}
            >
              <p
                className={`transition-colors duration-200 text-[9px] sm:text-[10px] md:text-[10px] lg:text-[11px] tracking-wider uppercase ${
                  isActive
                    ? "font-bold text-[#FF6B35]"
                    : "text-gray-400 font-medium"
                }`}
              >
                {item.label}
              </p>

              {item.type === "badge" ? (
                <div className="flex mt-0.5">
                  <span
                    className={`px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-[10px] lg:text-[11px] transition-all duration-200 ${
                      isActive
                        ? "ring-1 ring-[#FF6B35] font-bold"
                        : "font-medium"
                    } ${getBadgeStyles(stringValue)}`}
                  >
                    {stringValue}
                  </span>
                </div>
              ) : (
                <p
                  className={`transition-all duration-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] leading-tight break-words ${
                    isActive
                      ? "text-[#FF6B35] font-bold"
                      : "text-[#1E293B] font-medium"
                  }`}
                >
                  {stringValue}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
