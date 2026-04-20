import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Reset link generated successfully");

        if (data.resetLink) {
          window.location.href = data.resetLink;
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-md">
          <h1
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Forgot Password
          </h1>

          <p className="text-gray-500 mb-6">
            Enter your email to receive a reset link
          </p>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-600">
              {message}
            </div>
          )}

          <form onSubmit={handleSendCode} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />

            <button
              type="submit"
              className="w-full rounded-2xl bg-purple-600 py-3 text-white hover:bg-purple-700 transition"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-5 text-sm text-gray-500">
            Remember your password?{" "}
            <Link to="/login" className="text-purple-600 font-medium">
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-600 text-white">
        <h2
          className="text-4xl font-bold px-8 text-center"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Reset Your Password Securely
        </h2>
      </div>
    </div>
  );
}