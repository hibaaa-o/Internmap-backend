import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("user", "student");
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* LEFT */}
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

          {/* Switch */}
          <button
            onClick={() => navigate("/company-login")}
            className="w-full mb-5 border border-purple-600 text-purple-600 h-12 rounded-xl hover:bg-purple-50 transition"
          >
            Switch to Company
          </button>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-lg hover:opacity-90 transition">
              Sign In
            </button>

          </form>

          {/* Social */}
          <div className="mt-6 space-y-3">

            <button className="w-full h-12 border rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5"/>
              Continue with Google
            </button>

            <button className="w-full h-12 border rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5"/>
              Continue with Facebook
            </button>

          </div>

          {/* Create */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-purple-600 font-medium cursor-pointer"
            >
              Create account
            </span>
          </p>

        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 items-center justify-center text-white">
        <h2 className="text-4xl font-bold">
          Discover Your Future !
        </h2>
      </div>

    </div>
  );
}                                         