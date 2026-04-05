import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MapPin, Clock, Trash2, Edit } from "lucide-react";

type Job = {
  id: number;
  title: string;
  location: string;
  type: string;
  date: string;
};

export default function CompanyDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 1,
      title: "Frontend Intern",
      location: "Riyadh",
      type: "Full-time",
      date: "2 days ago",
    },
    {
      id: 2,
      title: "UI/UX Intern",
      location: "Dammam",
      type: "Part-time",
      date: "5 days ago",
    },
  ]);

  const handleDelete = (id: number) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Company Dashboard 🏢
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your internships and applicants بسهولة
          </p>
        </div>

        {/* Add Button */}
        <button
          onClick={() => navigate("/add-internship")}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Internship
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Total Internships</p>
          <h2 className="text-2xl font-bold text-purple-600 mt-2">
            {jobs.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Applications</p>
          <h2 className="text-2xl font-bold text-purple-600 mt-2">
            24
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Active Jobs</p>
          <h2 className="text-2xl font-bold text-purple-600 mt-2">
            {jobs.length}
          </h2>
        </div>

      </div>

      {/* Jobs List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          >

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {job.title}
            </h3>

            {/* Company */}
            <p className="text-gray-600 mb-4">
              My Company
            </p>

            {/* Info */}
            <div className="space-y-2 text-sm text-gray-500 mb-4">

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-500" />
                {job.location}
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                {job.type}
              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t">

              <span className="text-xs text-gray-400">
                Posted {job.date}
              </span>

              <div className="flex gap-2">

                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>

                <button
                  onClick={() => handleDelete(job.id)}
                  className="p-2 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* Empty State */}
      {jobs.length === 0 && (
        <div className="text-center mt-20">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No internships yet
          </h2>
          <p className="text-gray-500">
            Start by adding your first internship 
          </p>
        </div>
      )}

    </div>
  );
}