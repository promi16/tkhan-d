import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, XCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  isLoading?: boolean;
}

const RejectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [reason, setReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setShowSuccess(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!reason.trim() || isProcessing || isLoading) return;

    setIsProcessing(true);
    try {
      await onConfirm(reason.trim());
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
        setReason("");
      }, 2000);
    } catch (error) {
      console.error("Rejection failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const busy = isProcessing || isLoading;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-['Inter']">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!busy ? onClose : undefined}
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-[20px] p-6 sm:p-8 md:p-10 w-full max-w-lg shadow-2xl relative z-10 border border-gray-100 mx-4 sm:mx-0"
          >
            {!showSuccess ? (
              <>
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-gray-900">
                    Reject Application
                  </h3>
                  <button
                    onClick={onClose}
                    disabled={busy}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 disabled:opacity-50"
                  >
                    <X size={24} />
                  </button>
                </div>

                <textarea
                  className="w-full h-36 sm:h-44 bg-[#F5F6F7] border-none rounded-[15px] p-4 sm:p-6 focus:ring-2 ring-red-500/20 outline-none resize-none mb-6 sm:mb-10 text-base sm:text-lg font-light placeholder:text-gray-400 tracking-tight text-gray-900"
                  placeholder="Enter rejection reason (e.g., Invalid documents, Insufficient experience, etc.)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={busy}
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleConfirm}
                    disabled={!reason.trim() || busy}
                    className={`bg-red-600 px-6 sm:px-10 py-2.5 sm:py-3 rounded-xl font-medium flex items-center justify-center gap-3 transition-all shadow-2xl shadow-red-100 w-full sm:w-auto text-white ${
                      !reason.trim() || busy
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-red-700 active:scale-95 cursor-pointer"
                    }`}
                  >
                    {busy ? (
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white" />
                    ) : (
                      <XCircle size={20} />
                    )}
                    <span className="text-sm sm:text-base font-medium">
                      {busy ? "Rejecting..." : "Reject Application"}
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <XCircle size={24} className="text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                  Application Rejected
                </h3>
                <p className="text-sm sm:text-base text-gray-500">
                  The application has been rejected successfully.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RejectModal;
