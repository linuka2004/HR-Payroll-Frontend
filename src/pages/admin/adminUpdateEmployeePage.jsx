import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaUserTie } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";
import uploadFile from "../../utils/mediaUpload";

export default function AdminUpdateEmployeePage() {

  const [employeeId, setEmployeeId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [etfNumber, setEtfNumber] = useState("");
  const [telephone, setTelephone] = useState("");
  const [department, setDepartment] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [baseSalary, setBaseSalary] = useState(0);
  const [allowances, setAllowances] = useState(0);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { employeeId: routeEmployeeId } = useParams();

  useEffect(() => {
    const existing = location.state && location.state.employee ? location.state.employee : null;
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in as admin to update an employee.");
      navigate("/login");
      return;
    }

    if (existing) {
      setEmployeeId(existing.employeeId || "");
      setFirstName(existing.firstName || "");
      setLastName(existing.lastName || "");
      setIdNumber(existing.idNumber || "");
      setEtfNumber(existing.etfNumber || "");
      setTelephone(existing.telephone || "");
      setDepartment(existing.department || "");
      setAddress(existing.address || "");
      setRole(existing.role || "");
      setBaseSalary(existing.baseSalary || 0);
      setAllowances(existing.allowances || 0);
      setImage(existing.image || "");
      return;
    }

    if (!routeEmployeeId) {
      toast.error("Invalid employee.");
      navigate("/admin/employees");
      return;
    }

    setLoading(true);
    axios
      .get(import.meta.env.VITE_BACKEND_URL + `/employees/${routeEmployeeId}` , {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        const emp = response.data.employee;
        if (!emp) {
          toast.error("Employee not found");
          navigate("/admin/employees");
          return;
        }
        setEmployeeId(emp.employeeId || "");
        setFirstName(emp.firstName || "");
        setLastName(emp.lastName || "");
        setIdNumber(emp.idNumber || "");
        setEtfNumber(emp.etfNumber || "");
        setTelephone(emp.telephone || "");
        setDepartment(emp.department || "");
        setAddress(emp.address || "");
        setRole(emp.role || "");
        setBaseSalary(emp.baseSalary || 0);
        setAllowances(emp.allowances || 0);
        setImage(emp.image || "");
      })
      .catch((err) => {
        console.error("Error loading employee", err);
        toast.error("Failed to load employee details");
        navigate("/admin/employees");
      })
      .finally(() => setLoading(false));
  }, [location.state, navigate, routeEmployeeId]);

  async function updateEmployee() {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in as admin to update an employee.");
      navigate("/login");
      return;
    }

    if (
      !employeeId ||
      !firstName ||
      !lastName ||
      !idNumber ||
      !etfNumber ||
      !telephone ||
      !department ||
      !address ||
      !role ||
      !baseSalary
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const targetId = routeEmployeeId || employeeId;

    try {
      setLoading(true);

      let imageUrl = image || undefined;

      if (imageFile) {
        try {
          imageUrl = await uploadFile(imageFile);
        } catch (uploadErr) {
          console.error("Error uploading image", uploadErr);
          toast.error("Failed to upload image. Please try again.");
          setLoading(false);
          return;
        }
      }

      await axios.put(
        import.meta.env.VITE_BACKEND_URL + `/employees/${targetId}`,
        {
          employeeId,
          firstName,
          lastName,
          idNumber,
          etfNumber,
          telephone,
          department,
          address,
          role,
          image: imageUrl,
          baseSalary: Number(baseSalary),
          allowances: Number(allowances) || 0,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Employee updated successfully!");
      navigate("/admin/employees");
    } catch (err) {
      console.error("Error updating employee", err);
      toast.error("Error updating employee. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-start px-4 py-6 sm:px-6 md:px-10 overflow-y-auto bg-primary">
      <div className="w-full max-w-3xl p-4 sm:p-6 md:p-8 bg-accent/85 rounded-2xl shadow-2xl overflow-y-visible">
        <h1 className="w-full text-xl mb-[20px] flex justify-center items-center gap-[5px]">
          <FaUserTie /> Update Employee
        </h1>
        <div className="w-full bg-white p-[20px] rounded-xl flex flex-wrap justify-between shadow-2xl">
          <div className="my-[10px] w-full md:w-[48%]">
            <label>Employee ID:</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              disabled
              className="w-full h-[40px] rounded-2xl focus-outline-none border border-accent shadow-2xl px-[20px] bg-gray-100 cursor-not-allowed"
            />
            <p className="text-sm text-gray-500 text-right">Employee ID cannot be changed.</p>
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
          <div className="my-[10px] w-full md:w-[48%]">
            <label>ID Number: </label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="w-full h-[40px] rounded-2xl focus-outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
            />
          </div>
          <div className="my-[10px] w-full md:w-[48%]">
            <label>ETF Number: </label>
            <input
              type="text"
              value={etfNumber}
              onChange={(e) => setEtfNumber(e.target.value)}
              className="w-full h-[40px] rounded-2xl focus-outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
            />
          </div>
          <div className="my-[10px] w-full md:w-[48%]">
            <label>Telephone: </label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full h-[40px] rounded-2xl focus-outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
            />
          </div>
          <div className="my-[10px] w-full md:w-[48%]">
            <label>Department: </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
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
          <div className="my-[10px] w-full">
            <label>Profile Image (optional): </label>
            {image && (
              <div className="mb-2 flex items-center gap-3">
                <img
                  src={image}
                  alt="Current profile"
                  className="w-12 h-12 rounded-full object-cover border border-accent"
                />
                <span className="text-xs text-gray-600 break-all">Current image</span>
              </div>
            )}
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
            <p className="text-sm text-gray-500">If you don't select a new image, the existing one will be kept.</p>
          </div>
          <Link
            to="/admin/employees"
            className="w-full sm:w-[48%] h-[50px] bg-red-900 text-white font-bold rounded-2xl flex justify-center items-center hover:bg-gray-300 border-[2px] mt-[20px]"
          >
            Cancel
          </Link>
          <button
            onClick={updateEmployee}
            disabled={loading}
            className="w-full sm:w-[48%] h-[50px] bg-black text-white rounded-2xl hover:bg-accent/80 mt-[20px] disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}
