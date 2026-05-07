import { useState } from "react";
import { Search, Wallet } from "lucide-react";
import { motion, Variants } from "framer-motion";

export const PayoutRequestTable = ({
  onViewDetails,
}: {
  onViewDetails: () => void;
}) => {
  const MOCK_DATA = [
    {
      id: "PR001",
      name: "Sarah Johnson",
      uid: "U002",
      amt: "$500",
      method: "Bank Transfer",
      date: "2026-04-15",
    },
    {
      id: "PR002",
      name: "Emily Brown",
      uid: "U004",
      amt: "$300",
      method: "Mobile Wallet",
      date: "2026-04-16",
    },
    {
      id: "PR003",
      name: "Lisa Anderson",
      uid: "U006",
      amt: "$400",
      method: "PayPal",
      date: "2026-04-15",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = MOCK_DATA.filter((row) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      row.id.toLowerCase().includes(searchLower) ||
      row.name.toLowerCase().includes(searchLower) ||
      row.uid.toLowerCase().includes(searchLower)
    );
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const rowVariants: Variants = {
    hidden: { opacity: 0, x: -5 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="w-full font-['Inter']">
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-4 w-full">
          <div className="bg-white rounded-xl border border-[#E3E3E4] shadow-sm overflow-hidden">
            <div className="p-4 md:ml-5">
              <div className="relative max-w-[500px]">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                  size={20}
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by request ID, groomer name, or ID..."
                  className="w-full pl-12 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
                />
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="w-full px-4 md:px-10 mt-3 overflow-x-auto">
              <table className="min-w-[800px] w-full text-sm">
                <thead className="border-b border-[#DBE0E5] bg-gray-50">
                  <tr>
                    <th className="px-8 whitespace-nowrap py-4 text-[14px] font-light text-gray-500 uppercase text-left">
                      Request ID
                    </th>
                    <th className="px-8 whitespace-nowrap py-4 text-[14px] font-light text-gray-500 uppercase text-left">
                      Groomer Name
                    </th>
                    <th className="px-8 whitespace-nowrap py-4 text-[14px] font-light text-gray-500 uppercase text-left">
                      Requested Amount
                    </th>
                    <th className="px-8 whitespace-nowrap py-4 text-[14px] font-light text-gray-500 uppercase text-left">
                      Payment Method
                    </th>
                    <th className="px-8 whitespace-nowrap py-4 text-[14px] font-light text-gray-500 uppercase text-left">
                      Request Date
                    </th>
                    <th className="px-8 whitespace-nowrap py-4 text-[14px] font-light text-gray-500 uppercase text-left">
                      Status
                    </th>
                    <th className="px-8 whitespace-nowrap py-4 text-[14px] font-light text-gray-500 uppercase text-left">
                      Actions
                    </th>
                  </tr>
                </thead>

                <motion.tbody
                  className="divide-y divide-[#F1F5F9]"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredData.length > 0 ? (
                    filteredData.map((row) => (
                      <motion.tr
                        key={row.id}
                        variants={rowVariants}
                        whileHover={{ backgroundColor: "#FFF7ED" }}
                        className="transition-colors"
                      >
                        <td className="px-8 py-5 font-medium text-[#1E293B]">
                          {row.id}
                        </td>
                        <td className="px-8 py-5">
                          <div className="font-medium text-[#1E293B]">
                            {row.name}
                          </div>
                          <div className="text-[12px] text-[#94A3B8]">
                            {row.uid}
                          </div>
                        </td>
                        <td className="px-8 py-5 font-bold text-[#1E293B]">
                          {row.amt}
                        </td>
                        <td className="px-8 py-5 flex items-center gap-2 text-gray-600">
                          <Wallet size={16} />
                          {row.method}
                        </td>
                        <td className="px-8 py-5 text-gray-600">{row.date}</td>
                        <td className="px-8 py-5">
                          <span className="px-4 py-2 bg-[#FFEDD4] text-[#9F2D00] rounded-full text-[12px] font-medium">
                            Pending
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <motion.button
                            onClick={onViewDetails}
                            initial={{ color: "#1E293B" }}
                            whileHover={{ color: "white", scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="text-gray-800 px-5 py-2 rounded-lg font-medium text-sm hover:bg-orange-500 hover:text-white whitespace-nowrap transition-all duration-200 cursor-pointer"
                          >
                            View Details
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-8 py-10 text-center text-gray-400 italic"
                      >
                        No Payout Matching Requests Found Matching "{searchTerm}
                        "
                      </td>
                    </tr>
                  )}
                </motion.tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
