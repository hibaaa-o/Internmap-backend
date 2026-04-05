import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

export default function CompanyLogin() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("user", "company");
    navigate("/company-dashboard");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
              <MapPin className="text-white" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              InternMap
            </h1>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full mb-5 border border-purple-600 text-purple-600 h-12 rounded-xl hover:bg-purple-50"
          >
            Switch to Student
          </button>

          <form onSubmit={handleLogin} className="space-y-5">

            <input
              placeholder="Company Email"
              className="w-full p-3 border rounded-xl"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-xl"
            />

            <button className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-lg">
              Sign In
            </button>

          </form>

          <p className="text-center mt-6 text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/company-signup")}
              className="text-purple-600 cursor-pointer"
            >
              Create account
            </span>
          </p>

        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 to-purple-900 items-center justify-center text-white">
        <h2 className="text-4xl font-bold">
          Hire the Best Talent !
        </h2>
      </div>

    </div>
  );
}