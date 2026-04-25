import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddInternship() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [requirements, setRequirements] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [internshipType, setInternshipType] = useState("");
  const [skills, setSkills] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!title || !company || !location) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/internships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
  title,
  company,
  location,
  description,
  requirements,
  working_hours: workingHours,
  experience_level: experienceLevel,
  internship_type: internshipType,
  skills,
}),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Internship added successfully ✅");
        navigate("/company-dashboard");
      } else {
        alert(data.error || "Failed to add internship");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Add Internship</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow max-w-2xl space-y-4"
      >
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />

        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />

        {/* City */}
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 border rounded-xl"
        >
          <option value="">Select City</option>
          <option value="Riyadh">Riyadh</option>
          <option value="Jeddah">Jeddah</option>
          <option value="Dammam">Dammam</option>
          <option value="Khobar">Khobar</option>
        </select>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />

        {/* 🔥 NEW FIELDS */}

        <input
          placeholder="Requirements (e.g. Excel, communication)"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />

        <input
          placeholder="Working Hours (e.g. 8 hours daily)"
          value={workingHours}
          onChange={(e) => setWorkingHours(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />

        <input
          placeholder="Experience Level (e.g. No experience required)"
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />

        <input
          placeholder="Internship Type (Full-time / Part-time)"
          value={internshipType}
          onChange={(e) => setInternshipType(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />

        <input
          placeholder="Skills (Excel, Teamwork...)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />

        <button className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700">
          Add Internship
        </button>
      </form>
    </div>
  );
}