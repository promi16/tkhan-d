// src/pages/Admin/UsersPage.tsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { UserTable } from "@/components/AdminDashboard/Users/UserTable";
import { UserDetails } from "@/components/AdminDashboard/Users/UserDetails";
import { UserBookings } from "@/components/AdminDashboard/Users/UserBookings";
import { UserFeedback } from "@/components/AdminDashboard/Users/UserFeedback";
import ManageCategory from "@/components/AdminDashboard/Users/ManageCategory";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

import {
  useGetUserDetailsQuery,
  useBlockUserMutation,
} from "../../redux/features/users/usersApi";
import { UserDetailsResponse } from "../../redux/features/users/usersType";
import toast from "react-hot-toast";

interface ErrorResponseData {
  message?: string;
  error?: string;
  statusCode?: number;
  success?: boolean;
}

interface ApiError {
  data?: ErrorResponseData;
  message?: string;
  status?: number;
}

const UsersPage = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Details");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [mainActiveTab, setMainActiveTab] = useState<string>("User Management");

  const { data: userDetailsData, isLoading: isLoadingUser } =
    useGetUserDetailsQuery(selectedUserId || "", {
      skip: !selectedUserId,
    });

  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();

  const selectedUser = (userDetailsData as UserDetailsResponse)?.data?.user;
  const isBlocked = selectedUser?.isBlocked || false;

  const userFeedbackReviews =
    (userDetailsData as UserDetailsResponse)?.data?.feedback?.received ?? [];

  const tabs: string[] = ["Details", "Bookings", "Feedback"];
  const mainTabs: string[] = ["User Management", "Manage Category"];

  const showBlockButton = activeTab === "Bookings" || activeTab === "Feedback";

  const handleBlockToggle = async (): Promise<void> => {
    if (!selectedUserId) {
      toast.error("No user selected");
      return;
    }

    const newBlockStatus = !isBlocked;
    const action = newBlockStatus ? "block" : "unblock";

    try {
      await blockUser({
        userId: selectedUserId,
        data: {
          isBlocked: newBlockStatus,
          note: `User ${action}ed by admin at ${new Date().toISOString()}`,
        },
      }).unwrap();

      toast.success(`User ${action}ed successfully!`, {
        duration: 3000,
        position: "top-center",
      });

      setShowModal(false);
    } catch (error: unknown) {
      let errorMessage = `Failed to ${!isBlocked ? "block" : "unblock"} user`;
      const err = error as FetchBaseQueryError | SerializedError | ApiError;

      if ("status" in err && err.status !== undefined) {
        const statusCode = err.status;
        if (statusCode === 401)
          errorMessage = "Unauthorized. Please login again.";
        else if (statusCode === 403)
          errorMessage = "You don't have permission.";
        else if (statusCode === 404) errorMessage = "User not found.";
        else if (statusCode === 500)
          errorMessage = "Server error. Try again later.";
      }
      if ("data" in err && err.data && typeof err.data === "object") {
        const errorData = err.data as ErrorResponseData;
        if (errorData.message) errorMessage = errorData.message;
        if (errorData.error) errorMessage = errorData.error;
      }
      if ("message" in err && err.message) errorMessage = err.message;

      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-[1485px] mx-auto px-4 sm:px-6 overflow-hidden">
      {!selectedUserId && (
        <div className="mb-8 mt-4">
          <div className="flex items-center gap-8 w-fit">
            {mainTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setMainActiveTab(tab);
                  setSelectedUserId(null);
                }}
                className={`pb-4 font-semibold text-sm md:text-base relative transition-colors cursor-pointer border-b-2 ${
                  mainActiveTab === tab
                    ? "text-[#FF6B35] border-transparent"
                    : "text-gray-500 hover:text-[#FF6B35] border-gray-200"
                }`}
              >
                {tab}
                {mainActiveTab === tab && (
                  <motion.div
                    layoutId="mainTabUnderline"
                    className="absolute bottom-[-2px] left-0 right-0 h-[3px] bg-[#FF6B35] rounded-t-full z-10"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {mainActiveTab === "User Management" ? (
          <motion.div
            key="user-management"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AnimatePresence mode="wait">
              {!selectedUserId ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <UserTable
                    onViewDetails={(id: string) => setSelectedUserId(id)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="details"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pt-4"
                >
                  <button
                    onClick={() => {
                      setSelectedUserId(null);
                      setActiveTab("Details");
                    }}
                    className="mb-6 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                  >
                    <ArrowLeft size={24} />
                  </button>

                  {isLoadingUser ? (
                    <div className="flex justify-center items-center py-20">
                      <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
                    </div>
                  ) : (
                    <>
                      <div className="mb-6 pb-4 border-b border-gray-100">
                        {/* ── Responsive heading: sm→base, md→xl, lg→2xl ── */}
                        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 leading-tight">
                          {selectedUser?.fullName ||
                            selectedUser?.email ||
                            "User"}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {selectedUser?.email} • {selectedUser?.role}
                        </p>
                      </div>

                      <div className="flex items-center justify-start gap-8 border-b border-gray-100 mb-8 w-full pb-2">
                        <div className="flex items-center gap-6 sm:gap-8 lg:gap-10">
                          {tabs.map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                              <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2 font-bold text-sm whitespace-nowrap relative transition-colors cursor-pointer block select-none ${
                                  isActive
                                    ? "text-[#FF6B35]"
                                    : "text-gray-400 hover:text-[#1E293B]"
                                }`}
                              >
                                {tab}
                                {isActive && (
                                  <motion.div
                                    layoutId="tabUnderline"
                                    transition={{
                                      type: "spring",
                                      stiffness: 380,
                                      damping: 30,
                                    }}
                                    className="absolute bottom-[-9px] left-0 right-0 h-[3px] bg-[#FF6B35] rounded-t-full will-change-transform"
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex items-center">
                          <AnimatePresence>
                            {showBlockButton && (
                              <motion.div
                                key="block-btn"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                              >
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setShowModal(true)}
                                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-white text-[10px] md:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-sm ${
                                    isBlocked
                                      ? "bg-green-600 hover:bg-green-700"
                                      : "bg-red-600 hover:bg-red-700"
                                  }`}
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <line
                                      x1="4.93"
                                      y1="4.93"
                                      x2="19.07"
                                      y2="19.07"
                                    />
                                  </svg>
                                  {isBlocked ? "Unblock User" : "Block User"}
                                </motion.button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="w-full relative block">
                        {activeTab === "Details" && (
                          <UserDetails user={selectedUser} />
                        )}
                        {activeTab === "Bookings" && (
                          <UserBookings userId={selectedUserId} />
                        )}
                        {activeTab === "Feedback" && (
                          <UserFeedback
                            user={selectedUser}
                            userId={selectedUserId}
                            reviews={userFeedbackReviews}
                          />
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="manage-category"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ManageCategory />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Block/Unblock Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-auto text-center"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isBlocked
                    ? "bg-green-50 text-green-500"
                    : "bg-red-50 text-red-500"
                }`}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isBlocked
                  ? `Unblock ${selectedUser?.fullName || selectedUser?.email?.split("@")[0] || "User"}?`
                  : `Block ${selectedUser?.fullName || selectedUser?.email?.split("@")[0] || "User"}?`}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {isBlocked
                  ? "This user will be able to access the platform again."
                  : "This user will lose access to the platform immediately."}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isBlocking}
                  className="flex-1 py-3 bg-gray-100 rounded-xl font-medium cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockToggle}
                  disabled={isBlocking}
                  className={`flex-1 py-3 text-white rounded-xl font-medium cursor-pointer transition-all ${
                    isBlocked
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  } ${isBlocking ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isBlocking ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : isBlocked ? (
                    "Unblock"
                  ) : (
                    "Confirm Block"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UsersPage;
