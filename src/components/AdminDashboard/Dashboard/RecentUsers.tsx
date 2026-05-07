import React from "react";

import { motion } from "framer-motion";

const users = [
  {
    name: "John Smith",

    email: "john.smith@email.com",

    date: "Joined 2024-01-15",

    role: "Buyer",
  },

  {
    name: "Sarah Johnson",

    email: "sarah.j@email.com",

    date: "Joined 2024-02-20",

    role: "Seller",
  },

  {
    name: "Mike Davis",

    email: "mike.davis@email.com",

    date: "Joined 2024-03-10",

    role: "Buyer",
  },

  {
    name: "Emily Brown",

    email: "emily.b@email.com",

    date: "Joined 2024-01-25",

    role: "Seller",
  },

  {
    name: "David Wilson",

    email: "david.w@email.com",

    date: "Joined 2024-04-05",

    role: "Buyer",
  },
];

export const RecentUsers: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-[12px] border border-gray-100 shadow-sm font-inter overflow-hidden"
    >
      <div className="px-10 pt-8 pb-4">
        <h3 className="text-[18px] font-semibold text-[#0f2f1d]">
          Recent User Registrations
        </h3>
      </div>

      <div className="w-full">
        <table className="w-full border-collapse">
          <tbody>
            {users.map((user, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border-t border-gray-50 hover:bg-orange-50/30 transition-colors group"
              >
                <td className="pl-10 py-5 w-[75%]">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#0f2f1d] text-[15px] font-semibold leading-tight group-hover:text-[#FF6B35] transition-colors">
                      {user.name}
                    </span>

                    <span className="text-[13px] text-gray-500 font-normal">
                      {user.email}
                    </span>

                    <span className="text-[12px] text-gray-400 font-normal">
                      {user.date}
                    </span>
                  </div>
                </td>

                <td className="pr-10 py-5 align-middle">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`inline-block px-3 py-1 rounded-full text-[11px] font-medium text-center transition-all ${
                      user.role.toLowerCase() === "buyer"
                        ? "bg-gray-100 text-gray-600 border border-gray-200"
                        : "bg-[#E3E8FE] text-[#3A5CFF] border border-[#3A5CFF]/10"
                    }`}
                  >
                    {user.role}
                  </motion.span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
