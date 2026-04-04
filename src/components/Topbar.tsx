import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Map, Bell, User } from "lucide-react";
import { useState } from "react";

export default function Topbar() {
  const location = useLocation();

  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white shadow-sm relative">

      {/* Logo */}
      <Link to="/home" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center">
          <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold">InternMap</h1>
      </Link>

      {/* Center */}
      <div className="flex items-center gap-4">

        <Link
          to="/home"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            isActive("/home") ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Home className="w-5 h-5" />
          Home
        </Link>

        <Link
          to="/browse"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            isActive("/browse") ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          Browse
        </Link>

        <Link
          to="/map"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            isActive("/map") ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Map className="w-5 h-5" />
          Map View
        </Link>

      </div>

      {/* Right */}
      <div className="flex items-center gap-4 relative">

        {/* 🔔 Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotif(!showNotif);
              setShowProfile(false);
            }}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Bell className="w-5 h-5" />
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg p-4 z-50">
              <p className="text-sm font-semibold mb-2">Notifications</p>
              <p className="text-sm text-gray-600">No new notifications</p>
            </div>
          )}
        </div>

        {/* 👤 Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotif(false);
            }}
            className="p-2 rounded-xl border hover:bg-gray-100"
          >
            <User className="w-5 h-5" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50">

              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Dashboard
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
              >
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}