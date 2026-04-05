import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddInternship() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    type: "Full-time",
    salary: "",
    duration: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(form); // بعدين نربطه بالباك

    navigate("/company-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">

      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg">

        {/* Title */}
        <h1 className="text-2xl font-bold mb-6">
          Add Internship 
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="text-sm text-gray-600">Job Title</label>
            <input
              type="text"
              placeholder="Frontend Intern"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              className="w-full mt-1 p-3 border rounded-xl"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm text-gray-600">Location</label>
            <input
              type="text"
              placeholder="Riyadh"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
              className="w-full mt-1 p-3 border rounded-xl"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-sm text-gray-600">Type</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              className="w-full mt-1 p-3 border rounded-xl"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Remote</option>
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className="text-sm text-gray-600">Salary (optional)</label>
            <input
              type="text"
              placeholder="3000 SAR"
              value={form.salary}
              onChange={(e) =>
                setForm({ ...form, salary: e.target.value })
              }
              className="w-full mt-1 p-3 border rounded-xl"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm text-gray-600">Duration</label>
            <input
              type="text"
              placeholder="3 months"
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: e.target.value })
              }
              className="w-full mt-1 p-3 border rounded-xl"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-600">Description</label>
            <textarea
              placeholder="Write internship details..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full mt-1 p-3 border rounded-xl h-28"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">

            <button
              type="button"
              onClick={() => navigate("/company-dashboard")}
              className="flex-1 border rounded-xl h-12"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white rounded-xl h-12"
            >
              Publish Internship
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}