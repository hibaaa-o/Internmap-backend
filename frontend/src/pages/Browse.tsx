import { useEffect, useState } from "react";
import {
  MapPin,
  Briefcase,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Internship = {
  id: number;
  title: string;
  company: string;
  location?: string;
  description?: string;
  requirements?: string;
  working_hours?: string;
  experience_level?: string;
  internship_type?: string;
  skills?: string;
};

export default function Browse() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/internships")
      .then((res) => res.json())
      .then((data) => {
        setInternships(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleApply = async (internshipId: number) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must login first");
    return;
  }

  try {
    // check profile first
    const profileRes = await fetch("http://localhost:5000/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const profileData = await profileRes.json();

    if (!profileRes.ok) {
      alert("Failed to load profile");
      return;
    }

    if (!profileData.full_name || !profileData.cv_name) {
      alert("Please complete your profile and add your CV before applying");
      return;
    }

    const res = await fetch("http://localhost:5000/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        internship_id: internshipId,
        cover_letter: "I am interested in this internship.",
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Applied successfully");
    } else {
      alert(data.error || "Application failed");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};
  const toggleDetails = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return <p className="p-8">Loading internships...</p>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Browse Internships
      </h1>

      {internships.length === 0 ? (
        <p>No internships available yet.</p>
      ) : (
        <div className="grid gap-6">
          {internships.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition"
              >
                {/* Top */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {item.title}
                  </h2>
                  <p className="text-lg text-gray-700 mt-1">{item.company}</p>
                </div>

                {/* Main info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-500" />
                    <span>{item.location || "No location"}</span>
                  </div>

                  {item.internship_type && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-purple-500" />
                      <span>{item.internship_type}</span>
                    </div>
                  )}

                  {item.working_hours && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span>{item.working_hours}</span>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    onClick={() => handleApply(item.id)}
                    className="bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 transition"
                  >
                    Apply
                  </button>

                  <button
                    onClick={() => toggleDetails(item.id)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
                  >
                    {isExpanded ? "Hide Details" : "View Details"}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="pt-4 border-t space-y-4">
                    {item.description && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                          Description
                        </h3>
                        <p className="text-sm text-gray-600 leading-6">
                          {item.description}
                        </p>
                      </div>
                    )}

                    {item.requirements && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                          Requirements
                        </h3>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <p className="leading-6">{item.requirements}</p>
                        </div>
                      </div>
                    )}

                    {item.experience_level && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                          Experience Level
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.experience_level}
                        </p>
                      </div>
                    )}

                    {item.skills && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {item.skills.split(",").map((skill, index) => (
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
            );
          })}
        </div>
      )}
    </div>
  );
}