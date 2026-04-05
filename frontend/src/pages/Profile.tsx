import { useState } from "react";
import { Upload, User } from "lucide-react";

export default function Profile() {
  const [name, setName] = useState("Your Name");
  const [email, setEmail] = useState("email@example.com");
  const [phone, setPhone] = useState("05xxxxxxxx");
  const [cv, setCv] = useState<File | null>(null);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          My Profile 
        </h1>
        <p className="text-gray-500">
          Manage your personal info and CV
        </p>
      </div>

      {/* Card */}
      <div className="bg-white p-8 rounded-2xl shadow max-w-2xl">

        <div className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 border rounded-xl"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border rounded-xl"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-1 p-3 border rounded-xl"
            />
          </div>

          {/* Upload CV */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Upload CV
            </label>

            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 p-6 rounded-xl cursor-pointer hover:bg-gray-50">
              <Upload className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">
                {cv ? cv.name : "Upload your CV"}
              </span>

              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    setCv(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          {/* Save */}
          <button
            className="w-full h-12 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          >
            Save Changes
          </button>

        </div>

      </div>
    </div>
  );
}