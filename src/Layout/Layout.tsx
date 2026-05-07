import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="bg-[#F9FAFB] min-h-screen w-full">
      <main className="bg-[#F9FAFB] min-h-screen text-black">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
