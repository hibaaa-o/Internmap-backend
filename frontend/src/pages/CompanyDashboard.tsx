import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MapPin, Briefcase, Trash2, ChevronDown, ChevronUp } from "lucide-react";

type Job = {
  id: number;
  title: string;
  company: string;
  location?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  requirements?: string;
  working_hours?: string;
  experience_level?: string;
  internship_type?: string;
  skills?: string;
};

type Application = {
  id: number;
  internship_id: number;
  status: string;
};

export default function CompanyDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);

  const formatDate = (date?: string) => {
    if (!date) return "Recently";

    const d = new Date(date);

    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/company-login");
        return;
      }

      try {
        const [jobsRes, appsRes] = await Promise.all([
          fetch("http://localhost:5000/internships"),
          fetch("http://localhost:5000/applications", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const jobsData = await jobsRes.json();
        const appsData = await appsRes.json();

        if (jobsRes.ok) {
          setJobs(jobsData);
        }

        if (appsRes.ok) {
          setApplications(appsData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");

    const confirmDelete = window.confirm("Are you sure you want to delete this internship?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/internships/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setJobs((prev) => prev.filter((job) => job.id !== id));
        if (expandedJobId === id) {
          setExpandedJobId(null);
        }
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const toggleDetails = (id: number) => {
    setExpandedJobId((prev) => (prev === id ? null : id));
  };

  const activeJobs = jobs.length;

  if (loading) {
    return <p className="p-8 text-center">Loading company dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Company Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your internships and review your opportunities
          </p>
        </div>

        <button
          onClick={() => navigate("/add-internship")}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Internship
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500 text-sm">Total Internships</p>
          <h2 className="text-3xl font-bold text-purple-600 mt-2">
            {jobs.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500 text-sm">Applications</p>
          <h2 className="text-3xl font-bold text-purple-600 mt-2">
            {applications.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-gray-500 text-sm">Active Jobs</p>
          <h2 className="text-3xl font-bold text-purple-600 mt-2">
            {activeJobs}
          </h2>
        </div>
      </div>

      {/* Jobs List */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.map((job) => {
          const isExpanded = expandedJobId === job.id;

          return (
            <div
              key={job.id}
              className="bg-white rounded-3xl border shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h3>

                {/* Company */}
                <p className="text-gray-700 font-medium mb-4">
                  {job.company}
                </p>

                {/* Main Info */}
                <div className="space-y-3 text-sm text-gray-600 mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    <span>{job.location || "No location"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-500" />
                    <span>{job.internship_type || "Open"}</span>
                  </div>
                </div>

                {/* Toggle Details */}
                <button
                  onClick={() => toggleDetails(job.id)}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl py-3 transition"
                >
                  {isExpanded ? "Hide Details" : "View Details"}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-5 space-y-4 border-t pt-5">
                    {job.description && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          Description
                        </p>
                        <p className="text-sm text-gray-600 leading-6">
                          {job.description}
                        </p>
                      </div>
                    )}

                    {job.requirements && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          Requirements
                        </p>
                        <p className="text-sm text-gray-600 leading-6">
                          {job.requirements}
                        </p>
                      </div>
                    )}

                    {job.working_hours && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          Working Hours
                        </p>
                        <p className="text-sm text-gray-600">
                          {job.working_hours}
                        </p>
                      </div>
                    )}

                    {job.experience_level && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          Experience Level
                        </p>
                        <p className="text-sm text-gray-600">
                          {job.experience_level}
                        </p>
                      </div>
                    )}

                    {job.skills && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                          Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.split(",").map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t flex items-center justify-between bg-gray-50">
                <span className="text-xs text-gray-400">
                  Posted {formatDate(job.created_at)}
                </span>

                <button
                  onClick={() => handleDelete(job.id)}
                  className="p-2 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {jobs.length === 0 && (
        <div className="text-center mt-20 bg-white rounded-3xl p-10 shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No internships yet
          </h2>
          <p className="text-gray-500 mb-5">
            Start by adding your first internship opportunity
          </p>
          <button
            onClick={() => navigate("/add-internship")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl"
          >
            Add Internship
          </button>
        </div>
      )}
    </div>
  );
}