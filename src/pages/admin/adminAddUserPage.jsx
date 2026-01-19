import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminAddUserPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  async function registerUser() {
    if (firstName.trim() === "") {
      toast.error("First name is required");
      return;
    }
    if (lastName.trim() === "") {
      toast.error("Last name is required");
      return;
    }
    if (email.trim() === "") {
      toast.error("Email is required");
      return;
    }
    if (password.trim() === "") {
      toast.error("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/", {
        email: email.trim(),
        password: password.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      toast.success("Admin user created successfully");
      navigate("/admin/users");
    } catch (err) {
      toast.error("Failed to create user. Please try again.");
      console.log(err);
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-start px-4 py-6 sm:px-6 md:px-10 overflow-y-auto bg-primary">
      <div className="w-full max-w-3xl p-4 sm:p-6 md:p-8 bg-accent/85 rounded-2xl shadow-2xl overflow-y-visible">
        <h1 className="w-full text-xl mb-5 flex justify-center items-center gap-2 text-white">
          <FiUserPlus /> Register New Admin User
        </h1>
        <div className="w-full bg-white p-5 sm:p-6 md:p-8 rounded-xl flex flex-wrap justify-between shadow-2xl gap-y-4">
          <div className="w-full md:w-[48%]">
            <label className="block mb-1 text-sm font-medium">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-10 rounded-2xl border border-accent px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="w-full md:w-[48%]">
            <label className="block mb-1 text-sm font-medium">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full h-10 rounded-2xl border border-accent px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 rounded-2xl border border-accent px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="w-full md:w-[48%]">
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 rounded-2xl border border-accent px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="w-full md:w-[48%]">
            <label className="block mb-1 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-10 rounded-2xl border border-accent px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <Link
            to="/admin/users"
            className="w-full sm:w-[48%] h-12 bg-red-900 text-white font-bold rounded-2xl flex justify-center items-center hover:bg-gray-300 border-2 mt-4"
          >
            Cancel
          </Link>
          <button
            onClick={registerUser}
            className="w-full sm:w-[48%] h-12 bg-black text-white rounded-2xl hover:bg-accent/80 mt-4"
          >
            Create Admin User
          </button>
        </div>
      </div>
    </div>
  );
}
