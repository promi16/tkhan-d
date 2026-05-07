import { useAppSelector } from "@/redux/hooks/redux-hook";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RoleBasedRedirect = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "client":
          navigate("/client/dashboard");
          break;
        case "distributor":
          navigate("/distributor/dashboard");
          break;
        case "accountant":
          navigate("/accountant/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, navigate]);

  return <div>Redirecting...</div>;
};

export default RoleBasedRedirect;
