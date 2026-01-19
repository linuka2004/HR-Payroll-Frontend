import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/loader";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/register", {
        name,
        email,
        password,
      });

      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-screen bg-[url('/bglogin.jpg')] bg-center bg-cover bg-no-repeat flex">
      <div className="w-[50%] h-full flex justify-center items-center flex-col p-[50px]">
        <img
          src="/logo.png"
          alt="logo"
          className="w-[200px] h-[200px] mb-[20px] object-cover"
        />
        <h1 className="text-[50px] text-gold text-shadow-accent text-shadow-2xs font-bold text-center">
          Manufacturing, Distributing Plastic Products
        </h1>
        <p className="text-[30px] text-white font-semibold italic">
          PJ Plastic(Pvt) Ltd
        </p>
      </div>
      <div className="w-[50%] h-full flex justify-center items-center">
        <form
          onSubmit={handleRegister}
          className="w-[450px] min-h-[600px] backdrop-blur-lg shadow-2xl rounded-xl flex flex-col justify-center items-center p-[30px]"
        >
          <p className="text-[40px] font-bold mb-[20px] text-accent text-shadow-white ">
            Register
          </p>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full h-[50px] mb-[20px] border rounded-lg border-accent p-10 text-[20px] focus:outline-none focus:ring-2 focus:ring-gold"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full h-[50px] mb-[20px] border rounded-lg border-accent p-10 text-[20px] focus:outline-none focus:ring-2 focus:ring-gold"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full h-[50px] mb-[20px] border rounded-lg border-accent p-10 text-[20px] focus:outline-none focus:ring-2 focus:ring-gold"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full h-[50px] mb-[20px] border rounded-lg border-accent p-10 text-[20px] focus:outline-none focus:ring-2 focus:ring-gold"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full h-[50px] bg-accent text-secondary font-bold text-[20px] rounded-lg border-[2px] border-accent hover:bg-transparent hover:text-accent mb-[10px]"
          >
            Register
          </button>
          <p className="text-white text-[16px] mt-[10px]">
            Already have an account?{" "}
            <Link to="/login" className="text-gold underline">
              Login
            </Link>
          </p>
        </form>
      </div>
      {isLoading && <Loader />}
    </div>
  );
}
