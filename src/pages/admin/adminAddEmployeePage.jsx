import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserTie } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";
import uploadFile from "../../utils/mediaUpload";

export default function AdminAddEmployeePage() {

  const [employeeId, setEmployeeId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [baseSalary, setBaseSalary] = useState(0);
  const [allowances, setAllowances] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  async function addEmployee() {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in as admin to add an employee.");
      navigate("/login");
      return;
    }

    if (!employeeId || !firstName || !lastName || !address || !role || !baseSalary) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setUploading(true);

      let imageUrl;

      if (imageFile) {
        try {
          imageUrl = await uploadFile(imageFile);
        } catch (uploadErr) {
          console.error("Error uploading image", uploadErr);
          toast.error("Failed to upload image. Please try again.");
          setUploading(false);
          return;
        }
      }

      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/employees",
        {
          employeeId,
          firstName,
          lastName,
          address,
          role,
          image: imageUrl || undefined,
          baseSalary: Number(baseSalary),
          allowances: Number(allowances) || 0,
          deductions: Number(deductions) || 0,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Employee added successfully!");
      navigate("/admin/employees");
    } catch (err) {
      console.error("Error adding employee", err);
      toast.error("Error adding employee. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-start px-4 py-6 sm:px-6 md:px-10 overflow-y-auto bg-primary">
      <div className="w-full max-w-3xl p-4 sm:p-6 md:p-8 bg-accent/85 rounded-2xl shadow-2xl overflow-y-visible">
        <h1 className="w-full text-xl mb-[20px] flex justify-center items-center gap-[5px]">
          <FaUserTie /> Add New Employee
        </h1>
        <div className="w-full bg-white p-[20px] rounded-xl flex flex-wrap justify-between shadow-2xl">
          <div className="my-[10px] w-full md:w-[48%]">
            <label>Employee ID:</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full h-[40px] rounded-2xl focus-outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
            />
            <p className="text-sm text-gray-500 text-right">Provide a unique employee ID.</p>
          </div>
          <div className="my-[10px] w-full md:w-[48%]">
            <label>First Name: </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-[40px] rounded-2xl focus-outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
            />
          </div>
          <div className="my-[10px] w-full md:w-[48%]">
            <label>Last Name: </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full h-[40px] rounded-2xl focus-outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
            />
          </div>
          <div className="my-[10px] w-full">
            <label>Address: </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-[80px] rounded-2xl focus-outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px] py-[10px]"
            ></textarea>
          </div>
          <div className="my-[10px] w-full md:w-[48%]">
            <label>Role / Designation: </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-[40px] rounded-2xl focus-outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
            />
          </div>
          <div className="my-[10px] w-full md:w-[48%]">
            <label>Base Salary (Rs): </label>
            <input
              type="number"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              className="w-full h-[40px] rounded-2xl focus-outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
            />
          </div>
          <div className="my-[10px] w-full md:w-[48%]">
            <label>Allowances (Rs): </label>
            <input
              type="number"
              value={allowances}
              onChange={(e) => setAllowances(e.target.value)}
              className="w-full h-[40px] rounded-2xl focus-outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
            />
          </div>
          <div className="my-[10px] w-full md:w-[48%]">
            <label>Deductions (Rs): </label>
            <input
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              className="w-full h-[40px] rounded-2xl focus-outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
            />
          </div>
          <div className="my-[10px] w-full">
            <label>Profile Image (optional): </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                } else {
                  setImageFile(null);
                }
              }}
              className="w-full h-[40px] rounded-2xl focus-outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[10px] flex items-center bg-white"
            />
            <p className="text-sm text-gray-500">If not selected, the employee will use the default profile image.</p>
          </div>
          <Link
            to="/admin/employees"
            className="w-full sm:w-[48%] h-[50px] bg-red-900 text-white font-bold rounded-2xl flex justify-center items-center hover:bg-gray-300 border-[2px] mt-[20px]"
          >
            Cancel
          </Link>
          <button
            onClick={addEmployee}
            disabled={uploading}
            className="w-full sm:w-[48%] h-[50px] bg-black text-white rounded-2xl hover:bg-accent/80 mt-[20px] disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Add Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}