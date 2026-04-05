import { Link } from "react-router-dom";

export function HomeTopbar() {
  const isLoggedIn = localStorage.getItem("user");

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center shadow-md">
          <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold">InternMap</h1>
      </Link>

      {/* Right Side */}
      {!isLoggedIn ? (
        // 👈 قبل تسجيل الدخول
        <Link
          to="/login"
          className="px-5 py-2 bg-purple-600 text-white rounded-lg"
        >
          Sign In
        </Link>
      ) : (
        // 👈 بعد تسجيل الدخول
        <div className="flex items-center gap-6">
          <Link to="/browse" className="hover:text-purple-600">
            Browse
          </Link>

          <Link to="/map" className="hover:text-purple-600">
            Map View
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            className="text-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}