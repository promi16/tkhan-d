import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Search,
  UserX,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetUsersQuery } from "../../../redux/features/users/usersApi";
import { User } from "../../../redux/features/users/usersType";

const ITEMS_PER_PAGE = 5;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [page] = useState(1);
  const [limit] = useState(100);

  const { data, isLoading, isError } = useGetUsersQuery({
    page,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const users = data?.data?.items || [];

  const filteredUsers = useMemo(() => {
    return users.filter((u: User) => {
      const matchesRole =
        roleFilter === "All Roles" || u.role === roleFilter.toUpperCase();

      const matchesStatus =
        statusFilter === "All Status" ||
        (statusFilter === "Active" && u.status === "ACTIVE" && !u.isBlocked) ||
        (statusFilter === "Blocked" && u.isBlocked === true) ||
        (statusFilter === "Inactive" &&
          u.status === "INACTIVE" &&
          !u.isBlocked) ||
        (statusFilter === "Pending" &&
          u.status === "PENDING_EMAIL_VERIFICATION" &&
          !u.isBlocked);

      const matchesSearch =
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [roleFilter, statusFilter, searchQuery, users]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setCurrentPage(1);
  };

  const getStatusDisplay = (user: User) => {
    if (user.isBlocked)
      return {
        text: "Blocked",
        className: "bg-rose-100 text-rose-800",
      };

    if (user.status === "ACTIVE")
      return {
        text: "Active",
        className: "bg-emerald-100 text-emerald-800",
      };

    if (user.status === "INACTIVE")
      return {
        text: "Inactive",
        className: "bg-slate-100 text-slate-600",
      };

    if (user.status === "SUSPENDED")
      return {
        text: "Suspended",
        className: "bg-amber-100 text-amber-800",
      };

    if (user.status === "PENDING_EMAIL_VERIFICATION")
      return {
        text: "Pending Verification",
        className: "bg-yellow-100 text-yellow-700",
      };

    return {
      text: user.status,
      className: "bg-slate-100 text-slate-600",
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">Failed to load users. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="w-full font-inter">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="xl:col-span-4 w-full">
          <div className="w-full bg-white rounded-t-xl border border-b-0 border-[#E3E3E4] p-4 md:p-5">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
              <div className="relative w-full lg:flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />

                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm focus:border-[#FF6B35] focus:bg-white transition-all font-light"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                {[
                  {
                    label: roleFilter,
                    set: (v: string) => handleFilterChange(setRoleFilter, v),
                    open: roleOpen,
                    toggle: setRoleOpen,
                    opts: ["All Roles", "admin", "groomer", "buyer"],
                  },
                  {
                    label: statusFilter,
                    set: (v: string) => handleFilterChange(setStatusFilter, v),
                    open: statusOpen,
                    toggle: setStatusOpen,
                    opts: [
                      "All Status",
                      "Active",
                      "Inactive",
                      "Blocked",
                      "Pending",
                    ],
                  },
                ].map((drop, i) => (
                  <div key={i} className="relative w-full sm:flex-1 lg:w-44">
                    <button
                      onClick={() => drop.toggle(!drop.open)}
                      className="cursor-pointer w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2 text-xs text-slate-600 hover:border-[#FF6B35] transition-all font-light"
                    >
                      <span className="truncate">
                        {drop.label === "Pending"
                          ? "Pending Verification"
                          : drop.label}
                      </span>

                      <ChevronDown
                        size={13}
                        className={`transition-transform flex-shrink-0 ${
                          drop.open ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {drop.open && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute top-12 left-0 w-full min-w-[160px] bg-white shadow-2xl rounded-xl p-2 z-50 border border-slate-100"
                        >
                          {drop.opts.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                drop.set(opt);
                                drop.toggle(false);
                              }}
                              className={`cursor-pointer w-full text-left px-4 py-2 rounded-lg text-xs transition-all ${
                                drop.label === opt
                                  ? "bg-[#FF6B35] text-white font-medium"
                                  : "text-black hover:bg-slate-50 font-medium"
                              }`}
                            >
                              {opt === "Pending" ? "Pending Verification" : opt}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto bg-white rounded-b-xl shadow-sm border border-[#E3E3E4]">
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
                  <th className="py-4 px-4 md:px-6 text-left">Join Date</th>
                  {/* ✅ Actions header — text-center fixed */}
                  <th className="py-4 px-4 md:px-6 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((u: User) => {
                    const status = getStatusDisplay(u);

                    return (
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
                              {u.fullName}
                            </span>
                            <span className="text-[9px] md:text-[10px] text-slate-400 uppercase font-light">
                              ID: {u.id.slice(0, 8)}...
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
                            className={`px-2 py-1 rounded-3xl text-[9px] md:text-[10px] font-medium inline-block whitespace-nowrap ${
                              u.role === "BUYER"
                                ? "bg-slate-200 text-black"
                                : u.role === "GROOMER"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-purple-100 text-purple-600"
                            }`}
                          >
                            {u.role.toLowerCase()}
                          </span>
                        </td>

                        <td className="py-3 md:py-4 px-4 md:px-6 text-center lg:text-left">
                          <span
                            className={`px-2 py-1 rounded-3xl text-[9px] md:text-[10px] font-medium inline-block whitespace-nowrap ${status.className}`}
                          >
                            {status.text}
                          </span>
                        </td>

                        <td className="py-3 md:py-4 px-4 md:px-6">
                          <span className="text-[11px] md:text-sm text-slate-900 font-light whitespace-nowrap">
                            {formatDate(u.createdAt)}
                          </span>
                        </td>

                        {/* ✅ FIXED: text-right → text-center, mr-7 removed */}
                        <td className="py-3 md:py-4 px-4 md:px-6 text-center">
                          <button
                            onClick={() => onViewDetails(u.id)}
                            className="font-light px-4 py-2 rounded-lg text-[#1A1A1A] hover:font-bold transition-all duration-300 hover:bg-[#F26522] hover:cursor-pointer whitespace-nowrap hover:text-white hover:shadow-lg hover:shadow-[#F26522]/30 active:scale-95"
                          >
                            View Details
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
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

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between px-1">
          <p className="text-xs text-slate-500 font-light">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">
              {filteredUsers.length}
            </span>{" "}
            users
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 ${
                currentPage === 1
                  ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed"
                  : "border-slate-200 text-slate-600 bg-white hover:border-[#FF6B35] hover:text-[#FF6B35] hover:bg-orange-50 cursor-pointer"
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 ${
                currentPage === totalPages
                  ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed"
                  : "border-slate-200 text-slate-600 bg-white hover:border-[#FF6B35] hover:text-[#FF6B35] hover:bg-orange-50 cursor-pointer"
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
