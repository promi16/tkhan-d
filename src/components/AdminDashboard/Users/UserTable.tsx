import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, UserX } from "lucide-react";

export const UserTable = ({
  onViewDetails,
}: {
  onViewDetails: (id: string) => void;
}) => {
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleOpen, setRoleOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const users = [
    {
      id: "U001",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 234 567 8901",
      role: "Buyer",
      status: "Active",
      date: "2024-01-15",
    },
    {
      id: "U002",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 234 567 8902",
      role: "Seller",
      status: "Active",
      date: "2024-02-20",
    },
    {
      id: "U003",
      name: "Mike Davis",
      email: "mike.davis@email.com",
      phone: "+1 234 567 8903",
      role: "Buyer",
      status: "Active",
      date: "2024-03-10",
    },
    {
      id: "U004",
      name: "Emily Brown",
      email: "emily.b@email.com",
      phone: "+1 234 567 8904",
      role: "Seller",
      status: "Active",
      date: "2024-01-25",
    },
    {
      id: "U005",
      name: "David Wilson",
      email: "david.w@email.com",
      phone: "+1 234 567 8905",
      role: "Buyer",
      status: "Blocked",
      date: "2024-04-05",
    },
    {
      id: "U006",
      name: "Lisa Anderson",
      email: "lisa.a@email.com",
      phone: "+1 234 567 8906",
      role: "Seller",
      status: "Active",
      date: "2024-02-14",
    },
    {
      id: "U007",
      name: "James Taylor",
      email: "james.t@email.com",
      phone: "+1 234 567 8907",
      role: "Buyer",
      status: "Active",
      date: "2024-03-22",
    },
    {
      id: "U008",
      name: "Maria Garcia",
      email: "maria.g@email.com",
      phone: "+1 234 567 8908",
      role: "Seller",
      status: "Active",
      date: "2024-01-30",
    },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = roleFilter === "All Roles" || u.role === roleFilter;
      const matchesStatus =
        statusFilter === "All Status" || u.status === statusFilter;
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [roleFilter, statusFilter, searchQuery]);

  return (
    <div className="w-full font-inter">
      <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 h-11 md:h-12 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm focus:border-[#FF6B35] focus:bg-white transition-all font-light"
          />
        </div>

        <div className="flex flex-row gap-2 w-full lg:w-auto">
          {[
            {
              label: roleFilter,
              set: setRoleFilter,
              open: roleOpen,
              toggle: setRoleOpen,
              opts: ["All Roles", "Buyer", "Seller"],
            },
            {
              label: statusFilter,
              set: setStatusFilter,
              open: statusOpen,
              toggle: setStatusOpen,
              opts: ["All Status", "Active", "Blocked"],
            },
          ].map((drop, i) => (
            <div key={i} className="relative flex-1 lg:flex-none">
              <button
                onClick={() => drop.toggle(!drop.open)}
                className="cursor-pointer w-full min-w-[110px] h-11 md:h-12 px-2 md:px-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-1 md:gap-2 text-[11px] md:text-sm text-slate-600 hover:border-[#FF6B35] transition-all font-light"
              >
                <span className="truncate">{drop.label}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform flex-shrink-0 ${drop.open ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {drop.open && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-[48px] md:top-[56px] left-0 md:right-0 w-full md:w-[160px] bg-white shadow-2xl rounded-xl p-2 z-50 border border-slate-100"
                  >
                    {drop.opts.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          drop.set(opt);
                          drop.toggle(false);
                        }}
                        className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg text-xs md:text-sm transition-all ${drop.label === opt ? "bg-[#FF6B35] text-white font-medium" : "text-black hover:bg-slate-50 font-medium"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-4 w-full">
          <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm border border-[#E3E3E4]">
            <table className="min-w-[800px] w-full text-sm">
              <thead className="border-b border-[#DBE0E5] bg-gray-50">
                <tr className="text-[10px] md:text-[11px] font-medium text-slate-500 uppercase tracking-widest">
                  <th className="py-4 px-4 md:px-6 text-left">Name</th>
                  <th className="py-4 px-4 md:px-6 text-left">Email/Phone</th>
                  <th className="py-4 px-4 md:px-6 text-center lg:text-left">
                    Role
                  </th>
                  <th className="py-4 px-4 md:px-6 text-center lg:text-left">
                    Status
                  </th>
                  <th className="py-4 px-4 md:px-6 hidden md:table-cell text-left">
                    Join Date
                  </th>
                  <th className="py-4 px-4 md:px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={u.id}
                     
                      className="hover:bg-orange-50/60 transition-colors group"
                    >
                      <td className="py-3 md:py-4 px-4 md:px-6">
                        <div className="flex flex-col">
                          <span className="text-xs md:text-sm font-semibold text-slate-900 group-hover:text-[#FF6B35] transition-colors whitespace-nowrap">
                            {u.name}
                          </span>
                          <span className="text-[9px] md:text-[10px] text-slate-400 uppercase font-light">
                            {u.id}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-4 md:px-6">
                        <div className="flex flex-col max-w-[150px] md:max-w-none">
                          <span className="text-[10px] md:text-sm text-slate-900 font-light truncate">
                            {u.email}
                          </span>
                          <span className="text-[9px] md:text-[11px] text-slate-500 font-light">
                            {u.phone}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-4 md:px-6 text-center lg:text-left">
                        <span
                          className={`px-2 py-1 rounded-3xl text-[9px] md:text-[10px] font-medium inline-block whitespace-nowrap ${u.role === "Buyer" ? "bg-slate-200 text-black" : "bg-blue-100 text-blue-600"}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 md:py-4 px-4 md:px-6 text-center lg:text-left">
                        <span
                          className={`px-2 py-1 rounded-3xl text-[9px] md:text-[10px] font-medium inline-block whitespace-nowrap ${u.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 md:py-4 px-4 md:px-6 hidden md:table-cell">
                        <span className="text-[11px] md:text-sm text-slate-900 font-light whitespace-nowrap">
                          {u.date}
                        </span>
                      </td>
                      <td className="py-3 md:py-4 px-4 md:px-6 text-right">
                        <button
                          onClick={() => onViewDetails(u.id)}
                          className="font-light px-4 py-2 rounded-lg text-[#1A1A1A] hover:font-bold transition-all duration-300 hover:bg-[#F26522] hover:cursor-pointer whitespace-nowrap  hover:text-white hover:shadow-lg hover:shadow-[#F26522]/30 active:scale-95"
                        >
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 grayscale opacity-60">
                        <UserX size={40} />
                        <p className="text-base font-light text-slate-800">
                          No Match Found
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
