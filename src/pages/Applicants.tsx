import { useState } from "react";
import { FileText, Mail, User } from "lucide-react";

type Applicant = {
  id: number;
  name: string;
  email: string;
  cv: string;
  status: "new" | "accepted" | "rejected";
};

export default function Applicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: 1,
      name: "Ahmed Ali",
      email: "ahmed@gmail.com",
      cv: "https://example.com/cv1.pdf",
      status: "new",
    },
    {
      id: 2,
      name: "Sara Mohammed",
      email: "sara@gmail.com",
      cv: "https://example.com/cv2.pdf",
      status: "new",
    },
  ]);

  const handleStatus = (id: number, newStatus: "accepted" | "rejected") => {
    setApplicants((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: newStatus } : a
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Applicants 
        </h1>
        <p className="text-gray-600 mt-1">
          Review candidates who applied to your internships
        </p>
      </div>

      {/* Applicants List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {applicants.map((applicant) => (
          <div
            key={applicant.id}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          >

            {/* Name */}
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-purple-600" />
              <h2 className="font-semibold text-gray-900">
                {applicant.name}
              </h2>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
              <Mail className="w-4 h-4 text-purple-500" />
              {applicant.email}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4 border-t">

              {/* View CV */}
              <a
                href={applicant.cv}
                target="_blank"
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                <FileText className="w-4 h-4" />
                View CV
              </a>

              {/* Accept / Reject */}
              <div className="flex gap-2">

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

              {/* Status */}
              <span
                className={`text-xs px-3 py-1 rounded-full w-fit ${
                  applicant.status === "accepted"
                    ? "bg-green-100 text-green-600"
                    : applicant.status === "rejected"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {applicant.status === "accepted"
                  ? "Accepted"
                  : applicant.status === "rejected"
                  ? "Rejected"
                  : "New"}
              </span>

            </div>

          </div>
        ))}

      </div>

      {/* Empty State */}
      {applicants.length === 0 && (
        <div className="text-center mt-20">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No applicants yet
          </h2>
          <p className="text-gray-500">
            Applicants will appear here once they apply
          </p>
        </div>
      )}

    </div>
  );
}