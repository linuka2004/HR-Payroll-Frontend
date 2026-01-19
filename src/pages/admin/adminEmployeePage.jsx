import { BiPlus } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import toast from "react-hot-toast";

export default function AdminEmployeePage() {

  const [employees, setEmployees] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/employees", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          setEmployees(response.data.employees || []);
          setLoaded(true);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load employees");
          toast.error("Failed to load employees");
        });
    }
  }, [loaded, navigate]);

  async function deleteEmployee(employeeId) {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + `/employees/${employeeId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success("Employee deleted successfully");
      setLoaded(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete employee");
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center px-4 py-6 sm:px-6 md:px-10 bg-primary text-secondary custom-scrollbar">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-4 sm:p-6 overflow-hidden custom-scrollbar">
        <h1 className="text-3xl font-semibold mb-6 tracking-wide text-secondary">
          Employees
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        {loaded ? (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse">
              <thead>
                <tr className="bg-secondary text-primary text-left text-sm uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">Employee</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Base Salary</th>
                  <th className="py-3 px-4 rounded-r-xl">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-accent/30">
                {employees.map((emp) => (
                  <tr
                    key={emp.employeeId}
                    className="hover:bg-primary/70 transition-all ease-in-out"
                  >
                    <td className="py-3 px-4">
                      <img
                        src={emp.image || "https://via.placeholder.com/40x40?text=EMP"}
                        alt={emp.firstName + " " + emp.lastName}
                        className="w-10 h-10 rounded-full object-cover border border-accent/40 bg-gray-100"
                      />
                    </td>
                    <td className="py-3 px-4">{emp.firstName} {emp.lastName}</td>
                    <td className="py-3 px-4">{emp.role}</td>
                    <td className="py-3 px-4">{emp.address}</td>
                    <td className="py-3 px-4 font-semibold text-gold">
                      Rs. {emp.baseSalary}
                    </td>
                    <td className="py-3 px-4 flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/edit-employee/${emp.employeeId}`, {
                            state: { employee: emp },
                          })
                        }
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md flex justify-center items-center hover:bg-blue-200 transition-all text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin/payroll?employeeId=${emp.employeeId}`)
                        }
                        className="px-3 py-1 bg-accent/20 text-grey rounded-md flex justify-center items-center hover:bg-accent/40 transition-all text-xs"
                      >
                        View Payroll
                      </button>
                      {/* Placeholder for future edit functionality */}
                      <button
                        onClick={() => deleteEmployee(emp.employeeId)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md flex justify-center items-center hover:bg-red-200 transition-all text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Loader />
        )}
      </div>

      {/* Floating Add Button */}
      <Link
        to="/admin/add-employee"
        className="fixed right-8 bottom-8 w-[60px] h-[60px] flex justify-center items-center rounded-full bg-secondary hover:bg-gold text-primary shadow-2xl text-4xl transition-all"
      >
        <BiPlus />
      </Link>
    </div>
  );
}