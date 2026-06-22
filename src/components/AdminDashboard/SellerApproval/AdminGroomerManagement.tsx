import React, { useState, useCallback } from "react";
import {
  useGetPendingGroomersQuery,
  useApproveGroomerMutation,
  useRejectGroomerMutation,
} from "@/redux/features/groomers/groomersApi";
import { GroomerProfile } from "@/redux/features/groomers/groomersType";
import { toast } from "react-hot-toast";
import {
  Search,
  XCircle,
  AlertCircle,
  CheckCircle,
  RotateCw,
} from "lucide-react";

import ReviewDetail from "./ReviewDetail";
import RejectModal from "./RejectModal";

const AdminGroomerManagement: React.FC = () => {
  const [selectedGroomer, setSelectedGroomer] = useState<GroomerProfile | null>(
    null,
  );
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const {
    data: pendingData,
    isLoading: isLoadingPending,
    isError: isErrorPending,
    refetch: refetchPending,
  } = useGetPendingGroomersQuery();

  const [approveGroomer, { isLoading: isApproving }] =
    useApproveGroomerMutation();
  const [rejectGroomer, { isLoading: isRejecting }] =
    useRejectGroomerMutation();

  const groomers: GroomerProfile[] = pendingData?.data || [];

  const counts = {
    pending: groomers.filter((g) => g.approvalStatus === "PENDING").length,
    approved: groomers.filter((g) => g.approvalStatus === "APPROVED").length,
    rejected: groomers.filter((g) => g.approvalStatus === "REJECTED").length,
  };

  const refreshData = useCallback(async () => {
    try {
      await refetchPending();
    } catch (error) {
      console.error("Refresh failed:", error);
    }
  }, [refetchPending]);

  const formatDate = (dateString: string | null): string => {
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

  const handleRefresh = async () => {
    toast.loading("Refreshing data...", { id: "refresh" });
    await refreshData();
    toast.success("Data refreshed!", { id: "refresh" });
  };

  const handleReviewClick = (groomer: GroomerProfile) => {
    setSelectedGroomer(groomer);
    setIsReviewMode(true);
  };

  const handleBack = () => {
    setIsReviewMode(false);
    setSelectedGroomer(null);
  };

  const handleOpenRejectModal = () => setIsRejectModalOpen(true);
  const handleCloseRejectModal = () => setIsRejectModalOpen(false);

  const handleApprove = async () => {
    if (!selectedGroomer) {
      toast.error("No groomer selected");
      return;
    }
    try {
      await approveGroomer(selectedGroomer.id).unwrap();
      toast.success("Application approved successfully!");
      setSelectedGroomer({
        ...selectedGroomer,
        approvalStatus: "APPROVED",
        approvedAt: new Date().toISOString(),
      });
      await refreshData();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to approve application";
      console.error("Approve error:", error);
      toast.error(errorMessage);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedGroomer) {
      toast.error("No groomer selected");
      return;
    }
    try {
      await rejectGroomer({
        id: selectedGroomer.id,
        reason: reason,
      }).unwrap();
      toast.success("Application rejected successfully!");
      setSelectedGroomer({
        ...selectedGroomer,
        approvalStatus: "REJECTED",
        rejectionReason: reason,
      });
      await refreshData();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reject application";
      console.error("Reject error:", error);
      toast.error(errorMessage);
    }
  };

  const filteredData = groomers.filter((groomer) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
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

  const stats = [
    {
      label: "Pending Review",
      count: counts.pending,
      sub: "Requires action",
      icon: <AlertCircle size={22} />,
      color: "text-[#F54900]",
      countColor: "text-[#F54900]",
      bg: "bg-[#FFF7ED]",
      glow: "hover:shadow-[0_0_20px_rgba(245,73,0,0.15)]",
    },
    {
      label: "Approved",
      count: counts.approved,
      sub: "Active groomers",
      icon: <CheckCircle size={22} />,
      color: "text-[#00A63E]",
      countColor: "text-[#00A63E]",
      bg: "bg-[#F0FDF4]",
      glow: "hover:shadow-[0_0_20px_rgba(0,166,62,0.15)]",
    },
    {
      label: "Rejected",
      count: counts.rejected,
      sub: "Not qualified",
      icon: <XCircle size={22} />,
      color: "text-[#E7000B]",
      countColor: "text-[#E7000B]",
      bg: "bg-[#FEF2F2]",
      glow: "hover:shadow-[0_0_20px_rgba(231,0,11,0.15)]",
    },
  ];

  if (isReviewMode) {
    return (
      <>
        <ReviewDetail
          groomer={selectedGroomer}
          onBack={handleBack}
          onRejectClick={handleOpenRejectModal}
          onApprove={handleApprove}
          isApproving={isApproving}
          isRejecting={isRejecting}
          onRefresh={refreshData}
        />
        <RejectModal
          isOpen={isRejectModalOpen}
          onClose={handleCloseRejectModal}
          onConfirm={handleReject}
          isLoading={isRejecting}
        />
      </>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 font-inter">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm flex justify-between items-center relative overflow-hidden transition-all duration-300 ${item.glow} group cursor-default`}
          >
            <div className="relative z-10">
              <p className="text-[14px] whitespace-nowrap text-gray-600 font-light mb-1.5 tracking-tight">
                {item.label}
              </p>
              <h4
                className={`text-4xl font-bold mb-1 tracking-tight ${item.countColor}`}
              >
                {item.count}
              </h4>
              <p className="text-[13px] whitespace-nowrap text-gray-400 font-normal">
                {item.sub}
              </p>
            </div>
            <div
              className={`p-4 rounded-2xl ${item.bg} ${item.color} relative z-10`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5">
        <div className="w-full">
          <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm border border-[#E3E3E4]">
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, or business..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E25822] focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2.5 bg-[#E25822] text-white rounded-lg hover:bg-[#c4471a] transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <RotateCw size={16} />
                  Refresh
                </button>
              </div>
            </div>

            <table className="min-w-[800px] w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-500 text-xs font-medium uppercase">
                    Business Name
                  </th>
                  <th className="px-4 py-4 text-left text-gray-500 text-xs font-medium uppercase">
                    Groomer Name
                  </th>
                  <th className="px-4 py-4 text-left text-gray-500 text-xs font-medium uppercase">
                    Email / Phone
                  </th>
                  <th className="px-4 py-4 text-left text-gray-500 text-xs font-medium uppercase">
                    Submission Date
                  </th>
                  <th className="px-4 py-4 text-center text-gray-500 text-xs font-medium uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-gray-500 text-xs font-medium uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoadingPending ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E25822]"></div>
                      </div>
                    </td>
                  </tr>
                ) : isErrorPending ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <p className="text-red-500 mb-2">
                        Failed to load applications.
                      </p>
                      <button
                        onClick={() => refetchPending()}
                        className="px-4 py-2 bg-[#E25822] text-white rounded-lg"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <Search
                        size={36}
                        className="text-gray-300 mx-auto mb-3"
                      />
                      <h3 className="text-gray-900 font-bold text-lg">
                        No Results Found
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {groomers.length === 0
                          ? "No pending applications to review"
                          : `No applications matching "${searchTerm}"`}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((groomer) => (
                    <tr
                      key={groomer.id}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                      <td className="px-6 py-4">
                        <div
                          className="truncate max-w-[200px]"
                          title={groomer.businessName}
                        >
                          {groomer.businessName}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-sm">
                          {groomer.user?.fullName}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {getExperienceText(groomer.experienceYears)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className="text-sm truncate max-w-[200px]"
                          title={groomer.user?.email}
                        >
                          {groomer.user?.email}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {groomer.user?.phone}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {formatDate(groomer.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(groomer.approvalStatus)}`}
                        >
                          {groomer.approvalStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleReviewClick(groomer)}
                          className="text-gray-700 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-[#E25822] hover:text-white transition-all"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGroomerManagement;
