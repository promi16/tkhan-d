import { useState } from "react";
import {
  CreditCard,
  Search,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Payment } from "../../../redux/features/payment/paymentTypes";
import { useGetPaymentsQuery } from "../../../redux/features/payment/paymentApi";

interface PaymentHistoryTableProps {
  onViewDetails: (payment: Payment) => void;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "SUCCEEDED":
      return "bg-[#ECFDF5] text-[#016630]";
    case "PENDING":
      return "bg-[#FEF3C7] text-[#D97706]";
    case "FAILED":
      return "bg-[#FEF2F2] text-[#F04438]";
    case "REFUNDED":
      return "bg-[#E0E7FF] text-[#6366F1]";
    default:
      return "bg-[#F1F5F9] text-[#64748B]";
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case "SUCCEEDED":
      return "Paid";
    case "PENDING":
      return "Pending";
    case "FAILED":
      return "Failed";
    case "REFUNDED":
      return "Refunded";
    default:
      return status || "Unknown";
  }
};

const formatDate = (dateString?: string | null): string => {
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

export const PaymentHistoryTable = ({
  onViewDetails,
}: PaymentHistoryTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const { data, isLoading, isError } = useGetPaymentsQuery();

  const payments = data?.data ?? [];

  const filteredPayments = payments.filter((p) => {
    const q = searchTerm.toLowerCase();

    return (
      p.id.toLowerCase().includes(q) ||
      p.booking?.bookingNumber?.toLowerCase().includes(q) ||
      p.bookingId.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5">
      <div className="xl:col-span-4 w-full">
        <div className="w-full bg-white rounded-xl shadow-sm border border-[#E3E3E4] font-['Inter']">
          <div className="p-3 md:p-4 lg:p-6 border-b border-gray-200">
            <div className="relative w-full max-w-[500px]">
              <Search
                size={18}
                className="absolute inset-y-0 left-4 my-auto text-[#94A3B8]"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by transaction ID or booking number..."
                className="w-full pl-11 pr-4 py-2 md:py-3 bg-[#F8FAFC] border border-[#E3E3E4] rounded-xl text-[12px] md:text-[13px] text-[#1E293B] focus:outline-none focus:ring-1 focus:ring-[#FF6B35] transition-all"
              />
            </div>
          </div>

          <div className="w-full overflow-x-auto overflow-y-hidden bg-white [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
            <table className="min-w-[800px] w-full text-sm">
              <thead className="border-b border-[#DBE0E5] bg-gray-50">
                <tr>
                  {[
                    "Transaction ID",
                    "Booking Reference",
                    "Amount",
                    "Payment Method",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className={`px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-[11px] font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap ${
                        head === "Actions" ? "text-center" : "text-left"
                      }`}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 md:px-6 py-12 md:py-16 text-center"
                    >
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Loader2 size={20} className="animate-spin" />

                        <span className="text-sm md:text-base">
                          Loading payments...
                        </span>
                      </div>
                    </td>
                  </tr>
                )}

                {isError && !isLoading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 md:px-6 py-12 md:py-16 text-center"
                    >
                      <div className="flex items-center justify-center gap-2 text-red-400">
                        <AlertCircle size={20} />

                        <span className="text-sm md:text-base">
                          Failed to load payments. Please try again.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && filteredPayments.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 md:px-6 py-12 md:py-16 text-center text-gray-400 italic text-sm md:text-base"
                    >
                      {searchTerm
                        ? `No results for "${searchTerm}"`
                        : "No payments found."}
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isError &&
                  currentPayments.map((payment, index) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.25 }}
                      className="group hover:bg-orange-50/40 transition-colors duration-200"
                    >
                      <td className="px-4 md:px-6 py-4 md:py-5 font-mono text-[11px] md:text-xs text-[#1E293B] group-hover:text-[#FF6B35] whitespace-nowrap transition-colors duration-200">
                        {payment.id.slice(0, 8)}...
                      </td>

                      <td className="px-4 md:px-6 py-4 md:py-5 text-gray-700 font-medium text-[12px] md:text-[13px] group-hover:text-[#FF6B35] whitespace-nowrap transition-colors duration-200">
                        {payment.booking?.bookingNumber ?? "—"}
                      </td>

                      <td className="px-4 md:px-6 py-4 md:py-5 font-bold text-[#1E293B] text-[12px] md:text-[13px] group-hover:text-[#FF6B35] whitespace-nowrap transition-colors duration-200">
                        ${payment.amount} {payment.currency.toUpperCase()}
                      </td>

                      <td className="px-4 md:px-6 py-4 md:py-5">
                        <div className="flex items-center gap-2 text-gray-700 text-[12px] md:text-[13px] group-hover:text-[#FF6B35] transition-colors duration-200">
                          <CreditCard
                            size={14}
                            className="text-[#94A3B8] group-hover:text-[#FF6B35] transition-colors duration-200"
                          />
                          Stripe
                        </div>
                      </td>

                      <td className="px-4 md:px-6 py-4 md:py-5">
                        <span
                          className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-[11px] font-medium whitespace-nowrap ${getStatusColor(
                            payment.status,
                          )}`}
                        >
                          {getStatusText(payment.status)}
                        </span>
                      </td>

                      <td className="px-4 md:px-6 py-4 md:py-5 text-gray-600 text-[12px] md:text-[13px] group-hover:text-[#FF6B35] whitespace-nowrap transition-colors duration-200">
                        {formatDate(payment.createdAt)}
                      </td>

                      {/* FIXED */}
                      <td className="px-4 md:px-6 py-4 md:py-5 text-center">
                        <motion.button
                          onClick={() => onViewDetails(payment)}
                          whileHover={{
                            scale: 1.02,
                            backgroundColor: "#F97316",
                            color: "white",
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[#1E293B] font-medium text-[11px] md:text-[13px] hover:bg-orange-500 hover:text-white transition-all duration-200 whitespace-nowrap cursor-pointer inline-flex items-center justify-center"
                        >
                          View Details
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {!isLoading && !isError && filteredPayments.length > 0 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-[12px] md:text-[13px] text-[#64748B]">
              Showing{" "}
              <span className="font-semibold text-[#1E293B]">
                {startIndex + 1}–{Math.min(endIndex, filteredPayments.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#1E293B]">
                {filteredPayments.length}
              </span>{" "}
              payments
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  whileHover={currentPage !== 1 ? { scale: 1.08 } : {}}
                  whileTap={currentPage !== 1 ? { scale: 0.94 } : {}}
                  className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg border transition-all duration-200 ${
                    currentPage === 1
                      ? "border-gray-200 text-gray-300 cursor-not-allowed bg-white"
                      : "border-[#E3E3E4] text-[#1E293B] bg-white hover:border-[#FF6B35] hover:text-[#FF6B35] hover:shadow-md hover:shadow-orange-100 cursor-pointer"
                  }`}
                >
                  <ChevronLeft size={15} />
                </motion.button>

                <motion.button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  whileHover={currentPage !== totalPages ? { scale: 1.08 } : {}}
                  whileTap={currentPage !== totalPages ? { scale: 0.94 } : {}}
                  className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg border transition-all duration-200 ${
                    currentPage === totalPages
                      ? "border-gray-200 text-gray-300 cursor-not-allowed bg-white"
                      : "border-[#E3E3E4] text-[#1E293B] bg-white hover:border-[#FF6B35] hover:text-[#FF6B35] hover:shadow-md hover:shadow-orange-100 cursor-pointer"
                  }`}
                >
                  <ChevronRight size={15} />
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
