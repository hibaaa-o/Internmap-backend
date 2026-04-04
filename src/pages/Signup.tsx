import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    localStorage.setItem("user", "student");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-4">

        <h1 className="text-2xl font-bold text-center">
          Create Account
        </h1>

        <input placeholder="First Name" className="w-full p-3 border rounded-xl" />
        <input placeholder="Last Name" className="w-full p-3 border rounded-xl" />
        <input placeholder="Phone (+966)" className="w-full p-3 border rounded-xl" />
        <input placeholder="Email" className="w-full p-3 border rounded-xl" />
        <input placeholder="Password" type="password" className="w-full p-3 border rounded-xl" />
        <input placeholder="Confirm Password" type="password" className="w-full p-3 border rounded-xl" />

        <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl">
          Create Account
        </button>

      </form>
    </div>
  );
}