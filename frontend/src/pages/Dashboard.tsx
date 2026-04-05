import { useState } from "react";

function Dashboard() {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Welcome back !
      </h1>

      {active === "dashboard" && (
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Internships</p>
            <h2 className="text-2xl font-bold text-purple-600 mt-2">120</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Applications</p>
            <h2 className="text-2xl font-bold text-purple-600 mt-2">8</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Saved</p>
            <h2 className="text-2xl font-bold text-purple-600 mt-2">15</h2>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;