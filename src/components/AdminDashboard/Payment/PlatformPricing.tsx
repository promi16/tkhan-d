import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Percent,
  DollarSign,
  Edit3,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetPlatformPricingQuery,
  useUpdatePlatformPricingMutation,
} from "../../../redux/features/platform/platformPricingApi";

export const PlatformPricingTab: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { data, isLoading, isError } = useGetPlatformPricingQuery();

  const [updatePricing, { isLoading: isUpdating }] =
    useUpdatePlatformPricingMutation();

  const currentCharge = data?.data?.serviceChargeAmount ?? "0";

  useEffect(() => {
    if (currentCharge) setInputValue(currentCharge);
  }, [currentCharge]);

  const handleEdit = () => {
    setInputValue(currentCharge);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue(currentCharge);
  };

  const handleSave = async () => {
    const parsed = Number(inputValue);
    if (!inputValue || isNaN(parsed) || parsed < 0 || parsed > 100) {
      toast.error("Please enter a valid charge between 0 and 100.");
      return;
    }
    try {
      await updatePricing({ serviceChargeAmount: parsed }).unwrap();
      toast.success("Platform pricing updated successfully!");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update pricing. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 text-[#FF6B35] animate-spin" />
        <span className="ml-2 text-gray-400 text-sm">Loading pricing...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-400 text-sm">
          Failed to load platform pricing. Please refresh.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-2 px-4 sm:px-6 lg:px-8 w-full lg:max-w-[910px]"
    >
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FFF4EF] flex items-center justify-center">
            <Settings className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF6B35]" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-800">
              Platform Service Charge
            </p>
            <p className="text-[10px] sm:text-xs text-gray-400">
              Applied to every completed booking
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#FFF4EF] to-[#FFE8DC] flex flex-col items-center justify-center border border-orange-100">
                  <span className="text-2xl sm:text-3xl font-bold text-[#FF6B35]">
                    {currentCharge}%
                  </span>
                  <span className="text-[8px] sm:text-[10px] text-orange-400 font-medium mt-0.5">
                    per booking
                  </span>
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-[#FF6B35] rounded-full flex items-center justify-center">
                  <Percent className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                </div>
              </div>

              <div>
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest mb-1">
                  Current Rate
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {currentCharge}%
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  On a $100 booking → platform earns{" "}
                  <span className="text-[#FF6B35] font-semibold">
                    ${((Number(currentCharge) / 100) * 100).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>

            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEdit}
                className="flex cursor-pointer items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#FF6B35] text-white text-xs sm:text-sm font-medium rounded-xl hover:bg-[#e85d2a] transition-colors shadow-sm shadow-orange-200 w-full lg:w-auto"
              >
                <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                Edit Charge
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-100">
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                    Set New Service Charge
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                    <div className="relative flex-1 w-full sm:max-w-[200px]">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full pl-8 sm:pl-9 pr-10 sm:pr-12 py-2 sm:py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100 bg-white"
                        placeholder="e.g. 5"
                        autoFocus
                      />
                      <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm font-medium">
                        %
                      </span>
                    </div>

                    {inputValue && !isNaN(Number(inputValue)) && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-orange-50 rounded-xl border border-orange-100 w-full sm:w-auto"
                      >
                        <span className="text-[10px] sm:text-xs text-gray-500">
                          Preview:
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#FF6B35]">
                          $100 booking → $
                          {((Number(inputValue) / 100) * 100).toFixed(2)} fee
                        </span>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={isUpdating || !inputValue}
                      className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#FF6B35] text-white text-xs sm:text-sm font-medium rounded-xl hover:bg-[#e85d2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-orange-200 w-full sm:w-auto"
                    >
                      {isUpdating ? (
                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      ) : (
                        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="flex items-center cursor-pointer justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-gray-600 text-xs sm:text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 w-full sm:w-auto"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-[10px] sm:text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block flex-shrink-0" />
              <span>Changes apply to new bookings only</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block flex-shrink-0" />
              <span>Groomer earnings = Total − Service Charge</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlatformPricingTab;
