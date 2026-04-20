import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  LogOut,
} from "lucide-react";

export default function CompanySidebar() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive
        ? "bg-purple-100 text-purple-600 font-medium"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col justify-between p-5">

      {/* Top */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center">
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold">InternMap</h1>
        </div>

        {/* Links */}
        <div className="space-y-2">

          {/* Dashboard */}
          <NavLink to="/company-dashboard" className={linkClass}>
            <LayoutGrid className="w-5 h-5" />
            Dashboard
          </NavLink>

          {/* Applicants ✅ */}
          <NavLink to="/applicants" className={linkClass}>
            <Users className="w-5 h-5" />
            Applicants
          </NavLink>

        </div>
      </div>

      {/* Bottom */}
      <div className="space-y-2">

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/company-login");
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

      </div>
    </div>
  );
}