import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Bell,
  Menu,
  LogOut,
  ImagePlus,
  CheckCircle,
  Info,
  BellOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import userIcon from "@/assets/icons/user.svg";
import { useDispatch } from "react-redux";
import { logOut } from "@/redux/features/auth/authSlice";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/redux/features/notification/notificationApi";
import type { Notification } from "@/redux/features/notification/notificationTypes";

export interface NavbarProps {
  onMobileMenuToggle: () => void;
  userName?: string;
  isSidebarOpen: boolean;
}

const POLLING_INTERVAL = 30000;
const PAGE_LIMIT = 20;

const getTimeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "BOOKING_ACCEPTED":
    case "BOOKING_COMPLETED":
    case "PAYMENT_SUCCESS":
    case "GROOMER_APPROVED":
      return <CheckCircle size={14} />;
    default:
      return <Info size={14} />;
  }
};

const openImageDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("AdminDashboardDB", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveImageToDB = async (key: string, value: string): Promise<void> => {
  try {
    const db = await openImageDB();
    const tx = db.transaction("settings", "readwrite");
    const store = tx.objectStore("settings");
    store.put(value, key);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error("IndexedDB Save Error:", err);
  }
};

const getImageFromDB = async (key: string): Promise<string | null> => {
  try {
    const db = await openImageDB();
    const tx = db.transaction("settings", "readonly");
    const store = tx.objectStore("settings");
    const request = store.get(key);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("IndexedDB Get Error:", err);
    return null;
  }
};
// -------------------------

const AdminDashboardNavBar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,
  userName = "Admin",
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [profilePic, setProfilePic] = useState<string>(userIcon);
  const [optimisticReadIds, setOptimisticReadIds] = useState<Set<string>>(
    new Set(),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [markAllRead, { isLoading: isMarkingAll }] =
    useMarkAllNotificationsReadMutation();
  const [markRead] = useMarkNotificationReadMutation();

  useEffect(() => {
    const loadSavedPic = async () => {
      const savedPic = await getImageFromDB("adminProfilePic");
      if (savedPic) {
        setProfilePic(savedPic);
      } else {
        const legacySaved = localStorage.getItem("adminProfilePic");
        if (legacySaved) {
          setProfilePic(legacySaved);
          await saveImageToDB("adminProfilePic", legacySaved);
        }
      }
    };
    loadSavedPic();
  }, []);

  const {
    data: page1Data,
    isLoading,
    isFetching: isFetchingPage1,
  } = useGetNotificationsQuery(
    { page: 1, limit: PAGE_LIMIT, sortBy: "createdAt", sortOrder: "desc" },
    {
      pollingInterval: POLLING_INTERVAL,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );

  const { data: extraPageData, isFetching: isFetchingExtra } =
    useGetNotificationsQuery(
      {
        page: currentPage,
        limit: PAGE_LIMIT,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      {
        skip: currentPage === 1,
        refetchOnMountOrArgChange: false,
        refetchOnFocus: false,
      },
    );

  useEffect(() => {
    if (page1Data?.data?.items) {
      const items = page1Data.data.items;
      const meta = page1Data.data.meta;

      setAllNotifications((prev) => {
        const restPages = prev.slice(PAGE_LIMIT);
        const merged = [...items, ...restPages];
        const seen = new Set<string>();
        return merged.filter((n) => {
          if (seen.has(n.id)) return false;
          seen.add(n.id);
          return true;
        });
      });

      setHasMore(meta.page < meta.totalPages);

      setOptimisticReadIds((prev) => {
        if (prev.size === 0) return prev;
        const next = new Set(prev);
        items.forEach((n: Notification) => {
          if (n.readAt !== null) next.delete(n.id);
        });
        return next;
      });
    }
  }, [page1Data]);

  useEffect(() => {
    if (extraPageData?.data?.items && currentPage > 1) {
      const items = extraPageData.data.items;
      const meta = extraPageData.data.meta;

      setAllNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const unique = items.filter(
          (n: Notification) => !existingIds.has(n.id),
        );
        return [...prev, ...unique];
      });

      setHasMore(meta.page < meta.totalPages);
    }
  }, [extraPageData, currentPage]);

  useEffect(() => {
    if (!isDropdownOpen) {
      setCurrentPage(1);
    }
  }, [isDropdownOpen]);

  const displayNotifications = allNotifications.map((notif) => {
    if (optimisticReadIds.has(notif.id)) {
      return { ...notif, readAt: notif.readAt ?? new Date().toISOString() };
    }
    return notif;
  });

  const unreadCount = displayNotifications.filter(
    (n) => n.readAt === null,
  ).length;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (
      !el ||
      isFetchingExtra ||
      !hasMore ||
      currentPage >= (page1Data?.data?.meta?.totalPages ?? 1)
    )
      return;

    const nearBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 60;
    if (nearBottom) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [isFetchingExtra, hasMore, currentPage, page1Data]);

  const handleSignOut = () => dispatch(logOut());

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const allIds = displayNotifications
      .filter((n) => n.readAt === null)
      .map((n) => n.id);
    setOptimisticReadIds(new Set(allIds));

    try {
      await markAllRead().unwrap();
      setAllNotifications((prev) =>
        prev.map((n) =>
          n.readAt === null ? { ...n, readAt: new Date().toISOString() } : n,
        ),
      );
      setOptimisticReadIds(new Set());
    } catch (err) {
      setOptimisticReadIds(new Set());
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleMarkOneRead = async (notification: Notification, e: Event) => {
    if (notification.readAt !== null) return;
    e.preventDefault();
    e.stopPropagation();

    setOptimisticReadIds((prev) => {
      const next = new Set(prev);
      next.add(notification.id);
      return next;
    });

    try {
      await markRead(notification.id).unwrap();
      setAllNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id
            ? { ...n, readAt: new Date().toISOString() }
            : n,
        ),
      );
      setOptimisticReadIds((prev) => {
        const next = new Set(prev);
        next.delete(notification.id);
        return next;
      });
    } catch (err) {
      setOptimisticReadIds((prev) => {
        const next = new Set(prev);
        next.delete(notification.id);
        return next;
      });
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setProfilePic(base64);
      localStorage.setItem("adminProfilePic", base64);
      await saveImageToDB("adminProfilePic", base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white border-b border-[#F3F4F6]">
      <header className="flex items-center justify-between h-16 sm:h-18 md:h-20 px-3 sm:px-5 md:px-10 transition-all duration-300 w-full">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-black cursor-pointer w-8 h-8 sm:w-9 sm:h-9"
            onClick={onMobileMenuToggle}
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6 mr-5 sm:mr-10 md:mr-2 lg:mr-[72px]">
          <DropdownMenu onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <div className="p-2 sm:p-2.5 md:p-3 bg-[#FF6B35] rounded-lg sm:rounded-xl text-white relative cursor-pointer shadow-sm active:scale-95 transition-transform outline-none">
                <Bell
                  size={16}
                  className={`sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 transition-opacity ${
                    isFetchingPage1 ? "opacity-60" : "opacity-100"
                  }`}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full border-2 border-white shadow-sm">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-72 md:w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 mt-2 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-[#FF6B35]/10 text-[#FF6B35] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    disabled={isMarkingAll}
                    className="text-[11px] text-[#FF6B35] hover:underline font-semibold disabled:opacity-50 cursor-pointer"
                  >
                    {isMarkingAll ? "Marking..." : "Mark all read"}
                  </button>
                )}
              </div>

              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="max-h-[380px] overflow-y-auto scroll-smooth
                  [&::-webkit-scrollbar]:w-1.5
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:bg-gray-200
                  [&::-webkit-scrollbar-thumb]:rounded-full
                  hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : displayNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                    <BellOff size={28} />
                    <span className="text-sm">No notifications</span>
                  </div>
                ) : (
                  <>
                    {displayNotifications.map((notif) => (
                      <DropdownMenuItem
                        key={notif.id}
                        onSelect={(e) => handleMarkOneRead(notif, e)}
                        className={`flex flex-col items-start gap-1 px-4 py-3 rounded-xl cursor-pointer transition-colors focus:bg-[#FF6B35]/5 border-none outline-none mb-1 ${
                          notif.readAt === null
                            ? "bg-[#FF6B35]/5 hover:bg-[#FF6B35]/10"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-[#FF6B35] shrink-0">
                            {getNotificationIcon(notif.type)}
                          </span>
                          <span className="text-[13px] font-semibold text-gray-800 flex-1 leading-snug">
                            {notif.title}
                          </span>
                          {notif.readAt === null && (
                            <span className="w-2 h-2 rounded-full bg-[#FF6B35] shrink-0" />
                          )}
                        </div>
                        <p className="text-[12px] text-gray-500 pl-6 leading-snug line-clamp-2">
                          {notif.body}
                        </p>
                        <span className="text-[10px] text-gray-400 pl-6 mt-0.5">
                          {getTimeAgo(notif.createdAt)}
                        </span>
                      </DropdownMenuItem>
                    ))}

                    {isFetchingExtra && (
                      <div className="flex items-center justify-center py-4 text-gray-400 gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        <span className="text-xs">Loading more...</span>
                      </div>
                    )}

                    {!hasMore && displayNotifications.length > 0 && (
                      <p className="text-center text-[11px] text-gray-300 py-3">
                        You're all caught up!
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="p-2 border-t border-gray-50">
                {isFetchingPage1 && !isLoading && (
                  <div className="flex items-center justify-center gap-1 pb-1">
                    <Loader2 size={10} className="animate-spin text-gray-300" />
                    <span className="text-[10px] text-gray-300">
                      Updating...
                    </span>
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-10 w-[1.5px] bg-gray-200 mx-1 hidden md:block" />

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative group cursor-pointer outline-none">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-50">
                    <img
                      src={profilePic}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="bg-[#FF6B35] text-white w-56 shadow-2xl rounded-2xl border border-white/20 p-2 mt-2"
              >
                <DropdownMenuItem
                  onSelect={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border-none hover:bg-white hover:text-[#FF6B35] transition-all cursor-pointer mb-1"
                >
                  <ImagePlus size={18} />
                  <span className="font-medium">Set your picture</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/10 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                >
                  <LogOut size={18} />
                  <span className="font-bold">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="block text-left">
              <p className="font-semibold text-[12px] sm:text-[13px] md:text-[15px] text-[#FF6B35] leading-none mb-1">
                {userName}
              </p>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 font-medium leading-none">
                admin@platform.com
              </p>
            </div>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </header>
    </div>
  );
};

export default AdminDashboardNavBar;
