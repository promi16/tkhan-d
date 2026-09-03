// src/pages/AdminDashboard/PaymentsPage.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

import { PaymentHistoryTable } from "../../components/AdminDashboard/Payment/PaymentHistoryTable";
import { PaymentDetails } from "../../components/AdminDashboard/Payment/PaymentDetails";
import { PlatformPricingTab } from "../../components/AdminDashboard/Payment/PlatformPricing";

import { Payment } from "../../redux/features/payment/paymentTypes";

type View = "LIST_HISTORY" | "DETAIL_HISTORY" | "PLATFORM_PRICING";

type ActiveTab = "history" | "pricing";

const getAnimationVariants = (isDetailView: boolean) => ({
  initial: isDetailView ? { opacity: 0, x: 20 } : { opacity: 0 },
  animate: isDetailView ? { opacity: 1, x: 0 } : { opacity: 1 },
  exit: isDetailView ? { opacity: 0, x: -20 } : { opacity: 0 },
});

const TABS: { key: ActiveTab; label: string; listView: View }[] = [
  { key: "history", label: "Payment History", listView: "LIST_HISTORY" },
  { key: "pricing", label: "Platform Pricing", listView: "PLATFORM_PRICING" },
];

export default function PaymentsPage() {
  const [view, setView] = useState<View>("LIST_HISTORY");
  const [activeTab, setActiveTab] = useState<ActiveTab>("history");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const isDetailView = view === "DETAIL_HISTORY";
  const isListView = !isDetailView;
  const variants = getAnimationVariants(isDetailView);

  const handleViewPaymentDetails = (payment: Payment): void => {
    setSelectedPayment(payment);
    setView("DETAIL_HISTORY");
  };

  const handleBackFromPaymentDetail = (): void => {
    setView("LIST_HISTORY");
    setSelectedPayment(null);
  };

  const handleTabClick = (tab: { key: ActiveTab; listView: View }): void => {
    setActiveTab(tab.key);
    setView(tab.listView);
    setSelectedPayment(null);
  };

  return (
    <div className="w-full bg-gray-50 font-['Inter']">
      <Toaster position="top-right" />

      {isListView && (
        <div className="mb-6 md:mb-10">
          <h1 className="text-xl md:text-2xl font-bold text-[#1E293B] tracking-tight">
            Payment Management
          </h1>
          <p className="text-[#64748B] text-[14px] md:text-[16px]">
            Track and manage all transactions
          </p>

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

      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: isDetailView ? 0.3 : 0.15 }}
          >
            {isListView && (
              <>
                {view === "LIST_HISTORY" && (
                  <PaymentHistoryTable
                    onViewDetails={handleViewPaymentDetails}
                  />
                )}

                {view === "PLATFORM_PRICING" && <PlatformPricingTab />}
              </>
            )}

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
