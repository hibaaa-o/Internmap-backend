import { useEffect, useState } from "react";

type Application = {
  id: number;
  internship_id: number;
  status: string;
};

type Internship = {
  id: number;
  title: string;
  company: string;
  location?: string;
};

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const [appRes, intRes] = await Promise.all([
          fetch("http://localhost:5000/applications", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://localhost:5000/internships"),
        ]);

        const appData = await appRes.json();
        const intData = await intRes.json();

        if (appRes.ok) {
          setApplications(appData);
        }

        if (intRes.ok) {
          setInternships(intData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getInternship = (id: number) => {
    return internships.find((i) => i.id === id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-500">No applications yet</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const internship = getInternship(app.internship_id);

            return (
              <div key={app.id} className="bg-white p-5 rounded-xl shadow">
                <h2 className="font-semibold text-lg">
                  {internship?.title || "Unknown Internship"}
                </h2>

                <p className="text-gray-600">
                  {internship?.company || "Unknown Company"}
                </p>

                <p className="text-sm text-gray-500">
                  {internship?.location || ""}
                </p>

                <p className="mt-2 text-sm">
                  Status: <span className="font-semibold">{app.status}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}