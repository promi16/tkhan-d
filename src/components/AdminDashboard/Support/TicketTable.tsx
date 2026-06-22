import React, { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import type { Ticket } from "../../../redux/features/ticket/ticketTypes";

interface TicketTableProps {
  tickets: Ticket[];
  isLoading: boolean;
  isError: boolean;
  onSelectTicket: (t: Ticket) => void;
}

const ITEMS_PER_PAGE = 5;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  isLoading,
  isError,
  onSelectTicket,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTickets = tickets.filter((ticket) => {
    const q = searchTerm.toLowerCase();

    return (
      ticket.id.toLowerCase().includes(q) ||
      ticket.subject.toLowerCase().includes(q) ||
      ticket.status.toLowerCase().includes(q)
    );
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="w-full flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-4 w-full">
          <div className="w-full bg-white rounded-xl shadow-sm border border-[#E3E3E4]">
            <div className="p-3 sm:p-4 bg-white border-b border-[#E3E3E4]">
              <div className="relative w-full max-w-md">
                <Search
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />

                <input
                  type="text"
                  placeholder="Search by ID, subject, status..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-[#F9FAFB] border border-[#E3E3E4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26522]/20 text-xs sm:text-sm transition-all"
                />
              </div>
            </div>

            <div className="ticket-scroll-x w-full overflow-x-auto">
              <div className="ticket-scroll-y max-h-[500px] overflow-y-auto">
                <table className="min-w-[800px] w-full text-sm border-collapse">
                  <thead className="border-b border-[#DBE0E5] bg-gray-50 sticky top-0 z-10">
                    <tr className="text-gray-500">
                      {[
                        "Ticket ID",
                        "Subject",
                        "Related Booking",
                        "Messages",
                        "Status",
                        "Date Reported",
                        "Actions",
                      ].map((col) => (
                        <th
                          key={col}
                          className={`px-4 sm:px-6 py-3 sm:py-4 uppercase text-[9px] sm:text-[10px] md:text-[11px] font-semibold tracking-wider whitespace-nowrap bg-gray-50 ${
                            col === "Actions" ? "text-center" : "text-left"
                          }`}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#E3E3E4]">
                    {!isLoading &&
                      !isError &&
                      paginatedTickets.map((ticket, index) => (
                        <motion.tr
                          key={ticket.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          className="group cursor-pointer transition-all duration-300 hover:bg-[#FFF5F2]"
                          onClick={() => onSelectTicket(ticket)}
                        >
                          <td className="px-4 sm:px-6 py-3 sm:py-4 font-mono text-[10px] sm:text-xs text-[#1A1A1A] whitespace-nowrap">
                            {ticket.id.slice(0, 8)}...
                          </td>

                          <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-[#1A1A1A] max-w-[200px] truncate text-[11px] sm:text-sm">
                            {ticket.subject}
                          </td>

                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 text-[10px] sm:text-xs whitespace-nowrap">
                            {ticket.relatedBookingId
                              ? ticket.relatedBookingId.slice(0, 8) + "..."
                              : "—"}
                          </td>

                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 text-center text-[11px] sm:text-sm">
                            {ticket.messages.length}
                          </td>

                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <span
                              className={`px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[11px] font-medium inline-block min-w-[70px] sm:min-w-[80px] text-center transition-all duration-200 ${
                                ticket.status === "RESOLVED"
                                  ? "bg-[#E6F9F1] text-[#00A360]"
                                  : "bg-[#FFF7ED] text-[#C2410C]"
                              }`}
                            >
                              {ticket.status === "RESOLVED"
                                ? "Resolved"
                                : "Open"}
                            </span>
                          </td>

                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 whitespace-nowrap text-[10px] sm:text-xs">
                            {formatDate(ticket.createdAt)}
                          </td>

                          {/* FIXED */}
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-center align-middle">
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectTicket(ticket);
                              }}
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: "#F26522",
                                color: "white",
                              }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="px-3 sm:px-5 py-1.5 sm:py-2 whitespace-nowrap rounded-lg text-[#1A1A1A] font-medium hover:bg-[#F26522] hover:text-white hover:border-transparent transition-all duration-200 text-[10px] sm:text-sm active:scale-95 cursor-pointer inline-flex items-center justify-center"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketTable;
