import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (type: "approve" | "reject") => void;
  type: "approve" | "reject";
}

export const ActionModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm font-['Inter']">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[20px] w-full max-w-[440px] p-8 relative shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#94A3B8] hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                  type === "approve" ? "bg-[#ECFDF5]" : "bg-[#FEF2F2]"
                }`}
              >
                {type === "approve" ? (
                  <CheckCircle2 size={48} className="text-[#10B981]" />
                ) : (
                  <XCircle size={48} className="text-[#EF4444]" />
                )}
              </div>
              <h3 className="text-[24px] font-bold text-[#1E293B] mb-2">
                {type === "approve" ? "Approve Payout?" : "Reject Payout?"}
              </h3>
              <p className="text-[#64748B] text-[16px] mb-8 px-4">
                Are you sure you want to {type} this payment request? This
                action cannot be undone.
              </p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-xl border border-[#E2E8F0] text-[#64748B] font-bold hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onConfirm(type)}
                  className={`flex-1 py-3.5 rounded-xl text-white font-bold transition-all active:scale-95 shadow-lg cursor-pointer ${
                    type === "approve"
                      ? "bg-[#10B981] shadow-green-100 hover:bg-[#059669]"
                      : "bg-[#EF4444] shadow-red-100 hover:bg-[#DC2626]"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
