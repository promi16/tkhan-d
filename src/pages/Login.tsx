import loginphoto from "@/assets/photo/signup.svg";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const isPasswordWeak = password.length > 0 && password.length < 8;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      return;
    }

    console.log("Login Success:", { email, password });
    navigate("/admin-dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#FDFDFD] font-inter overflow-hidden p-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F26522]/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F26522]/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] border border-white overflow-hidden">
        <div className="hidden md:flex w-1/2 relative bg-gradient-to-br from-[#FFF5F2] to-[#FFE8E0] items-center justify-center p-16">
          <img
            src={loginphoto}
            alt="Karoo Admin"
            className="relative z-10 w-full max-w-sm drop-shadow-[0_20px_40px_rgba(242,101,34,0.2)]"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-[2px] w-8 bg-[#F26522]"></span>
              <span className="text-[#F26522] font-bold text-xs tracking-widest uppercase">
                Secure Access
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A1A] leading-tight">
              Welcome Back to <span className="text-[#F26522]">Karoo</span>
            </h2>
            <p className="text-gray-400 mt-3 font-medium">
              Please enter your admin credentials
            </p>
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
                placeholder="name@karoo-admin.com"
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
                  className={`w-full px-6 py-4 rounded-2xl bg-[#F8F9FB] border ${
                    isPasswordWeak ? "border-red-400" : "border-gray-100"
                  } placeholder-gray-300 text-gray-700 focus:bg-white focus:border-[#F26522] focus:ring-[6px] focus:ring-[#F26522]/5 outline-none transition-all duration-300 font-medium`}
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

              {isPasswordWeak && (
                <p className="text-red-500 text-[11px] font-bold mt-1 ml-1 animate-pulse">
                  ⚠️ Password too weak! Minimum 8 characters required.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="group relative w-full bg-[#1A1A1A] hover:bg-[#F26522] text-white font-bold py-5 rounded-2xl transition-all duration-500 shadow-xl hover:shadow-[#F26522]/40 transform active:scale-[0.98] overflow-hidden"
            >
              <span className="relative cursor-pointer z-10 flex items-center justify-center gap-2">
                Sign In to Panel
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
              </span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
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
