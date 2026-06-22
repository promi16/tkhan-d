// src/pages/AdminDashboard/PaymentsPage.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

import { PayoutRequestTable } from "../../components/AdminDashboard/Payment/PayoutRequestTable";
import { PayoutRequestDetails } from "../../components/AdminDashboard/Payment/PayoutRequestDetails";
import { PaymentHistoryTable } from "../../components/AdminDashboard/Payment/PaymentHistoryTable";
import { PaymentDetails } from "../../components/AdminDashboard/Payment/PaymentDetails";
import { PlatformPricingTab } from "../../components/AdminDashboard/Payment/PlatformPricing";

import { Payment } from "../../redux/features/payment/paymentTypes";
import { WithdrawalRequest } from "../../redux/features/payout/payoutTypes";

// ─── View Types ───────────────────────────────────────────────────────────────
type View =
  | "LIST_REQUEST"
  | "DETAIL_REQUEST"
  | "LIST_HISTORY"
  | "DETAIL_HISTORY"
  | "PLATFORM_PRICING";

type ActiveTab = "payout" | "history" | "pricing";

// ─── Animation Helpers ────────────────────────────────────────────────────────
const getAnimationVariants = (isDetailView: boolean) => ({
  initial: isDetailView ? { opacity: 0, x: 20 } : { opacity: 0 },
  animate: isDetailView ? { opacity: 1, x: 0 } : { opacity: 1 },
  exit: isDetailView ? { opacity: 0, x: -20 } : { opacity: 0 },
});

// ─── Tab Config ───────────────────────────────────────────────────────────────
const TABS: { key: ActiveTab; label: string; listView: View }[] = [
  { key: "payout", label: "Pay-out request", listView: "LIST_REQUEST" },
  { key: "history", label: "Payment History", listView: "LIST_HISTORY" },
  { key: "pricing", label: "Platform Pricing", listView: "PLATFORM_PRICING" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function PaymentsPage() {
  const [view, setView] = useState<View>("LIST_REQUEST");
  const [activeTab, setActiveTab] = useState<ActiveTab>("payout");

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedPayoutRequest, setSelectedPayoutRequest] =
    useState<WithdrawalRequest | null>(null);

  const isDetailView = view === "DETAIL_REQUEST" || view === "DETAIL_HISTORY";
  const isListView = !isDetailView;
  const variants = getAnimationVariants(isDetailView);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleViewPayoutDetails = (request: WithdrawalRequest): void => {
    setSelectedPayoutRequest(request);
    setView("DETAIL_REQUEST");
  };

  const handleViewPaymentDetails = (payment: Payment): void => {
    setSelectedPayment(payment);
    setView("DETAIL_HISTORY");
  };

  const handleBackFromPayoutDetail = (): void => {
    setView("LIST_REQUEST");
    setSelectedPayoutRequest(null);
  };

  const handleBackFromPaymentDetail = (): void => {
    setView("LIST_HISTORY");
    setSelectedPayment(null);
  };

  const handleTabClick = (tab: { key: ActiveTab; listView: View }): void => {
    setActiveTab(tab.key);
    setView(tab.listView);
    // Clear any selected detail when switching tabs
    setSelectedPayoutRequest(null);
    setSelectedPayment(null);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 min-h-screen bg-gray-50 font-['Inter'] pt-3 px-4 md:pl-5 md:pr-8">
      <Toaster position="top-right" />

      {/* ── Page Header + Tabs (Only renders when NOT in Detail view) ── */}
      {isListView && (
        <div className="mb-6 md:mb-10">
          <h1 className="text-[24px] md:text-[32px] font-bold text-[#1E293B] tracking-tight">
            Payment Management
          </h1>
          <p className="text-[#64748B] text-[14px] md:text-[16px]">
            Track and manage all transactions
          </p>

          {/* Tabs */}
          <div className="flex gap-6 md:gap-10 mt-6 md:mt-10 border-b border-[#F1F5F9]">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab)}
                  className={`pb-4 cursor-pointer text-[14px] md:text-[16px] whitespace-nowrap font-medium transition-all relative ${
                    isActive
                      ? "text-[#FF6B35]"
                      : "text-[#94A3B8] hover:text-[#64748B]"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="payTab"
                      className="absolute -bottom-px left-0 right-0 h-[3px] bg-[#FF6B35] rounded-t-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Animated Content Area ── */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: isDetailView ? 0.3 : 0.15 }}
          >
            {/* ── List Views ── */}
            {isListView && (
              <>
                {view === "LIST_REQUEST" && (
                  <PayoutRequestTable onViewDetails={handleViewPayoutDetails} />
                )}

                {view === "LIST_HISTORY" && (
                  <PaymentHistoryTable
                    onViewDetails={handleViewPaymentDetails}
                  />
                )}

                {view === "PLATFORM_PRICING" && <PlatformPricingTab />}
              </>
            )}

            {/* ── Detail: Withdrawal Request ── */}
            {view === "DETAIL_REQUEST" && selectedPayoutRequest && (
              <PayoutRequestDetails
                onBack={handleBackFromPayoutDetail}
                data={selectedPayoutRequest}
              />
            )}

            {/* ── Detail: Payment History ── */}
            {view === "DETAIL_HISTORY" && (
              <PaymentDetails
                onBack={handleBackFromPaymentDetail}
                data={selectedPayment}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
