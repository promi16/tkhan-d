import React, { useState } from "react";
import { Search } from "lucide-react";
import { Ticket } from "../../../pages/Admin/SupportPage";

const MOCK_DATA: Ticket[] = [
  {
    id: "T001",
    user: "John Smith",
    booking: "B001",
    issue: "Service quality issue",
    status: "Replied",
    date: "2026-04-15",
  },
  {
    id: "T002",
    user: "Mike Davis",
    booking: "B002",
    issue: "Payment not processed",
    status: "Open",
    date: "2026-04-16",
  },
  {
    id: "T003",
    user: "James Taylor",
    booking: "B003",
    issue: "Seller cancelled last minute",
    status: "Open",
    date: "2026-04-16",
  },
  {
    id: "T004",
    user: "Sarah Johnson",
    booking: "B004",
    issue: "Buyer not responding",
    status: "Open",
    date: "2026-04-15",
  },
  {
    id: "T005",
    user: "Emily Brown",
    booking: "B005",
    issue: "Refund request",
    status: "Open",
    date: "2026-04-14",
  },
];

const TicketTable: React.FC<{ onSelectTicket: (t: Ticket) => void }> = ({
  onSelectTicket,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTickets = MOCK_DATA.filter((ticket) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ticket.id.toLowerCase().includes(searchLower) ||
      ticket.user.toLowerCase().includes(searchLower) ||
      ticket.issue.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="p-4 bg-white rounded-t-xl border-b border-[#E3E3E4]">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-[#F9FAFB] border border-[#E3E3E4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F26522]/20 text-sm transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-4 w-full">
          <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm border border-[#E3E3E4]">
            <table className="min-w-[800px] w-full text-sm border-collapse">
              <thead className="border-b border-[#DBE0E5] bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="px-6 py-4 uppercase text-[11px] font-semibold tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-4 uppercase text-[11px] font-semibold tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 uppercase text-[11px] font-semibold tracking-wider">
                    Booking
                  </th>
                  <th className="px-6 py-4 uppercase text-[11px] font-semibold tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-4 uppercase text-[11px] font-semibold tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 uppercase text-[11px] font-semibold tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 uppercase text-[11px] font-semibold tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E3E4]">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => onSelectTicket(ticket)}
                    className="group cursor-pointer hover:bg-[#FFF5F2] transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-[#1A1A1A]">
                      {ticket.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#1A1A1A]">
                      {ticket.user}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {ticket.booking}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-[250px] truncate">
                      {ticket.issue}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-medium inline-block min-w-[70px] text-center ${
                          ticket.status === "Replied"
                            ? "bg-[#E6F9F1] text-[#00A360]"
                            : "bg-[#FFF7ED] text-[#C2410C]"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 italic whitespace-nowrap">
                      {ticket.date}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="px-5 py-2 whitespace-nowrap rounded-lg border border-transparent text-[#1A1A1A] font-medium hover:bg-[#F26522] hover:text-white transition-all text-sm active:scale-95 cursor-pointer">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketTable;
