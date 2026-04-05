import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CompanySignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // تسجيل وهمي
    localStorage.setItem("user", "company");

    navigate("/"); // يرجع للهوم
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center">
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold">InternMap</h1>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-center">
          Create Company Account 
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Company Name"
            className="w-full p-3 border rounded-lg"
            value={form.companyName}
            onChange={(e) =>
              setForm({ ...form, companyName: e.target.value })
            }
            required
          />

          <input
            type="tel"
            placeholder="Saudi Phone (05xxxxxxxx)"
            className="w-full p-3 border rounded-lg"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Company Email"
            className="w-full p-3 border rounded-lg"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-lg"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            required
          />

          <button className="w-full bg-purple-600 text-white py-3 rounded-lg">
            Create Account
          </button>

        </form>

        {/* رجوع */}
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/company-login")}
            className="text-purple-600 cursor-pointer"
          >
            Sign In
          </span>
        </p>

      </div>
    </div>
  );
}