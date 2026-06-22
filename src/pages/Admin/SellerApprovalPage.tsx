// src/pages/AdminDashboard/SellerApprovalPage.tsx

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

import StatsCards from "../../components/AdminDashboard/SellerApproval/StatsCards";
import ApplicationTable from "../../components/AdminDashboard/SellerApproval/ApplicationTable";
import ReviewDetail from "../../components/AdminDashboard/SellerApproval/ReviewDetail";
import RejectModal from "../../components/AdminDashboard/SellerApproval/RejectModal";

import {
  useApproveGroomerMutation,
  useRejectGroomerMutation,
} from "../../redux/features/groomers/groomersApi";

import type { GroomerProfile } from "../../redux/features/groomers/groomersType";

const SellerApprovalPage: React.FC = () => {
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedGroomer, setSelectedGroomer] = useState<GroomerProfile | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    isSuccess: boolean;
  }>({ show: false, message: "", isSuccess: true });

  // RTK Query mutations
  const [approveGroomer, { isLoading: isApproving }] =
    useApproveGroomerMutation();
  const [rejectGroomer, { isLoading: isRejecting }] =
    useRejectGroomerMutation();

  const showToast = (message: string, isSuccess: boolean) => {
    setToast({ show: true, message, isSuccess });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 2500);
  };

  const resetView = () => {
    setTimeout(() => {
      setView("list");
      setSelectedGroomer(null);
    }, 2000);
  };

  // ✅ Approve handler — calls PATCH /admin/groomers/{id}/approve
  const handleApprove = useCallback(async () => {
    if (!selectedGroomer) return;
    try {
      await approveGroomer(selectedGroomer.id).unwrap();
      showToast("Application Approved Successfully!", true);
      resetView();
    } catch (error) {
      console.error("Approval failed:", error);
      showToast("Approval Failed! Please try again.", false);
    }
  }, [selectedGroomer, approveGroomer]);

  // ✅ Reject handler — calls PATCH /admin/groomers/{id}/reject
  const handleFinalReject = useCallback(
    async (reason: string) => {
      if (!selectedGroomer) return;
      await rejectGroomer({ id: selectedGroomer.id, reason }).unwrap();
      // unwrap throws on error, so modal handles catch internally
      showToast("Application Rejected Successfully!", false);
      resetView();
    },
    [selectedGroomer, rejectGroomer],
  );

  const handleReviewClick = useCallback((groomer: GroomerProfile) => {
    setSelectedGroomer(groomer);
    setView("detail");
  }, []);

  const handleBackToList = useCallback(() => {
    setView("list");
    setSelectedGroomer(null);
  }, []);

  return (
    <div className="mt-4 sm:mt-6 md:mt-8 ml-4 sm:ml-6 md:ml-8 mr-4 sm:mr-6 md:mr-8 bg-[#FBFBFB] min-h-screen font-['Inter'] selection:bg-orange-100 selection:text-[#E25822]">
      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-1 sm:mb-1.5 md:mb-2 text-gray-900 tracking-tight">
              Seller Approval (KYC)
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-500 font-normal mb-6 sm:mb-8 md:mb-10">
              Review and manage groomer applications
            </p>

            <StatsCards />
            <ApplicationTable onReviewClick={handleReviewClick} />
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ReviewDetail
              groomer={selectedGroomer}
              onBack={handleBackToList}
              onRejectClick={() => setIsModalOpen(true)}
              onApprove={handleApprove}
              isApproving={isApproving}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Reject Modal */}
      <RejectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleFinalReject}
        isLoading={isRejecting}
      />

      {/* ✅ Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className={`fixed bottom-4 sm:bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full shadow-2xl flex items-center gap-2 sm:gap-3 font-semibold z-50 text-white text-sm sm:text-base ${
              toast.isSuccess
                ? "bg-gradient-to-r from-emerald-500 to-green-600"
                : "bg-gradient-to-r from-red-500 to-rose-600"
            }`}
            role="alert"
            aria-live="polite"
          >
            {toast.isSuccess ? (
              <CheckCircle size={18} />
            ) : (
              <XCircle size={18} />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerApprovalPage;
