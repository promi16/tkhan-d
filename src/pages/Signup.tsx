import signupphoto from "@/assets/photo/signup.svg";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Signup = () => {
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  return (
    <div className="h-full flex items-center justify-center text-white">
      <div className="max-w-5xl w-full   flex overflow-hidden">
        <div className="hidden md:flex w-1/2  items-center justify-center">
          <img
            src={signupphoto}
            className="h-full w-full object-cover rounded-l-xl rounded-r-xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans mb-2">
            CREATE YOUR ACCOUNT
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            Sign up to get started and access your dashboard and features.
          </p>

          <form className="space-y-4">
            <div className="flex flex-col mb-4">
              <label htmlFor="name" className="text-white font-sans mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-[20px] bg-[#0F2B2E] text-white focus:ring-2 focus:ring-sky-300 outline-none"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="number" className="text-white font-sans mb-2">
                Phone Number
              </label>

              <div className="flex items-center space-x-2">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-[20px] bg-[#0F2B2E] text-white focus:ring-2 focus:ring-sky-300 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="email" className="text-white font-sans mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-[20px] bg-[#0F2B2E] text-white focus:ring-2 focus:ring-sky-300 outline-none"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="password" className="text-white font-sans mb-2">
                Password
              </label>

              <div className="relative w-full">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-[20px] bg-[#0F2B2E] text-white placeholder-gray-400 
                       focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none 
                       transition-all duration-300 shadow-sm hover:shadow-md"
                />

                {password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 
                         hover:text-white transition-colors duration-200 focus:outline-none cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={22} />
                    ) : (
                      <AiOutlineEye size={22} />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col mb-4">
              <label
                htmlFor="retypePassword"
                className="text-white font-sans mb-2"
              >
                Re-type Password
              </label>
              <div className="relative w-full">
                <input
                  id="retypePassword"
                  type={showRetypePassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={retypePassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-[20px] bg-[#0F2B2E] text-white placeholder-gray-400 
                       focus:ring-2 focus:ring-sky-300 focus:border-sky-300 outline-none 
                       transition-all duration-300 shadow-sm hover:shadow-md"
                />

                {retypePassword && (
                  <button
                    type="button"
                    onClick={() => setShowRetypePassword(!showRetypePassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 
                         hover:text-white transition-colors duration-200 focus:outline-none cursor-pointer"
                    aria-label={
                      showRetypePassword
                        ? "Hide retype password"
                        : "Show retype password"
                    }
                  >
                    {showRetypePassword ? (
                      <AiOutlineEyeInvisible size={22} />
                    ) : (
                      <AiOutlineEye size={22} />
                    )}
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#346778] text-white hover:bg-[#114050] font-sans py-3 rounded-[20px] transition cursor-pointer"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-gray-400 mt-4 text-center">
            Already have an account?
            <a href="/login" className="text-blue-400 hover:text-sky-300 ml-1">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
