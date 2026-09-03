import AdminDashboardNavBar from "@/components/AdminDashboard/Shared/AdminDashboardNavBar";
import AdminSidebar from "@/components/AdminDashboard/Shared/AdminSidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { pathname } = useLocation();

  const shouldHideNavbar = pathname === "/client-dashboard/invoice-form";

  const shouldHideSidebar = () => {
    const hideExact = ["/client-dashboard/add-product"];
    const pathnameSegments = pathname.split("/");

    const isProductDetails =
      pathname.startsWith("/client-dashboard/all-products/") &&
      pathnameSegments.length === 4;

    const isOrderDetails =
      pathname.startsWith("/client-dashboard/all-orders/") &&
      pathnameSegments.length === 4;

    const isBuyerProfile =
      pathname.startsWith("/client-dashboard/all-orders/") &&
      pathnameSegments.length === 5 &&
      pathname.endsWith("/buyer-profile");

    return (
      hideExact.includes(pathname) ||
      isProductDetails ||
      isOrderDetails ||
      isBuyerProfile
    );
  };

  useEffect(() => {
    const pathnameSegments = pathname.split("/");

    const isDetailView =
      (pathname.startsWith("/client-dashboard/all-products/") &&
        pathnameSegments.length === 4) ||
      (pathname.startsWith("/client-dashboard/all-orders/") &&
        pathnameSegments.length === 4) ||
      (pathname.startsWith("/client-dashboard/all-orders/") &&
        pathnameSegments.length === 5 &&
        pathname.endsWith("/buyer-profile"));

    const isAddProduct = pathname === "/client-dashboard/add-product";
    const isAllProduct = pathname === "/client-dashboard/all-products";
    const isAllOrder = pathname === "/client-dashboard/all-orders";
    const isInquiries = pathname === "/client-dashboard/inquiries-details";
    const isInvoice = pathname === "/client-dashboard/invoice-form";

    setIsSidebarOpen(
      isDetailView ||
        isAddProduct ||
        isAllProduct ||
        isAllOrder ||
        isInquiries ||
        isInvoice,
    );
  }, [pathname]);

  return (
    <div className="flex h-full overflow-hidden bg-[#F9FAFB]">
      {/* ✅ Sidebar — full height, fixed, scrollable internally */}
      {!shouldHideSidebar() && (
        <div className="hidden lg:flex w-[280px] flex-col fixed top-0 left-0 z-30 h-full">
          <AdminSidebar />
        </div>
      )}

      {/* ✅ Right side — navbar + main content */}
      <div
        className={`flex flex-col flex-1 h-full min-h-0 overflow-hidden ${
          !shouldHideSidebar() ? "lg:ml-[280px]" : ""
        }`}
      >
        {/* ✅ Navbar — notificationCount সরানো হয়েছে */}
        {!shouldHideNavbar && (
          <div className="fixed top-0 left-0 lg:left-[280px] right-0 z-50 bg-white border-b border-gray-100">
            <AdminDashboardNavBar
              onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
        )}

        {/* Mobile sidebar sheet */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent
            side="left"
            className="w-[280px] p-0 bg-white border-none"
          >
            <AdminSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* ✅ Main content — scrollable, sidebar fixed থাকবে */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden [overflow-anchor:none] pt-[88px] md:pt-[112px] px-4 md:px-6 lg:px-8 pb-6 md:pb-8 text-black bg-[#F9FAFB]">
          <div className="max-w-[1800px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
