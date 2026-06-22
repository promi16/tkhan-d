import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  DollarSign,
  Package,
  ChevronDown,
  ChevronUp,
  MapPin,
  Home,
  X,
  Mail,
  Phone,
  Star,
} from "lucide-react";
import { Booking, Addon } from "../../../redux/features/users/usersType";
import { useGetUserDetailsQuery } from "../../../redux/features/users/usersApi";

interface UserBookingsProps {
  userId: string;
}

export const UserBookings: React.FC<UserBookingsProps> = ({ userId }) => {
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(
    null,
  );
  const [sellerModal, setSellerModal] = useState<Record<
    string,
    unknown
  > | null>(null);

  const { data: userDetailsData, isLoading } = useGetUserDetailsQuery(userId, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });

  const bookings = React.useMemo(() => {
    const raw = userDetailsData?.data?.bookings;
    return (Array.isArray(raw) ? raw : []) as Booking[];
  }, [userDetailsData]);

  const getStatusColor = (status?: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      ONGOING: "bg-purple-100 text-purple-800 border-purple-200",
      REFUNDED: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status ?? ""] ?? "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "COMPLETED":
        return "✅";
      case "PENDING":
        return "⏳";
      case "CONFIRMED":
        return "✓";
      case "CANCELLED":
        return "✗";
      case "ONGOING":
        return "🔄";
      default:
        return "📋";
    }
  };

  const getBookingDate = (booking: Booking): string => {
    const b = booking as Record<string, unknown>;
    const slot = b?.availabilitySlot as Record<string, unknown>;
    const avail = slot?.availability as Record<string, unknown>;
    const raw =
      (avail?.date as string) ||
      (slot?.startTime as string) ||
      booking.createdAt;
    if (!raw) return "Date not set";
    try {
      return new Date(raw).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const getBookingTime = (booking: Booking): string => {
    const b = booking as Record<string, unknown>;
    const slot = b?.availabilitySlot as Record<string, unknown>;
    const raw = (slot?.startTime as string) || null;
    if (!raw) return "Time not set";
    try {
      return new Date(raw).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid time";
    }
  };

  const formatPrice = (price?: number) => {
    if (price == null) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const toggleExpand = (bookingId: string) => {
    setExpandedBookingId((prev) => (prev === bookingId ? null : bookingId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto" />
          <p className="mt-4 text-gray-500">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Outer wrapper: max-w-[1200px], full width on sm/md ── */}
      <div className="w-full max-w-[1200px] lg:ml-1 mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 sm:py-24 bg-gray-50 rounded-xl min-h-[320px] flex flex-col justify-center items-center"
          >
            <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-500 text-base sm:text-lg">
              No bookings found
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
              This user hasn't made any bookings yet
            </p>
          </motion.div>
        ) : (
          bookings.map((booking, index) => {
            const bookingId = booking?.id ?? `booking-${index}`;
            const isExpanded = expandedBookingId === bookingId;
            const groomer = (booking as Record<string, unknown>)
              ?.groomer as Record<string, unknown>;

            return (
              <motion.div
                key={bookingId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* ── Booking Card Header ── */}
                <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-3 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-medium border ${getStatusColor(booking?.status)}`}
                        >
                          <span>{getStatusIcon(booking?.status)}</span>
                          <span>{booking?.status ?? "UNKNOWN"}</span>
                        </span>
                        <span className="text-[9px] text-gray-400">
                          ID: {booking?.id?.slice(0, 8) ?? `BK-${index + 1}`}
                        </span>
                      </div>
                      <h4 className="font-semibold text-base sm:text-lg lg:text-xl text-gray-800 mb-1.5 sm:mb-2">
                        {((
                          (booking as Record<string, unknown>)
                            ?.services as Record<string, unknown>[]
                        )?.[0]?.serviceTitle as string) ?? "Service Booking"}
                      </h4>
                      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#FF6B35]" />
                          <span>{getBookingDate(booking)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
                          <span>{getBookingTime(booking)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-[#FF6B35]" />
                          <span className="font-semibold">
                            {formatPrice(
                              parseFloat(
                                ((booking as Record<string, unknown>)
                                  ?.totalAmount as string) ?? "0",
                              ),
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Expanded Detail Panel ── */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-100 bg-white"
                    >
                      <div className="p-3 sm:p-4 md:p-5 lg:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* ── Column 1: Total Package + Service Information ── */}
                        <div className="flex flex-col gap-4">
                          <div className="bg-[#FF6B35] rounded-xl p-4 text-white">
                            <div className="flex items-center gap-1.5 mb-1">
                              <DollarSign className="w-3.5 h-3.5 opacity-90" />
                              <span className="text-xs font-medium opacity-90">
                                Total Package
                              </span>
                            </div>
                            <p className="text-3xl font-bold">
                              {formatPrice(
                                parseFloat(
                                  ((booking as Record<string, unknown>)
                                    ?.totalAmount as string) ?? "0",
                                ),
                              )}
                            </p>
                          </div>

                          <div>
                            <h5 className="font-semibold text-sm text-gray-800 mb-3">
                              Service Information
                            </h5>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                  Service
                                </span>
                                <span className="text-xs font-semibold text-[#FF6B35]">
                                  {formatPrice(
                                    parseFloat(
                                      ((
                                        (booking as Record<string, unknown>)
                                          ?.services as Record<
                                          string,
                                          unknown
                                        >[]
                                      )?.[0]?.price as string) ?? "0",
                                    ),
                                  )}
                                </span>
                              </div>

                              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 mt-1">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Calendar className="w-3.5 h-3.5 text-[#FF6B35]" />
                                  <span className="text-xs text-gray-500">
                                    Date &amp; Time
                                  </span>
                                </div>
                                <p className="text-sm font-medium text-gray-800">
                                  {getBookingDate(booking)}
                                </p>
                                <p className="text-sm font-medium text-[#FF6B35]">
                                  {getBookingTime(booking)}
                                </p>
                              </div>

                              <div>
                                <span className="text-xs text-gray-500">
                                  Duration
                                </span>
                                <p className="text-sm font-medium text-gray-800">
                                  {((
                                    (booking as Record<string, unknown>)
                                      ?.services as Record<string, unknown>[]
                                  )?.[0]?.durationMinutes as number)
                                    ? `${
                                        Math.floor(
                                          ((
                                            (booking as Record<string, unknown>)
                                              ?.services as Record<
                                              string,
                                              unknown
                                            >[]
                                          )?.[0]?.durationMinutes as number) /
                                            60,
                                        ) > 0
                                          ? `${Math.floor((((booking as Record<string, unknown>)?.services as Record<string, unknown>[])?.[0]?.durationMinutes as number) / 60)} hour${Math.floor((((booking as Record<string, unknown>)?.services as Record<string, unknown>[])?.[0]?.durationMinutes as number) / 60) > 1 ? "s" : ""}`
                                          : ""
                                      }${
                                        ((
                                          (booking as Record<string, unknown>)
                                            ?.services as Record<
                                            string,
                                            unknown
                                          >[]
                                        )?.[0]?.durationMinutes as number) %
                                          60 >
                                        0
                                          ? ` ${(((booking as Record<string, unknown>)?.services as Record<string, unknown>[])?.[0]?.durationMinutes as number) % 60} mins`
                                          : ""
                                      }`.trim()
                                    : "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ── Column 2: Add-Ons + Service Location ── */}
                        <div className="flex flex-col gap-4">
                          <div>
                            <h5 className="font-semibold text-sm text-gray-800 mb-3 flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5 text-[#FF6B35]" />
                              Add-Ons Selected
                            </h5>
                            {booking?.addons && booking.addons.length > 0 ? (
                              <div className="space-y-2">
                                {booking.addons.map(
                                  (addon: Addon, idx: number) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between items-start"
                                    >
                                      <div>
                                        <p className="text-sm font-medium text-gray-800">
                                          {addon?.title ??
                                            addon?.name ??
                                            "Extra service"}
                                        </p>
                                        {(
                                          addon as unknown as Record<
                                            string,
                                            unknown
                                          >
                                        )?.durationMinutes != null && (
                                          <p className="text-xs text-gray-400">
                                            {
                                              (
                                                addon as unknown as Record<
                                                  string,
                                                  unknown
                                                >
                                              ).durationMinutes as number
                                            }{" "}
                                            mins
                                          </p>
                                        )}
                                      </div>
                                      {addon?.price > 0 && (
                                        <span className="text-sm font-semibold text-[#FF6B35]">
                                          {formatPrice(addon.price)}
                                        </span>
                                      )}
                                    </div>
                                  ),
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400">
                                No add-ons selected
                              </p>
                            )}
                          </div>

                          <div>
                            <h5 className="font-semibold text-sm text-gray-800 mb-3">
                              Service Location
                            </h5>
                            <div className="space-y-2">
                              <div className="border border-[#FF6B35] rounded-lg px-3 py-2 flex items-center gap-2 bg-[#FFF5F1]">
                                <Home className="w-3.5 h-3.5 text-[#FF6B35]" />
                                <span className="text-xs font-medium text-[#FF6B35]">
                                  {((booking as Record<string, unknown>)
                                    ?.serviceLocation as string) ??
                                    "At-home Groom"}
                                </span>
                              </div>
                              {((booking as Record<string, unknown>)
                                ?.addressLine as string) && (
                                <div className="flex items-start gap-2 pt-1">
                                  <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-[10px] text-gray-400 mb-0.5">
                                      Complete Address
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      {
                                        (booking as Record<string, unknown>)
                                          ?.addressLine as string
                                      }
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ── Column 3: Seller Card ── */}
                        <div className="md:col-span-2 lg:col-span-1">
                          <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center gap-2 h-[250px]">
                            <p className="text-xs text-gray-500 self-start w-full mb-1">
                              Seller
                            </p>

                            {/* Bigger avatar */}
                            <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200 shrink-0">
                              {groomer?.profileImage ? (
                                <img
                                  src={groomer.profileImage as string}
                                  alt={
                                    (groomer?.fullName as string) ?? "Groomer"
                                  }
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-semibold">
                                  {((groomer?.fullName as string) ?? "G")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              )}
                            </div>

                            {/* Name */}
                            <p className="text-sm font-semibold text-gray-800 mt-1">
                              {(groomer?.fullName as string) ?? "Not assigned"}
                            </p>

                            {/* Spacer pushes button to bottom */}
                            <div className="flex-1" />

                            {/* View Details button — tight to bottom */}
                            <button
                              onClick={() => setSellerModal(groomer ?? {})}
                              className="w-full bg-[#FF6B35] cursor-pointer text-white text-xs font-medium py-2 px-4 rounded-lg hover:bg-[#e55a25] transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Show More / Show Less toggle */}
                <button
                  onClick={() => toggleExpand(bookingId)}
                  className="w-full py-2 text-center text-[10px] text-gray-400 hover:text-[#FF6B35] hover:bg-gray-50 transition-colors border-t border-gray-100 cursor-pointer flex items-center justify-center gap-1"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      <span>Show Less</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      <span>View Details</span>
                    </>
                  )}
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ── Seller Details Modal ── */}
      <AnimatePresence>
        {sellerModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSellerModal(null)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#FF6B35] px-5 py-4 flex items-center justify-between">
                <p className="text-white font-semibold text-sm">
                  Seller Details
                </p>
                <button
                  onClick={() => setSellerModal(null)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col items-center gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200">
                  {(sellerModal?.profileImage as string) ? (
                    <img
                      src={sellerModal.profileImage as string}
                      alt={(sellerModal?.fullName as string) ?? "Groomer"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-semibold">
                      {((sellerModal?.fullName as string) ?? "G")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name + role */}
                <div className="text-center">
                  <p className="text-base font-bold text-gray-800">
                    {(sellerModal?.fullName as string) ?? "Not assigned"}
                  </p>
                  {(sellerModal?.role as string) && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {sellerModal.role as string}
                    </p>
                  )}
                </div>

                {/* Dynamic info list */}
                <div className="w-full divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {(sellerModal?.email as string) && (
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Mail className="w-4 h-4 text-[#FF6B35] shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-400">Email</p>
                        <p className="text-xs font-medium text-gray-700">
                          {sellerModal.email as string}
                        </p>
                      </div>
                    </div>
                  )}
                  {(sellerModal?.phone as string) && (
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Phone className="w-4 h-4 text-[#FF6B35] shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-400">Phone</p>
                        <p className="text-xs font-medium text-gray-700">
                          {sellerModal.phone as string}
                        </p>
                      </div>
                    </div>
                  )}
                  {(sellerModal?.city as string) && (
                    <div className="flex items-center gap-3 px-4 py-3">
                      <MapPin className="w-4 h-4 text-[#FF6B35] shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-400">City</p>
                        <p className="text-xs font-medium text-gray-700">
                          {sellerModal.city as string}
                        </p>
                      </div>
                    </div>
                  )}
                  {(sellerModal?.rating as number) != null && (
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Star className="w-4 h-4 text-[#FF6B35] shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-400">Rating</p>
                        <p className="text-xs font-medium text-gray-700">
                          ⭐ {sellerModal.rating as number}
                        </p>
                      </div>
                    </div>
                  )}
                  {(sellerModal?.totalBookings as number) != null && (
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Package className="w-4 h-4 text-[#FF6B35] shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-400">
                          Total Bookings
                        </p>
                        <p className="text-xs font-medium text-gray-700">
                          {sellerModal.totalBookings as number}
                        </p>
                      </div>
                    </div>
                  )}
                  {!sellerModal?.email &&
                    !sellerModal?.phone &&
                    !sellerModal?.city &&
                    !sellerModal?.rating &&
                    !sellerModal?.totalBookings && (
                      <div className="px-4 py-6 text-center text-xs text-gray-400">
                        No additional details available
                      </div>
                    )}
                </div>

                <button
                  onClick={() => setSellerModal(null)}
                  className="w-full border border-gray-200 text-gray-600 text-xs font-medium py-2 px-4 rounded-lg hover:bg-[#FFF5F1] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Calendar,
//   Clock,
//   DollarSign,
//   Package,
//   ChevronDown,
//   ChevronUp,
//   MapPin,
//   Home,
//   X,
//   Mail,
//   Phone,
//   Star,
// } from "lucide-react";
// import { Booking, Addon } from "../../../redux/features/users/usersType";
// import { useGetUserDetailsQuery } from "../../../redux/features/users/usersApi";

// interface UserBookingsProps {
//   userId: string;
// }

// export const UserBookings: React.FC<UserBookingsProps> = ({ userId }) => {
//   const [expandedBookingId, setExpandedBookingId] = useState<string | null>(
//     null,
//   );
//   const [sellerModal, setSellerModal] = useState<Record<
//     string,
//     unknown
//   > | null>(null);

//   const { data: userDetailsData, isLoading } = useGetUserDetailsQuery(userId, {
//     skip: !userId,
//     refetchOnMountOrArgChange: true,
//   });

//   const bookings = React.useMemo(() => {
//     const raw = userDetailsData?.data?.bookings;
//     return (Array.isArray(raw) ? raw : []) as Booking[];
//   }, [userDetailsData]);

//   const getStatusColor = (status?: string) => {
//     const colors: Record<string, string> = {
//       PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
//       CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
//       COMPLETED: "bg-green-100 text-green-800 border-green-200",
//       CANCELLED: "bg-red-100 text-red-800 border-red-200",
//       ONGOING: "bg-purple-100 text-purple-800 border-purple-200",
//       REFUNDED: "bg-gray-100 text-gray-800 border-gray-200",
//     };
//     return colors[status ?? ""] ?? "bg-gray-100 text-gray-800 border-gray-200";
//   };

//   const getStatusIcon = (status?: string) => {
//     switch (status) {
//       case "COMPLETED":
//         return "✅";
//       case "PENDING":
//         return "⏳";
//       case "CONFIRMED":
//         return "✓";
//       case "CANCELLED":
//         return "✗";
//       case "ONGOING":
//         return "🔄";
//       default:
//         return "📋";
//     }
//   };

//   const getBookingDate = (booking: Booking): string => {
//     const b = booking as Record<string, unknown>;
//     const slot = b?.availabilitySlot as Record<string, unknown>;
//     const avail = slot?.availability as Record<string, unknown>;
//     const raw =
//       (avail?.date as string) ||
//       (slot?.startTime as string) ||
//       booking.createdAt;
//     if (!raw) return "Date not set";
//     try {
//       return new Date(raw).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });
//     } catch {
//       return "Invalid date";
//     }
//   };

//   const getBookingTime = (booking: Booking): string => {
//     const b = booking as Record<string, unknown>;
//     const slot = b?.availabilitySlot as Record<string, unknown>;
//     const raw = (slot?.startTime as string) || null;
//     if (!raw) return "Time not set";
//     try {
//       return new Date(raw).toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       });
//     } catch {
//       return "Invalid time";
//     }
//   };

//   const formatPrice = (price?: number) => {
//     if (price == null) return "$0.00";
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 2,
//     }).format(price);
//   };

//   const toggleExpand = (bookingId: string) => {
//     setExpandedBookingId((prev) => (prev === bookingId ? null : bookingId));
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center py-20">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto" />
//           <p className="mt-4 text-gray-500">Loading bookings...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* ── Outer wrapper: max-w-[1200px], full width on sm/md ── */}
//       <div className="w-full max-w-[1200px] lg:ml-1 mx-auto space-y-4 sm:space-y-5 md:space-y-6">
//         {bookings.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center py-16 sm:py-24 bg-gray-50 rounded-xl min-h-[320px] flex flex-col justify-center items-center"
//           >
//             <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
//             <p className="text-gray-500 text-base sm:text-lg">
//               No bookings found
//             </p>
//             <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
//               This user hasn't made any bookings yet
//             </p>
//           </motion.div>
//         ) : (
//           bookings.map((booking, index) => {
//             const bookingId = booking?.id ?? `booking-${index}`;
//             const isExpanded = expandedBookingId === bookingId;
//             const groomer = (booking as Record<string, unknown>)
//               ?.groomer as Record<string, unknown>;

//             return (
//               <motion.div
//                 key={bookingId}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.02 }}
//                 className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
//               >
//                 {/* ── Booking Card Header ── */}
//                 <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-gradient-to-r from-gray-50 to-white">
//                   <div className="flex flex-col lg:flex-row justify-between items-start gap-3 sm:gap-4">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1.5 sm:mb-2 flex-wrap">
//                         <span
//                           className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-medium border ${getStatusColor(booking?.status)}`}
//                         >
//                           <span>{getStatusIcon(booking?.status)}</span>
//                           <span>{booking?.status ?? "UNKNOWN"}</span>
//                         </span>
//                         <span className="text-[9px] text-gray-400">
//                           ID: {booking?.id?.slice(0, 8) ?? `BK-${index + 1}`}
//                         </span>
//                       </div>
//                       <h4 className="font-semibold text-base sm:text-lg lg:text-xl text-gray-800 mb-1.5 sm:mb-2">
//                         {((
//                           (booking as Record<string, unknown>)
//                             ?.services as Record<string, unknown>[]
//                         )?.[0]?.serviceTitle as string) ?? "Service Booking"}
//                       </h4>
//                       <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
//                         <div className="flex items-center gap-1">
//                           <Calendar className="w-3.5 h-3.5 text-[#FF6B35]" />
//                           <span>{getBookingDate(booking)}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
//                           <span>{getBookingTime(booking)}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <DollarSign className="w-3.5 h-3.5 text-[#FF6B35]" />
//                           <span className="font-semibold">
//                             {formatPrice(
//                               parseFloat(
//                                 ((booking as Record<string, unknown>)
//                                   ?.totalAmount as string) ?? "0",
//                               ),
//                             )}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ── Expanded Detail Panel ── */}
//                 <AnimatePresence>
//                   {isExpanded && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: "auto", opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.2 }}
//                       className="border-t border-gray-100 bg-white"
//                     >
//                       <div className="p-3 sm:p-4 md:p-5 lg:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//                         {/* ── Column 1: Total Package + Service Information ── */}
//                         <div className="flex flex-col gap-4">
//                           <div className="bg-[#FF6B35] rounded-xl p-4 text-white">
//                             <div className="flex items-center gap-1.5 mb-1">
//                               <DollarSign className="w-3.5 h-3.5 opacity-90" />
//                               <span className="text-xs font-medium opacity-90">
//                                 Total Package
//                               </span>
//                             </div>
//                             <p className="text-3xl font-bold">
//                               {formatPrice(
//                                 parseFloat(
//                                   ((booking as Record<string, unknown>)
//                                     ?.totalAmount as string) ?? "0",
//                                 ),
//                               )}
//                             </p>
//                           </div>

//                           <div>
//                             <h5 className="font-semibold text-sm text-gray-800 mb-3">
//                               Service Information
//                             </h5>
//                             <div className="space-y-3">
//                               <div className="flex justify-between items-center">
//                                 <span className="text-xs text-gray-500">
//                                   Service
//                                 </span>
//                                 <span className="text-xs font-semibold text-[#FF6B35]">
//                                   {formatPrice(
//                                     parseFloat(
//                                       ((
//                                         (booking as Record<string, unknown>)
//                                           ?.services as Record<
//                                           string,
//                                           unknown
//                                         >[]
//                                       )?.[0]?.price as string) ?? "0",
//                                     ),
//                                   )}
//                                 </span>
//                               </div>

//                               <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 mt-1">
//                                 <div className="flex items-center gap-1.5 mb-1">
//                                   <Calendar className="w-3.5 h-3.5 text-[#FF6B35]" />
//                                   <span className="text-xs text-gray-500">
//                                     Date &amp; Time
//                                   </span>
//                                 </div>
//                                 <p className="text-sm font-medium text-gray-800">
//                                   {getBookingDate(booking)}
//                                 </p>
//                                 <p className="text-sm font-medium text-[#FF6B35]">
//                                   {getBookingTime(booking)}
//                                 </p>
//                               </div>

//                               <div>
//                                 <span className="text-xs text-gray-500">
//                                   Duration
//                                 </span>
//                                 <p className="text-sm font-medium text-gray-800">
//                                   {((
//                                     (booking as Record<string, unknown>)
//                                       ?.services as Record<string, unknown>[]
//                                   )?.[0]?.durationMinutes as number)
//                                     ? `${
//                                         Math.floor(
//                                           ((
//                                             (booking as Record<string, unknown>)
//                                               ?.services as Record<
//                                               string,
//                                               unknown
//                                             >[]
//                                           )?.[0]?.durationMinutes as number) /
//                                             60,
//                                         ) > 0
//                                           ? `${Math.floor((((booking as Record<string, unknown>)?.services as Record<string, unknown>[])?.[0]?.durationMinutes as number) / 60)} hour${Math.floor((((booking as Record<string, unknown>)?.services as Record<string, unknown>[])?.[0]?.durationMinutes as number) / 60) > 1 ? "s" : ""}`
//                                           : ""
//                                       }${
//                                         ((
//                                           (booking as Record<string, unknown>)
//                                             ?.services as Record<
//                                             string,
//                                             unknown
//                                           >[]
//                                         )?.[0]?.durationMinutes as number) %
//                                           60 >
//                                         0
//                                           ? ` ${(((booking as Record<string, unknown>)?.services as Record<string, unknown>[])?.[0]?.durationMinutes as number) % 60} mins`
//                                           : ""
//                                       }`.trim()
//                                     : "-"}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* ── Column 2: Add-Ons + Service Location ── */}
//                         <div className="flex flex-col gap-4">
//                           <div>
//                             <h5 className="font-semibold text-sm text-gray-800 mb-3 flex items-center gap-1.5">
//                               <Package className="w-3.5 h-3.5 text-[#FF6B35]" />
//                               Add-Ons Selected
//                             </h5>
//                             {booking?.addons && booking.addons.length > 0 ? (
//                               <div className="space-y-2">
//                                 {booking.addons.map(
//                                   (addon: Addon, idx: number) => (
//                                     <div
//                                       key={idx}
//                                       className="flex justify-between items-start"
//                                     >
//                                       <div>
//                                         <p className="text-sm font-medium text-gray-800">
//                                           {addon?.title ??
//                                             addon?.name ??
//                                             "Extra service"}
//                                         </p>
//                                         {(
//                                           addon as unknown as Record<
//                                             string,
//                                             unknown
//                                           >
//                                         )?.durationMinutes != null && (
//                                           <p className="text-xs text-gray-400">
//                                             {
//                                               (
//                                                 addon as unknown as Record<
//                                                   string,
//                                                   unknown
//                                                 >
//                                               ).durationMinutes as number
//                                             }{" "}
//                                             mins
//                                           </p>
//                                         )}
//                                       </div>
//                                       {addon?.price > 0 && (
//                                         <span className="text-sm font-semibold text-[#FF6B35]">
//                                           {formatPrice(addon.price)}
//                                         </span>
//                                       )}
//                                     </div>
//                                   ),
//                                 )}
//                               </div>
//                             ) : (
//                               <p className="text-xs text-gray-400">
//                                 No add-ons selected
//                               </p>
//                             )}
//                           </div>

//                           <div>
//                             <h5 className="font-semibold text-sm text-gray-800 mb-3">
//                               Service Location
//                             </h5>
//                             <div className="space-y-2">
//                               <div className="border border-[#FF6B35] rounded-lg px-3 py-2 flex items-center gap-2 bg-[#FFF5F1]">
//                                 <Home className="w-3.5 h-3.5 text-[#FF6B35]" />
//                                 <span className="text-xs font-medium text-[#FF6B35]">
//                                   {((booking as Record<string, unknown>)
//                                     ?.serviceLocation as string) ??
//                                     "At-home Groom"}
//                                 </span>
//                               </div>
//                               {((booking as Record<string, unknown>)
//                                 ?.addressLine as string) && (
//                                 <div className="flex items-start gap-2 pt-1">
//                                   <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
//                                   <div>
//                                     <p className="text-[10px] text-gray-400 mb-0.5">
//                                       Complete Address
//                                     </p>
//                                     <p className="text-xs text-gray-600">
//                                       {
//                                         (booking as Record<string, unknown>)
//                                           ?.addressLine as string
//                                       }
//                                     </p>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         {/* ── Column 3: Seller Card ── */}
//                         <div className="md:col-span-2 lg:col-span-1">
//                           <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center gap-2 h-[250px]">
//                             <p className="text-xs text-gray-500 self-start w-full mb-1">
//                               Seller
//                             </p>

//                             {/* Bigger avatar */}
//                             <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200 shrink-0">
//                               {groomer?.profileImage ? (
//                                 <img
//                                   src={groomer.profileImage as string}
//                                   alt={
//                                     (groomer?.fullName as string) ?? "Groomer"
//                                   }
//                                   className="w-full h-full object-cover"
//                                 />
//                               ) : (
//                                 <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-semibold">
//                                   {((groomer?.fullName as string) ?? "G")
//                                     .charAt(0)
//                                     .toUpperCase()}
//                                 </div>
//                               )}
//                             </div>

//                             {/* Name */}
//                             <p className="text-sm font-semibold text-gray-800 mt-1">
//                               {(groomer?.fullName as string) ?? "Not assigned"}
//                             </p>

//                             {/* Spacer pushes button to bottom */}
//                             <div className="flex-1" />

//                             {/* View Details button — tight to bottom */}
//                             <button
//                               onClick={() => setSellerModal(groomer ?? {})}
//                               className="w-full bg-[#FF6B35] cursor-pointer text-white text-xs font-medium py-2 px-4 rounded-lg hover:bg-[#e55a25] transition-colors"
//                             >
//                               View Details
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 {/* Show More / Show Less toggle */}
//                 <button
//                   onClick={() => toggleExpand(bookingId)}
//                   className="w-full py-2 text-center text-[10px] text-gray-400 hover:text-[#FF6B35] hover:bg-gray-50 transition-colors border-t border-gray-100 cursor-pointer flex items-center justify-center gap-1"
//                 >
//                   {isExpanded ? (
//                     <>
//                       <ChevronUp className="w-3 cursor-pointer h-3" />
//                       <span>Show Less</span>
//                     </>
//                   ) : (
//                     <>
//                       <ChevronDown className="w-3 cursor-pointer h-3" />
//                       <span>View Details</span>
//                     </>
//                   )}
//                 </button>
//               </motion.div>
//             );
//           })
//         )}
//       </div>

//       {/* ── Seller Details Modal ── */}
//       <AnimatePresence>
//         {sellerModal && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setSellerModal(null)}
//               className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
//             />

//             {/* Modal */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               transition={{ duration: 0.2 }}
//               className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
//             >
//               {/* Header */}
//               <div className="bg-[#FF6B35] px-5 py-4 flex items-center justify-between">
//                 <p className="text-white font-semibold text-sm">
//                   Seller Details
//                 </p>
//                 <button
//                   onClick={() => setSellerModal(null)}
//                   className="text-white/80 hover:text-white transition-colors"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>

//               {/* Body */}
//               <div className="p-5 flex flex-col items-center gap-4">
//                 {/* Avatar */}
//                 <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200">
//                   {(sellerModal?.profileImage as string) ? (
//                     <img
//                       src={sellerModal.profileImage as string}
//                       alt={(sellerModal?.fullName as string) ?? "Groomer"}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-semibold">
//                       {((sellerModal?.fullName as string) ?? "G")
//                         .charAt(0)
//                         .toUpperCase()}
//                     </div>
//                   )}
//                 </div>

//                 {/* Name + role */}
//                 <div className="text-center">
//                   <p className="text-base font-bold text-gray-800">
//                     {(sellerModal?.fullName as string) ?? "Not assigned"}
//                   </p>
//                   {(sellerModal?.role as string) && (
//                     <p className="text-xs text-gray-400 mt-0.5">
//                       {sellerModal.role as string}
//                     </p>
//                   )}
//                 </div>

//                 {/* Dynamic info list */}
//                 <div className="w-full divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
//                   {(sellerModal?.email as string) && (
//                     <div className="flex items-center gap-3 px-4 py-3">
//                       <Mail className="w-4 h-4 text-[#FF6B35] shrink-0" />
//                       <div>
//                         <p className="text-[10px] text-gray-400">Email</p>
//                         <p className="text-xs font-medium text-gray-700">
//                           {sellerModal.email as string}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                   {(sellerModal?.phone as string) && (
//                     <div className="flex items-center gap-3 px-4 py-3">
//                       <Phone className="w-4 h-4 text-[#FF6B35] shrink-0" />
//                       <div>
//                         <p className="text-[10px] text-gray-400">Phone</p>
//                         <p className="text-xs font-medium text-gray-700">
//                           {sellerModal.phone as string}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                   {(sellerModal?.city as string) && (
//                     <div className="flex items-center gap-3 px-4 py-3">
//                       <MapPin className="w-4 h-4 text-[#FF6B35] shrink-0" />
//                       <div>
//                         <p className="text-[10px] text-gray-400">City</p>
//                         <p className="text-xs font-medium text-gray-700">
//                           {sellerModal.city as string}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                   {(sellerModal?.rating as number) != null && (
//                     <div className="flex items-center gap-3 px-4 py-3">
//                       <Star className="w-4 h-4 text-[#FF6B35] shrink-0" />
//                       <div>
//                         <p className="text-[10px] text-gray-400">Rating</p>
//                         <p className="text-xs font-medium text-gray-700">
//                           ⭐ {sellerModal.rating as number}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                   {(sellerModal?.totalBookings as number) != null && (
//                     <div className="flex items-center gap-3 px-4 py-3">
//                       <Package className="w-4 h-4 text-[#FF6B35] shrink-0" />
//                       <div>
//                         <p className="text-[10px] text-gray-400">
//                           Total Bookings
//                         </p>
//                         <p className="text-xs font-medium text-gray-700">
//                           {sellerModal.totalBookings as number}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                   {!sellerModal?.email &&
//                     !sellerModal?.phone &&
//                     !sellerModal?.city &&
//                     !sellerModal?.rating &&
//                     !sellerModal?.totalBookings && (
//                       <div className="px-4 py-6 text-center text-xs text-gray-400">
//                         No additional details available
//                       </div>
//                     )}
//                 </div>

//                 <button
//                   onClick={() => setSellerModal(null)}
//                   className="w-full border border-gray-200 text-gray-600 text-xs font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };
