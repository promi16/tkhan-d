import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RecentUser } from "../../../redux/features/dashboard/dashboardType";

interface RecentUsersProps {
  users: RecentUser[];
}

export const RecentUsers: React.FC<RecentUsersProps> = ({ users }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return `Joined yesterday`;
    if (diffDays < 7) return `Joined ${diffDays} days ago`;
    return `Joined ${date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}`;
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case "buyer":
        return "bg-gray-100 text-gray-600 border border-gray-200";
      case "groomer":
        return "bg-[#E3E8FE] text-[#3A5CFF] border border-[#3A5CFF]/10";
      case "admin":
        return "bg-purple-100 text-purple-600 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  if (!users || users.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[12px] border border-gray-100 shadow-sm font-inter"
      >
        <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-4">
          <h3 className="text-[15px] sm:text-[16px] lg:text-[18px] font-semibold text-[#0f2f1d]">
            Recent User Registrations
          </h3>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 text-[12px] sm:text-[13px] lg:text-[14px]">
            No recent user registrations
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-3 font-inter">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[12px] border border-gray-100 shadow-sm"
      >
        <div className="px-4 sm:px-6 lg:px-10 pt-5 sm:pt-6 lg:pt-8 pb-3 sm:pb-4">
          <h3 className="text-[15px] sm:text-[16px] lg:text-[18px] font-semibold text-[#0f2f1d]">
            Recent User Registrations
          </h3>
          <p className="text-[10px] sm:text-[11px] lg:text-[13px] text-gray-400 font-normal mt-1">
            Showing {startIndex + 1}–{Math.min(endIndex, users.length)} of{" "}
            {users.length} users
          </p>
        </div>

        <div className="w-full bg-white rounded-b-[12px] border-t border-gray-100">
          <table className="w-full text-sm border-collapse">
            <tbody>
              <AnimatePresence mode="wait">
                {currentUsers.map((user, idx) => (
                  <motion.tr
                    key={user.id ?? user.email}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-t border-gray-50 hover:bg-orange-50/30 transition-colors group"
                  >
                    <td className="pl-3 sm:pl-4 lg:pl-10 pr-2 py-3 sm:py-4 lg:py-5">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[#0f2f1d] text-[12px] sm:text-[13px] lg:text-[15px] font-semibold leading-tight group-hover:text-[#FF6B35] transition-colors truncate">
                          {user.fullName}
                        </span>
                        <span className="text-[10px] sm:text-[11px] lg:text-[13px] text-gray-500 font-normal truncate">
                          {user.email}
                        </span>
                        <span className="text-[9px] sm:text-[10px] lg:text-[12px] text-gray-400 font-normal">
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 sm:py-4 lg:py-5 align-middle pr-3 sm:pr-4 lg:pr-10">
                      <div className="flex justify-start">
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`inline-block px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] lg:text-[11px] font-medium text-center transition-all capitalize whitespace-nowrap ${getRoleBadgeStyle(
                            user.role,
                          )}`}
                        >
                          {user.role.toLowerCase()}
                        </motion.span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-1.5 sm:gap-2 px-1">
          <motion.button
            whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center transition-all ${
              currentPage === 1
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "cursor-pointer bg-white border border-gray-200 text-gray-700 hover:border-[#FF6B35] hover:text-[#FF6B35] hover:bg-orange-50"
            }`}
          >
            <svg
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center transition-all ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "cursor-pointer bg-white border border-gray-200 text-gray-700 hover:border-[#FF6B35] hover:text-[#FF6B35] hover:bg-orange-50"
            }`}
          >
            <svg
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
        </div>
      )}
    </div>
  );
};
