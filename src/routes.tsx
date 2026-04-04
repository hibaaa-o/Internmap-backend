import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import CompanyLogin from "./pages/CompanyLogin";
import Signup from "./pages/Signup";
import CompanySignup from "./pages/CompanySignup";
import Dashboard from "./pages/Dashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import Browse from "./pages/Browse";
import MapView from "./pages/MapView";
import Layout from "./Layout";


import AddInternship from "./pages/AddInternship";
import Applicants from "./pages/Applicants";


import Profile from "./pages/Profile";

export const router = createBrowserRouter([
  //  أول صفحة (الافتراضية)
  {
    path: "/",
    element: <Login />,
  },

  // صفحات بدون Layout
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/company-login",
    element: <CompanyLogin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/company-signup",
    element: <CompanySignup />,
  },

  // صفحات بعد تسجيل الدخول
  {
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/company-dashboard",
        element: <CompanyDashboard />,
      },
      {
        path: "/browse",
        element: <Browse />,
      },
      {
        path: "/map",
        element: <MapView />,
      },

     
      {
        path: "/applications",
        element: <div className="p-6">My Applications Page</div>,
      },
      {
        path: "/saved",
        element: <div className="p-6">Saved Internships Page</div>,
      },

      //  Add Internship
      {
        path: "/add-internship",
        element: <AddInternship />,
      },

      //  Applicants
      {
        path: "/applicants",
        element: <Applicants />,
      },

      // (Profile)
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);