import React, { useState, useRef } from "react";
import { Bell, Menu, LogOut, ImagePlus, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import userIcon from "@/assets/icons/user.svg";
import { useNavigate } from "react-router-dom";

export interface NavbarProps {
  onMobileMenuToggle: () => void;
  notificationCount?: number;
  userName?: string;
  isSidebarOpen: boolean;
}

const AdminDashboardNavBar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,
  notificationCount = 3,
  userName = "Admin",
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  const [notifications] = useState([
    {
      id: 1,
      text: "New seller approval request",
      timestamp: Date.now() - 2 * 60000,
      icon: <Info size={14} />,
    },
    {
      id: 2,
      text: "Payment processed successfully",
      timestamp: Date.now() - 60 * 60000,
      icon: <CheckCircle size={14} />,
    },
    {
      id: 3,
      text: "System update scheduled",
      timestamp: Date.now() - 300 * 60000,
      icon: <Info size={14} />,
    },
  ]);

  const [profilePic, setProfilePic] = useState(() => {
    return localStorage.getItem("adminProfilePic") || userIcon;
  });

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePic(base64String);
        localStorage.setItem("adminProfilePic", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white border-b border-[#F3F4F6]">
      <header className="flex items-center justify-between h-20 px-6 md:px-10 transition-all duration-300 w-full">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-black cursor-pointer"
            onClick={onMobileMenuToggle}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6 mr-0 md:mr-[72px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="p-2.5 md:p-3 bg-[#FF6B35] rounded-xl text-white relative cursor-pointer shadow-sm active:scale-95 transition-transform outline-none">
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-black rounded-full border-2 border-[#FF6B35]" />
                )}
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-72 md:w-80 bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 mt-2 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                <span className="font-bold text-gray-800">Notifications</span>
                <span className="text-[10px] bg-[#FF6B35]/10 text-[#FF6B35] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  New
                </span>
              </div>

              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notif) => (
                  <DropdownMenuItem
                    key={notif.id}
                    className="flex flex-col items-start gap-1 px-4 py-3 rounded-xl hover:bg-[#FF6B35]/5 cursor-pointer transition-colors focus:bg-[#FF6B35]/5 border-none outline-none mb-1"
                  >
                    <div className="flex items-center gap-2 text-[13px] font-medium text-gray-800">
                      <span className="text-[#FF6B35]">{notif.icon}</span>
                      {notif.text}
                    </div>
                    <span className="text-[10px] text-gray-400 pl-6">
                      {getTimeAgo(notif.timestamp)}
                    </span>
                  </DropdownMenuItem>
                ))}
              </div>

              <div className="p-2 border-t border-gray-50">
                <button className="w-full text-center py-2 text-[12px] font-bold text-[#FF6B35] hover:underline cursor-pointer">
                  View All Notifications
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-10 w-[1.5px] bg-gray-200 mx-1 hidden md:block" />

          <div className="flex items-center gap-3 md:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative group cursor-pointer outline-none ring-offset-2 focus:ring-0">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-50">
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
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border-none hover:bg-white hover:text-[#FF6B35] transition-all cursor-pointer mb-1"
                >
                  <ImagePlus size={18} />
                  <span className="font-medium">Set your picture</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/10 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                >
                  <LogOut size={18} />
                  <span className="font-bold">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="block text-left">
              <p className="font-semibold text-[14px] md:text-[15px] text-[#FF6B35] leading-none mb-1">
                {userName}
              </p>
              <p className="text-[10px] md:text-xs text-gray-400 font-medium leading-none">
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
