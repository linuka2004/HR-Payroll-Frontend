import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function ForgetPasswordPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  async function sendOtp(){
    setLoading(true);
    try{
      await axios.get(import.meta.env.VITE_BACKEND_URL + "/users/send-otp/"+email);
      toast.success("OTP sent to your email");
      setLoading(false);
      setOtpSent(true);
    }catch(err){
      console.log(err);
      toast.error("Error sending OTP. Try again.");
      setLoading(false);
    }
  }

  async function resetPassword(){
    if(newPassword !== confirmPassword){
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try{
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/validate-otp",{
        email: email,
        otp: otp,
        newPassword: newPassword
      });
      toast.success("Password reset successful");
      setLoading(false);
      navigate("/login"); // Optionally, redirect to login page

    }catch(err){
      console.log(err);
      toast.error("Error resetting password. Try again later.");
      setLoading(false);
    }
  }

  return(
    <div className="w-full h-full flex justify-center items-center">
      {
        loading && (
          <Loader />
        )
      }
      {
        otpSent ? 
        <div className="w-[400px] h-[500px] flex flex-col justify-center items-center bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Enter OTP and New Password</h2>
          <input 
            type="text"
            placeholder="Enter OTP"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            onChange={(e)=>setOtp(e.target.value)} />
          <input 
            type="text"
            placeholder="Enter New Password"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            onChange={(e)=>setNewPassword(e.target.value)} />
          <input 
            type="text"
            placeholder="Confirm New Password"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            onChange={(e)=>setConfirmPassword(e.target.value)} /> 
          <button 
            onClick={resetPassword}
            className="w-full bg-accent text-white p-2 rounded hover:bg-accent/80">
              Reset Password
          </button> 
        </div> :
        <div className="w-[400px] h-[400px] flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-accent">Reset Your Password</h2>
          <input 
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 mb-4 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            className="w-full h-12 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors duration-200"
            onClick={sendOtp}> Send OTP</button>
          
        </div>
      }
  </div>
)
}