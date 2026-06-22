import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GroomerProfile } from "@/redux/features/groomers/groomersType";
import { useGetPendingGroomersQuery } from "@/redux/features/groomers/groomersApi";

interface Props {
  onReviewClick: (groomer: GroomerProfile) => void;
}

const ITEMS_PER_PAGE = 5;

const ApplicationTable: React.FC<Props> = ({ onReviewClick }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isLoading, isError, error, refetch } =
    useGetPendingGroomersQuery();

  const groomers: GroomerProfile[] = data?.data || [];

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getExperienceText = (years: number): string => {
    return `${years} year${years > 1 ? "s" : ""} experience`;
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-[#E6F9F1] text-[#10B981]";
      case "REJECTED":
        return "bg-[#FEEBEB] text-[#E11D48]";
      default:
        return "bg-[#FFF0E6] text-[#E25822]";
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return groomers;

    const searchLower = searchTerm.toLowerCase();
    return groomers.filter((groomer) => {
      const email = groomer?.user?.email?.toLowerCase() || "";
      const phone = groomer?.user?.phone || "";
      const businessName = groomer?.businessName?.toLowerCase() || "";
      const fullName = groomer?.user?.fullName?.toLowerCase() || "";

      return (
        email.includes(searchLower) ||
        phone.includes(searchTerm) ||
        businessName.includes(searchLower) ||
        fullName.includes(searchLower)
      );
    });
  }, [groomers, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-[#E3E3E4] p-4 sm:p-5 md:p-6 lg:p-8">
        <div className="flex justify-center items-center h-40 sm:h-48 md:h-56 lg:h-64">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-[#E25822]"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-[#E3E3E4] p-4 sm:p-5 md:p-6 lg:p-8">
        <div className="text-center py-10 sm:py-12 md:py-16 lg:py-20">
          <p className="text-red-500 mb-2 text-xs sm:text-sm md:text-base">
            Failed to load applications. Please try again.
          </p>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mb-4 px-4 break-words">
            {error && typeof error === "object" && "message" in error
              ? String(error.message)
              : "Unknown error"}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#E25822] text-white rounded-lg hover:bg-[#c4471a] transition-colors text-xs sm:text-sm md:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!groomers || groomers.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-[#E3E3E4] p-4 sm:p-5 md:p-6 lg:p-8">
        <div className="text-center py-10 sm:py-12 md:py-16 lg:py-20">
          <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3">
            <Search
              size={28}
              className="text-gray-300 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12"
            />
            <h3 className="text-gray-900 font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
              No Pending Applications
            </h3>
            <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm">
              All groomer applications have been reviewed
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5">
      <div className="w-full">
        <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm border border-[#E3E3E4]">
          <table className="min-w-[700px] sm:min-w-[750px] md:min-w-[800px] lg:min-w-[900px] w-full text-sm border-separate border-spacing-0 font-['Inter']">
            <thead className="border-b border-[#DBE0E5] bg-gray-50">
              <tr className="bg-white border-b border-[#E5E7EB]">
                <th colSpan={6} className="p-3 sm:p-4 md:p-5">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Search by name, email, phone, or business..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E25822] focus:border-transparent"
                    />
                  </div>
                </th>
              </tr>
              <tr>
                <th colSpan={6}>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </th>
              </tr>
              <tr>
                <th className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 whitespace-nowrap text-gray-500 text-[9px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-wider bg-[#F9F9F9] text-left">
                  Business Name
                </th>
                <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5 whitespace-nowrap text-gray-500 text-[9px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-wider bg-[#F9F9F9] text-left">
                  Groomer Name
                </th>
                <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5 whitespace-nowrap text-gray-500 text-[9px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-wider bg-[#F9F9F9] text-left">
                  Email / Phone
                </th>
                <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5 whitespace-nowrap text-gray-500 text-[9px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-wider bg-[#F9F9F9] text-left">
                  Submission Date
                </th>
                <th className="px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5 whitespace-nowrap text-gray-500 text-[9px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-wider bg-[#F9F9F9] text-center">
                  Status
                </th>
                <th className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 whitespace-nowrap text-gray-500 text-[9px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-wider bg-[#F9F9F9] text-center">
                  Actions
                </th>
              </tr>
              <tr>
                <th colSpan={6}>
                  <div className="h-px bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {paginatedData.length > 0 ? (
                  paginatedData.map((groomer, i) => {
                    const isFirstThree = i < 3 && searchTerm === "";
                    const rowBg = isFirstThree ? "bg-[#FFF9F5]" : "bg-white";

                    const businessName = groomer?.businessName || "N/A";
                    const fullName = groomer?.user?.fullName || "N/A";
                    const experienceYears = groomer?.experienceYears || 0;
                    const email = groomer?.user?.email || "N/A";
                    const phone = groomer?.user?.phone || "N/A";
                    const createdAt = groomer?.createdAt || "";
                    const approvalStatus = groomer?.approvalStatus || "PENDING";

                    return (
                      <motion.tr
                        key={groomer?.id || i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative group transition-colors hover:bg-gray-50"
                      >
                        <td
                          className={`px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 text-xs sm:text-sm ${rowBg} text-gray-900 font-medium border-b border-gray-100`}
                        >
                          <div
                            className="truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[200px]"
                            title={businessName}
                          >
                            {businessName}
                          </div>
                        </td>
                        <td
                          className={`px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6 ${rowBg} border-b border-gray-100`}
                        >
                          <div className="font-medium whitespace-nowrap text-xs sm:text-sm text-gray-900">
                            {fullName}
                          </div>
                          <div className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-[12px] text-gray-500 whitespace-nowrap font-light mt-0.5">
                            {getExperienceText(experienceYears)}
                          </div>
                        </td>
                        <td
                          className={`px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6 ${rowBg} border-b border-gray-100`}
                        >
                          <div
                            className="text-xs sm:text-sm font-light text-gray-900 truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[200px]"
                            title={email}
                          >
                            {email}
                          </div>
                          <div className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-[12px] text-gray-500 font-light mt-0.5">
                            {phone}
                          </div>
                        </td>
                        <td
                          className={`px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6 text-xs sm:text-sm font-light text-black ${rowBg} border-b border-gray-100 whitespace-nowrap`}
                        >
                          {formatDate(createdAt)}
                        </td>
                        <td
                          className={`px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-5 lg:py-6 text-center ${rowBg} border-b border-gray-100`}
                        >
                          <span
                            className={`px-2 sm:px-3 md:px-4 py-1 rounded-full text-[9px] sm:text-[10px] md:text-[11px] lg:text-[13px] font-medium tracking-tight ${getStatusBadgeStyle(approvalStatus)}`}
                          >
                            {approvalStatus}
                          </span>
                        </td>
                        <td
                          className={`px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 text-center ${rowBg} border-b border-gray-100`}
                        >
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onReviewClick(groomer)}
                            className="text-gray-900 px-2 sm:px-3 md:px-4 lg:px-5 py-1 sm:py-1.5 md:py-2 rounded-lg font-medium text-[10px] sm:text-xs md:text-sm hover:bg-orange-500 hover:text-white transition-all whitespace-nowrap duration-200 cursor-pointer"
                          >
                            Review Application
                          </motion.button>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 sm:py-16 md:py-20 text-center bg-white"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3">
                        <Search
                          size={24}
                          className="text-gray-300 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8"
                        />
                        <h3 className="text-gray-900 font-bold text-sm sm:text-base md:text-lg">
                          No Results Found
                        </h3>
                        <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm">
                          {searchTerm
                            ? `No applications matching "${searchTerm}"`
                            : "No pending applications to review"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-2 mt-4 sm:mt-5 md:mt-6">
            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "#FF6B35",
                color: "white",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 cursor-pointer"
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
            </motion.button>

            <span className="text-xs sm:text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>

            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "#FF6B35",
                color: "white",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 cursor-pointer"
              }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTable;
