import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const handleReset = async () => {
    const res = await fetch(
      `http://localhost:5000/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Password updated");
      navigate("/login");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="p-10">
      <h1>Reset Password</h1>

      <input
        type="password"
        placeholder="New password"
        onChange={(e) => setPassword(e.target.value)}
        className="border p-3"
      />

      <button
        onClick={handleReset}
        className="bg-purple-600 text-white p-3 mt-4"
      >
        Update Password
      </button>
    </div>
  );
}