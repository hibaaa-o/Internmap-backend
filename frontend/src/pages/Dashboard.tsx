import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Application = {
  id: number;
  internship_id: number;
  status: string;
  applied_at?: string;
};

type Internship = {
  id: number;
  title: string;
  company: string;
  location?: string;
};

type User = {
  id: number;
  email: string;
  role: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  const user: User | null = (() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  })();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [appRes, internshipRes] = await Promise.all([
          fetch("http://localhost:5000/applications", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:5000/internships"),
        ]);

        const appData = await appRes.json();
        const internshipData = await internshipRes.json();

        if (appRes.ok) {
          setApplications(appData);
        } else {
          console.error(appData.error || "Failed to load applications");
        }

        if (internshipRes.ok) {
          setInternships(internshipData);
        } else {
          console.error("Failed to load internships");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const pendingCount = applications.filter(
    (app) => app.status === "pending"
  ).length;

  const acceptedCount = applications.filter(
    (app) => app.status === "accepted"
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status === "rejected"
  ).length;

  const getInternshipTitle = (internshipId: number) => {
    const internship = internships.find((item) => item.id === internshipId);
    return internship ? internship.title : `Internship #${internshipId}`;
  };

  const getInternshipCompany = (internshipId: number) => {
    const internship = internships.find((item) => item.id === internshipId);
    return internship ? internship.company : "Unknown Company";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Dashboard
      </h1>

      <p className="text-gray-600 mb-8">
        Welcome{user?.email ? `, ${user.email}` : ""} 👋
      </p>

      {loading ? (
        <p className="text-gray-600">Loading dashboard...</p>
      ) : (
        <>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Total Applications
              </h2>
              <p className="text-3xl font-bold text-purple-600">
                {applications.length}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Pending
              </h2>
              <p className="text-3xl font-bold text-yellow-500">
                {pendingCount}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Accepted
              </h2>
              <p className="text-3xl font-bold text-green-600">
                {acceptedCount}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Rejected
              </h2>
              <p className="text-3xl font-bold text-red-600">
                {rejectedCount}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Recent Applications
            </h2>

            {applications.length === 0 ? (
              <p className="text-gray-500">No applications yet.</p>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className="border rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {getInternshipTitle(app.internship_id)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Company: {getInternshipCompany(app.internship_id)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {app.status}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        app.status === "accepted"
                          ? "bg-green-100 text-green-600"
                          : app.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}