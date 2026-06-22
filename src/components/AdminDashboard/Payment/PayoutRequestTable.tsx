import { useMemo, useState } from "react";
import {
  Search,
  Wallet,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useGetWithdrawalRequestsQuery } from "@/redux/features/payout/payoutApi";
import {
  WithdrawalRequest,
  WithdrawalStatus,
} from "@/redux/features/payout/payoutTypes";

interface PayoutRequestTableProps {
  onViewDetails: (request: WithdrawalRequest) => void;
}

const ITEMS_PER_PAGE = 5;

const statusStyles = {
  REQUESTED: {
    bg: "bg-[#FFEDD4]",
    text: "text-[#9F2D00]",
    label: "Requested",
  },
  APPROVED: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: "Approved",
  },
  REJECTED: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: "Rejected",
  },
  PAID: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    label: "Paid",
  },
} as const satisfies Record<
  WithdrawalStatus,
  { bg: string; text: string; label: string }
>;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -3 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const PayoutRequestTable = ({
  onViewDetails,
}: PayoutRequestTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useGetWithdrawalRequestsQuery({
    page: 1,
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const requests = data?.data?.items ?? [];

  const filtered = useMemo(() => {
    return requests.filter((req) => {
      const term = searchTerm.toLowerCase();

      return (
        req.id.toLowerCase().includes(term) ||
        req.groomer?.user?.fullName?.toLowerCase().includes(term) ||
        req.groomer?.legalFullName?.toLowerCase().includes(term) ||
        req.bankAccount?.accountHolderName?.toLowerCase().includes(term)
      );
    });
  }, [requests, searchTerm]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[#E3E3E4] shadow-sm p-12 flex items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#FF6B35]" size={24} />
        <span className="text-[#64748B] text-sm sm:text-[15px]">
          Loading withdrawal requests...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl border border-[#E3E3E4] shadow-sm p-12 text-center text-red-500 text-sm sm:text-[15px]">
        Failed to load requests. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full font-['Inter']">
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-4 w-full">
          <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm border border-[#E3E3E4]">
            <div className="p-4 sm:p-5 border-b border-[#E5E7EB]">
              <div className="relative w-full max-w-[650px]">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                  size={18}
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by ID, groomer name..."
                  className="w-full pl-11 pr-4 py-3 border border-[#E2E8F0] rounded-lg text-[13px] sm:text-[14px] md:text-[15px] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
                />
              </div>
            </div>

            <table className="min-w-[860px] w-full text-sm">
              <thead className="border-b border-[#DBE0E5] bg-gray-50">
                <tr>
                  {[
                    "Request ID",
                    "Groomer",
                    "Amount",
                    "Bank Account",
                    "Request Date",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-4 sm:px-6 py-4 text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap ${
                        h === "Actions" ? "text-center" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <motion.tbody
                key={`${currentPage}-${searchTerm}`}
                className="divide-y divide-[#F1F5F9]"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {paginatedData.length > 0 ? (
                  paginatedData.map((req) => {
                    const style =
                      statusStyles[req.status] ?? statusStyles.REQUESTED;

                    const groomerName =
                      req.groomer?.user?.fullName ??
                      req.groomer?.legalFullName ??
                      "—";

                    const groomerId = req.groomer?.userId ?? req.groomerId;

                    return (
                      <motion.tr
                        key={req.id}
                        variants={rowVariants}
                        whileHover={{
                          backgroundColor: "#FFF7ED",
                        }}
                        className="transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4 font-medium text-[#1E293B] font-mono text-[11px] sm:text-xs whitespace-nowrap">
                          {req.id.slice(0, 8)}…
                        </td>

                        <td className="px-4 sm:px-6 py-4">
                          <div className="font-medium text-[#1E293B] text-[12px] sm:text-[13px] md:text-sm">
                            {groomerName}
                          </div>

                          <div className="text-[10px] sm:text-[11px] text-[#94A3B8] font-mono">
                            {groomerId.slice(0, 8)}…
                          </div>
                        </td>

                        <td className="px-4 sm:px-6 py-4 font-bold text-[#1E293B] text-[12px] sm:text-sm whitespace-nowrap">
                          ${req.amountRequested}
                          <span className="text-[10px] sm:text-[11px] font-normal text-[#94A3B8] uppercase ml-1">
                            {req.currency}
                          </span>
                        </td>

                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Wallet size={15} />

                            <div>
                              <div className="text-[12px] sm:text-[13px]">
                                {req.bankAccount?.bankName ?? "—"}
                              </div>

                              <div className="text-[10px] sm:text-[11px] text-[#94A3B8]">
                                {req.bankAccount?.accountNumber
                                  ? `****${req.bankAccount.accountNumber.slice(
                                      -4,
                                    )}`
                                  : "—"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 sm:px-6 py-4 text-gray-600 whitespace-nowrap text-[12px] sm:text-[13px]">
                          {new Date(req.requestedAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>

                        <td className="px-4 sm:px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] md:text-[12px] font-medium ${style.bg} ${style.text}`}
                          >
                            {style.label}
                          </span>
                        </td>

                        <td className="px-4 sm:px-6 py-4 text-center">
                          <motion.button
                            onClick={() => onViewDetails(req)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="text-gray-700 px-3 sm:px-4 py-2 rounded-lg font-medium text-[12px] sm:text-sm hover:bg-orange-500 hover:text-white whitespace-nowrap transition-all duration-200 cursor-pointer hover:border-orange-500 inline-flex items-center justify-center"
                          >
                            View Details
                          </motion.button>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-400 italic text-sm"
                    >
                      {searchTerm
                        ? `No requests found matching "${searchTerm}"`
                        : "No withdrawal requests found."}
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </table>
          </div>
        </div>
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between mt-5 px-1">
          <p className="text-[12px] sm:text-[13px] text-[#64748B]">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{" "}
            {filtered.length} requests
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-xl cursor-pointer border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#FFF4EF] hover:text-[#FF6B35] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-xl cursor-pointer border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#FFF4EF] hover:text-[#FF6B35] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
