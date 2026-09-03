import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="bg-[#F9FAFB] h-full w-full overflow-hidden">
      <main className="bg-[#F9FAFB] h-full text-black">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
