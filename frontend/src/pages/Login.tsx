import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import bgImage from "../assets/office.jpg";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
              <MapPin className="text-white" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              InternMap
            </h1>
          </div>

          <button
            onClick={() => navigate("/company-login")}
            className="w-full mb-5 border border-purple-600 text-purple-600 h-12 rounded-xl hover:bg-purple-50 transition"
          >
            Switch to Company
          </button>

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
            <div className="text-right mt-2 mb-4">
  <Link
    to="/forgot-password"
    className="text-sm text-purple-600 hover:underline"
  >
    Forgot Password?
  </Link>
</div>

            <button className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-lg hover:opacity-90 transition">
              Sign In
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <button
  onClick={() => {
    window.location.href = "http://localhost:5000/auth/google";
  }}
  className="w-full h-12 border rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50"
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    className="w-5 h-5"
    alt="Google"
  />
  Continue with Google
</button>

          </div>

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

      <div
  className="w-1/2 relative flex items-center justify-center"
  style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* اللون البنفسجي */}
  <div className="absolute inset-0 bg-gradient-to-r from-purple-800/40 to-purple-500/20"></div>

  {/* النص */}
  <h1
    className="relative text-3xl md:text-4xl font-bold text-white text-center px-6"
    style={{ fontFamily: "Poppins, sans-serif" }}
  >
    Discover Your Future!
  </h1>
</div>
    </div>
  );
}