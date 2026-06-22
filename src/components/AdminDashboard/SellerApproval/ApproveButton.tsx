import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onApprove: () => Promise<void>;
  isLoading?: boolean;
}

const ApproveButton: React.FC<Props> = ({ onApprove, isLoading = false }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    if (isProcessing || isLoading) return;
    setIsProcessing(true);
    try {
      await onApprove();
      setShowSuccess(true);
    } catch (error) {
      console.error("Approval failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const isDisabled = showSuccess || isProcessing || isLoading;

  return (
    <div className="relative w-full sm:w-auto">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute -top-14 left-0 right-0 flex justify-center z-50"
          >
            <div className="bg-green-50 text-green-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-green-100 text-[10px] sm:text-[12px] font-bold shadow-xl flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircle size={14} className="text-green-500" />
              Application Approved Successfully!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleApprove}
        disabled={isDisabled}
        className={`flex items-center justify-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-sm active:scale-95 w-full sm:w-auto ${
          isDisabled
            ? "bg-green-100 text-green-500 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
        }`}
      >
        {isProcessing || isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
        ) : (
          <CheckCircle size={16} strokeWidth={2.5} />
        )}
        <span className="tracking-tight">
          {isProcessing || isLoading
            ? "Processing..."
            : showSuccess
              ? "Approved ✓"
              : "Approve Application"}
        </span>
      </button>
    </div>
  );
};

export default ApproveButton;
