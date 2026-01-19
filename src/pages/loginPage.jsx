//rfc kiyala gehuwama enw

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/loader";
import { GrGoogle } from "react-icons/gr";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
    const navigate = useNavigate() // to navigate programmatically
    const [isLoading , setIsLoading] = useState(false);
    

	async function login() {
		console.log("Login button clicked");
		console.log("Email:", email);
		console.log("Password:", password);
        setIsLoading(true);

		try {
			const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/login", {
				email: email,
				password: password,
			});

            console.log(res.data.token)

            localStorage.setItem("token",res.data.token); // Store the token in local storage

            // Always go to /admin after login; AdminPage will
            // verify role via /users/ and redirect if needed.
            navigate("/admin");

            //alert("Login successful! Welcome back.");

            toast.success("Login successful! Welcome back.");
            setIsLoading(false);

		} catch (err) {

            //alert("Login failed! Please check your credentials and try again.");
            toast.error("Login failed! Please check your credentials and try again.");  // to show error message in professional way. use toast library.

            console.log("Error during login:");
			console.log(err);
            setIsLoading(false);
		}
	}

    

    return (
        <div className="w-full h-screen bg-[url('/bglogin.jpg')] bg-center bg-cover bg-no-repeat flex">
            <div className="w-[50%] h-full flex justify-center items-center flex-col p-[50px]">
                <img src="/logo.png" alt="logo" className="w-[200px] h-[200px] mb-[20px] object-cover"/>
                <h1 className="text-[50px] text-gold text-shadow-accent text-shadow-2xs font-bold text-center">Manufacturing, Distributing Plastic Products</h1>
                <p className="text-[30px] text-white font-semibold italic">PJ Plastic(Pvt) Ltd</p>
            </div>
            <div className="w-[50%] h-full flex justify-center items-center">
                
                <div className="w-[450px] h-[600px] backdrop-blur-lg shadow-2xl rounded-xl flex flex-col justify-center items-center p-[30px]">
                    <p className="text-[40px] font-bold mb-[20px] text-accent text-shadow-white ">Login</p>
                    <input
                    onChange={
                        (e) => 
                            setEmail(e.target.value)
                    }
                    type="email" 
                    placeholder="Your Email" 
                    className="w-full h-[50px] mb-[20px] border rounded-lg border-accent p-10 text-[20px] focus:outline-none focus:ring-2 focus:ring-gold" 
                    />
                    <input 
                    onChange={
                        (e)=>{
                            setPassword(e.target.value)
                        }
                    } 
                    type="password" 
                    placeholder="Your Password" 
                    className="w-full h-[50px] mb-[20px] border rounded-lg border-accent p-10 text-[20px] focus:outline-none focus:ring-2 focus:ring-gold" 
                    />

                    
                     
                    <button onClick={login} className="w-full h-[50px] bg-accent text-secondary font-bold text-[20px] rounded-lg border-[2px] border-accent hover:bg-transparent hover:text-accent mb-[20px]">Login</button>
              
                                

                    
                </div>
            </div>
            {isLoading && <Loader />}
        </div>
    );
}

