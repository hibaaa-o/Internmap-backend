import { useEffect, useState } from "react";

export default function Profile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvName, setCvName] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login again");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setError("");

        const res = await fetch("http://127.0.0.1:5000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setFullName(data.full_name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setCvName(data.cv_name || "");
        } else {
          setError(data.error || "Failed to load profile");
        }
      } catch (err) {
        console.error(err);
        setError("Server error while loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login again");
      return;
    }

    try {
      setError("");
      setMessage("");

      const res = await fetch("http://127.0.0.1:5000/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: fullName,
          phone: phone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Profile saved successfully");
      } else {
        setError(data.error || "Save failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  const handleUploadCv = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login again");
      return;
    }

    if (!cvFile) {
      setError("Please choose a PDF file first");
      return;
    }

    try {
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("cv", cvFile);

      const res = await fetch("http://127.0.0.1:5000/profile/upload-cv", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setCvName(data.profile.cv_name || "");
        setMessage("CV uploaded successfully");
      } else {
        setError(data.error || "CV upload failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while uploading CV");
    }
  };

  if (loading) {
    return <p className="p-6">Loading profile...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-500 mb-8">Manage your personal info and CV</p>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-600">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-6 py-4 text-green-600">
            {message}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              value={email}
              readOnly
              className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full p-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CV (PDF)
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setCvFile(e.target.files[0]);
                }
              }}
              className="w-full p-4 rounded-2xl border border-gray-200 bg-white"
            />

            {cvName && (
              <p className="mt-3 text-sm text-gray-500">
                Current CV: {cvName}
              </p>
            )}

            <button
              type="button"
              onClick={handleUploadCv}
              className="mt-4 w-full bg-gray-900 text-white py-3 rounded-2xl hover:bg-black transition"
            >
              Upload CV
            </button>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-purple-600 text-white py-4 rounded-2xl hover:bg-purple-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}