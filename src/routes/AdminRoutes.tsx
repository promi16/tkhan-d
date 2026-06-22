import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReactNode } from "react";
import { AppRootState } from "@/redux/store";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

type AdminRouteProps = {
  children: ReactNode;
};

const AdminRoute = ({ children }: AdminRouteProps) => {
  const user = useSelector(
    (state: AppRootState) => state.auth.user,
  ) as User | null;

  console.log("Admin Data:", user);

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
