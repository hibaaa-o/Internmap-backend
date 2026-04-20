import { useEffect, useState } from "react";
import { Mail, User, Briefcase, MapPin, Phone, FileText } from "lucide-react";

type Applicant = {
  id: number;
  user_id: number;
  internship_id: number;
  cover_letter: string | null;
  status: "pending" | "accepted" | "rejected";
  applied_at?: string;
  applicant_email?: string;
  applicant_name?: string;
  applicant_phone?: string;
  applicant_cv?: string;
  internship_title?: string;
  company_name?: string;
  internship_location?: string;
};

export default function Applicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:5000/applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setApplicants(data);
        } else {
          console.error(data.error || "Failed to load applicants");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const handleStatus = async (
    id: number,
    newStatus: "accepted" | "rejected"
  ) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        setApplicants((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: newStatus } : a
          )
        );
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "Recently";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return <p className="p-6 text-center">Loading applicants...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
        <p className="text-gray-600 mt-1">
          Review candidates who applied to your internships
        </p>
      </div>

      {applicants.length === 0 ? (
        <div className="text-center mt-20">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No applicants yet
          </h2>
          <p className="text-gray-500">
            Applicants will appear here once they apply
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {applicants.map((applicant) => (
            <div
              key={applicant.id}
              className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-purple-600" />
                <h2 className="font-semibold text-gray-900">
                  {applicant.applicant_name || `Candidate #${applicant.user_id}`}
                </h2>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-5">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-500" />
                  <span>{applicant.applicant_email || "No email"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-500" />
                  <span>{applicant.applicant_phone || "No phone"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  <span>{applicant.internship_title || "Unknown internship"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <span>{applicant.internship_location || "No location"}</span>
                </div>

                <div className="flex items-center gap-2">
                 <FileText className="w-4 h-4 text-purple-500" />
                 {applicant.applicant_cv ? (
                 <a
                 href={`http://127.0.0.1:5000/uploads/${applicant.applicant_cv}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs hover:bg-purple-200"
               >
                  View CV
             </a>
                  ) : (
                <span>No CV uploaded</span>
                )}
                 </div>
              </div>

              <div className="mb-5">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Cover Letter
                </p>
                <p className="text-sm text-gray-600 leading-6 bg-gray-50 rounded-xl p-3">
                  {applicant.cover_letter || "No cover letter"}
                </p>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => handleStatus(applicant.id, "accepted")}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleStatus(applicant.id, "rejected")}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm"
                >
                  Reject
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    applicant.status === "accepted"
                      ? "bg-green-100 text-green-600"
                      : applicant.status === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {applicant.status}
                </span>

                <span className="text-xs text-gray-400">
                  {formatDate(applicant.applied_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}