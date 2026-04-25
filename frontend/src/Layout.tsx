import { Outlet, useLocation } from "react-router-dom";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import CompanySidebar from "./components/CompanySidebar";

export default function Layout() {
  const location = useLocation();


  const isDashboard =
    location.pathname.includes("dashboard") ||
    location.pathname.includes("applications") ||
    location.pathname.includes("add-internship") ||
    location.pathname.includes("applicants") ||
    location.pathname.includes("profile"); // ⭐ الإضافة الوحيدة

  
  const isCompany =
    location.pathname.includes("company-dashboard") ||
    location.pathname.includes("add-internship") ||
    location.pathname.includes("applicants");

  return (
    <div className="min-h-screen flex flex-col">

      {/*  التوب بار يختفي في الداش + البروفايل */}
      {!isDashboard && <Topbar />}

      <div className="flex flex-1">

        
        {isDashboard && (
          isCompany ? <CompanySidebar /> : <Sidebar />
        )}

        <div className="flex-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
}