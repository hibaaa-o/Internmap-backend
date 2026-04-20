import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin } from "lucide-react";


export default function CompanyLogin() {
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
        if (data.user.role !== "company") {
          alert("This account is not a company account");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/company-dashboard");
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
            onClick={() => navigate("/login")}
            className="w-full mb-5 border border-purple-600 text-purple-600 h-12 rounded-xl hover:bg-purple-50"
          >
            Switch to Student
          </button>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Company Email"
              className="w-full p-3 border rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            
<div className="text-right mb-4">
  <Link
    to="/forgot-password"
    className="text-sm text-purple-600 hover:text-purple-700"
  >
    Forgot Password?
  </Link>
</div>
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

      <div
  className="w-1/2 flex items-center justify-center text-white text-center"
  style={{
    backgroundImage: "linear-gradient(rgba(132, 63, 172, 0.42), rgba(117, 111, 220, 0.31)), url('/bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}
>
  <h1 
  className="text-3xl md:text-4xl font-bold text-white text-center"
  style={{ fontFamily: 'Poppins, sans-serif' }}
>
  Hire the Best Interns for Your Company!
</h1>
</div>
    </div>
  );
}