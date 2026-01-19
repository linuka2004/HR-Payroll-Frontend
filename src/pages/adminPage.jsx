import { Route, Routes, Link, useLocation } from "react-router-dom";
import { FiUsers } from "react-icons/fi";
import { FaUserTie } from "react-icons/fa6";
import { MdOutlinePayments } from "react-icons/md";
import { MdEventAvailable } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/loader";
import AdminUsersPage from "./admin/adminUserPage";
import AdminAddUserPage from "./admin/adminAddUserPage";
import AdminEmployeePage from "./admin/adminEmployeePage";
import AdminAddEmployeePage from "./admin/adminAddEmployeePage";
import AdminUpdateEmployeePage from "./admin/adminUpdateEmployeePage";
import AdminPayrollPage from "./admin/adminPayrollPage";
import AdminAttendancePage from "./admin/adminAttendancePage";

export default function AdminPage() {
    
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(()=>{  //check if the user is admin
        const token = localStorage.getItem("token");
        if(token == null){
            window.location.href = "/";
            return;
        }
        axios.get(import.meta.env.VITE_BACKEND_URL + "/users/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response)=>{
            if(response.data.role == "admin"){
                setUser(response.data);
            }else{
                window.location.href = "/";
            }
        }).catch(()=>{
            window.location.href = "/login";
        })
    },[])

    return (
        <div className="w-full min-h-screen flex flex-col md:flex-row bg-accent ">
            {user ?
            <>
            {/* Mobile admin header */}
            <div className="w-full md:hidden">
                <div className="w-full h-[70px] text-primary flex justify-between items-center px-4">
                    <div className="flex items-center gap-3">
                        <img src="logo.png" className="h-[50px]"/>
                        <h1 className="text-2xl font-semibold text-white">ADMIN</h1>
                    </div>
                </div>
                <div className="w-full px-2 pb-3 overflow-x-auto">
                    <div className="flex gap-2 text-sm whitespace-nowrap">
                        <Link
                            to="/admin/employees"
                            className={`px-3 py-2 rounded-full border border-white/30 flex items-center gap-2 ${location.pathname.startsWith("/admin/employees") || location.pathname.startsWith("/admin/add-employee") || location.pathname.startsWith("/admin/edit-employee") ? "bg-white text-accent" : "text-white"}`}
                        >
                            <FaUserTie />
                            <span>Employees</span>
                        </Link>
                        <Link
                            to="/admin/users"
                            className={`px-3 py-2 rounded-full border border-white/30 flex items-center gap-2 ${location.pathname.startsWith("/admin/users") ? "bg-white text-accent" : "text-white"}`}
                        >
                            <FiUsers />
                            <span>Users</span>
                        </Link>
                        <Link
                            to="/admin/payroll"
                            className={`px-3 py-2 rounded-full border border-white/30 flex items-center gap-2 ${location.pathname.startsWith("/admin/payroll") ? "bg-white text-accent" : "text-white"}`}
                        >
                            <MdOutlinePayments />
                            <span>Payroll</span>
                        </Link>
                        <Link
                            to="/admin/attendance"
                            className={`px-3 py-2 rounded-full border border-white/30 flex items-center gap-2 ${location.pathname.startsWith("/admin/attendance") ? "bg-white text-accent" : "text-white"}`}
                        >
                            <MdEventAvailable />
                            <span>Attendance</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden md:block w-[300px] bg-accent h-full">
                <div className="w-full h-[100px]  text-primary flex justify-center items-center">
                    <img src="logo.png" className="h-full"/>
                    <h1 className="text-4xl text-white">ADMIN</h1>
                </div>
                <div className="w-full h-[400px] text-white text-2xl flex flex-col pl-[20px] pt-[20px]">
                    <Link to="/admin/employees"className="w-full flex items-center h-[50px] gap-[10px]"><FaUserTie />Employees</Link>
                    <Link to="/admin/users"className="w-full flex items-center h-[50px] gap-[10px]"><FiUsers />Users</Link>
                    <Link to="/admin/payroll"className="w-full flex items-center h-[50px] gap-[10px]"><MdOutlinePayments />Payroll</Link>
                    <Link to="/admin/attendance"className="w-full flex items-center h-[50px] gap-[10px]"><MdEventAvailable />Attendance</Link>
                </div>

            </div>
            <div className="flex-1 h-full md:max-h-full border-[10px] rounded-3xl overflow-y-scroll bg-primary border-accent overflow-auto custom-scrollbar">
                <Routes>
                    <Route path="/" element={<AdminEmployeePage />} />
                    <Route path="/employees" element={<AdminEmployeePage />} />
                    <Route path="/add-employee" element={<AdminAddEmployeePage />} />
                    <Route path="/edit-employee/:employeeId" element={<AdminUpdateEmployeePage />} />
                    <Route path="/users" element={<AdminUsersPage />} />
                    <Route path="/add-user" element={<AdminAddUserPage />} />
                    <Route path="/payroll" element={<AdminPayrollPage />} />
                    <Route path="/attendance" element={<AdminAttendancePage />} />            
                </Routes>
            </div>

            </>:
            <Loader />
}
       </div>
        
    );
}