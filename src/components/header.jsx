import { Link } from "react-router-dom";
import UserData from "./userData";
import { useState } from "react";
import { LuListCollapse } from "react-icons/lu";


export default function Header() {
    const [sideBarOpen, setSidebarOpen] = useState(false);


    return (
        <header className="w-full h-[80px] bg-accent flex relative">
            <LuListCollapse onClick={()=>{setSidebarOpen(true)}} className="text-white my-auto text-2xl ml-6 lg:hidden"/>
            <img src="/logo.png" className="w-[79px] h-full " alt="logo.png"></img>
            <div className="w-full h-full hidden lg:flex text-primary justify-center items-center text-xl gap-[30px]">
                
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </div>  
            <div className="absolute right-29 top-0 h-full hidden lg:flex items-center">
                {/* <UserData /> */}
            </div>   
            
            {sideBarOpen && <div className="fixed lg:hidden w-[100vw] h-screen top-0 left-0 bg-black/50 z-20 transition-all duration-300">
                <div className="w-[250px] h-screen flex-col relative">
                    <div className="absolute w-full h-full bg-white left-[-250px] translate-x-[250px] transform-flat transition-transform duration-1000 flex flex-col ">
                        <div className="w-full h-[80px] bg-accent flex justify-center items-center">
                            <img src="/logo.png" className="h-full" alt="logo" />
                            <LuListCollapse onClick={()=>{setSidebarOpen(false)}} className="text-white my-auto text-2xl ml-6 lg:hidden rotate-180"/>
                                
                        </div>
                        <div className="w-full h-full flex flex-col text-xl text-secondary justify-start items-start  gap-6 mt-10 pl-6">
								<div className=" flex justify-center bg-accent p-2 rounded-full">
									{/* <UserData /> */}
								</div>
								<a
									className="hover:text-secondary transition"
									href="/"
									onClick={() => setSideBarOpen(false)}
								>
									Home
								</a>
								<a
									className="hover:text-secondary transition"
									href="/products"
									onClick={() => setSideBarOpen(false)}
								>
									Products
								</a>
								<a
									className="hover:text-secondary transition"
									href="/about"
									onClick={() => setSideBarOpen(false)}
								>
									About
								</a>
							</div>
                    </div>
                </div>
                </div>} 
            
            
        </header>
    );
}