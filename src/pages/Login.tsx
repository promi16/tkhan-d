import loginphoto from "@/assets/photo/signup.svg";
import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import {
  useCurrentUser,
  useIsAuthenticated,
} from "@/redux/features/auth/authSlice";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks/redux-hook";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface ApiErrorResponse {
  success?: boolean;
  statusCode?: number;
  path?: string;
  timestamp?: string;
  error?: {
    message: string;
    error?: string;
    statusCode?: number;
  };
  message?: string;
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    ("error" in data || "message" in data)
  );
}

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [loginMutation, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(useIsAuthenticated);
  const user = useAppSelector(useCurrentUser);

  useEffect(() => {
    if (isAuthenticated && user && user.role === "ADMIN") {
      navigate("/admin-dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const getErrorMessage = (error: unknown): string => {
    if (isFetchBaseQueryError(error)) {
      const data = error.data;
      if (isApiErrorResponse(data)) {
        if (data.error?.message) return data.error.message;
        if (data.message) return data.message;
      }
      if (typeof data === "string") return data;
      if (error.status === 401) return "Invalid email or password!";
      return "Server error. Please try again later.";
    }

    if (error && typeof error === "object" && "message" in error) {
      const serializedError = error as SerializedError;
      if (serializedError.message) return serializedError.message;
    }

    if (typeof error === "string") return error;

    return "An unexpected error occurred. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    try {
      const result = await loginMutation({ email, password }).unwrap();

      if (result.success && result.data) {
        if (result.data.user.role !== "ADMIN") {
          toast.error("Access denied! Admin privileges required.");
          return;
        }

        toast.success(`Welcome back, ${result.data.user.fullName || "Admin"}!`);
      } else {
        toast.error("Invalid email or password!");
      }
    } catch (error: unknown) {
      console.error("Login Error:", error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#FDFDFD] font-inter overflow-hidden p-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F26522]/5 rounded-sm blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F26522]/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] border border-white overflow-hidden">
        <div className="hidden md:flex w-1/2 relative bg-linear-to-br from-[#FFF5F2] to-[#FFE8E0] items-center justify-center p-16">
          <img
            src={loginphoto}
            alt="Karoo Admin"
            className="relative z-10 w-full max-w-sm drop-shadow-[0_20px_40px_rgba(242,101,34,0.2)]"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-0.5 bg-[#F26522]"></span>
              <span className="text-[#F26522] font-bold text-xs tracking-widest uppercase">
                Admin Access
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] leading-tight">
              Welcome Back to <span className="text-[#F26522]">Karoo</span>
            </h2>
          </div>

          <form className="space-y-7" onSubmit={handleSubmit}>
            <div className="group space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-[#F26522] transition-colors">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="w-full px-6 py-4 rounded-2xl bg-[#F8F9FB] border border-gray-100 placeholder-gray-300 text-gray-700 focus:bg-white focus:border-[#F26522] focus:ring-[6px] focus:ring-[#F26522]/5 outline-none transition-all duration-300 font-medium"
              />
            </div>

            <div className="group space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider group-focus-within:text-[#F26522] transition-colors">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-[#F8F9FB] border border-gray-100 placeholder-gray-300 text-gray-700 focus:bg-white focus:border-[#F26522] focus:ring-[6px] focus:ring-[#F26522]/5 outline-none transition-all duration-300 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-300 hover:text-[#F26522] transition-colors duration-200"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={22} />
                  ) : (
                    <AiOutlineEye size={22} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1A1A1A] hover:bg-[#F26522]"
              } text-white font-bold py-5 rounded-2xl transition-all duration-500 shadow-xl hover:shadow-[#F26522]/40 transform active:scale-[0.98] overflow-hidden`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In to Admin Panel
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </span>
              {!isLoading && (
                <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="absolute bottom-6 text-[10px] text-gray-300 font-bold tracking-widest uppercase">
        Karoo Admin Framework v4.0.2
      </div>
    </div>
  );
};

export default Login;
