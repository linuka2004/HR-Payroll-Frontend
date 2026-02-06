import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/loader";

export default function AdminAttendanceViewPage() {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1); // 1-12
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/employees", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        const list = res.data.employees || [];
        setEmployees(list);
        if (list.length > 0) {
          setSelectedEmployeeId(list[0].employeeId);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load employees");
      })
      .finally(() => {
        setLoadingEmployees(false);
      });
  }, [navigate]);

  async function handleFetchAttendance() {
    if (!selectedEmployeeId) {
      toast.error("Please select an employee");
      return;
    }

    if (!year || Number.isNaN(Number(year))) {
      toast.error("Please enter a valid year");
      return;
    }

    if (!month || Number.isNaN(Number(month)) || month < 1 || month > 12) {
      toast.error("Please select a valid month");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoadingAttendance(true);
      setAttendanceData(null);

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/attendance/${selectedEmployeeId}`,
        {
          params: { year, month },
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setAttendanceData(res.data);
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || "Failed to fetch attendance";
      toast.error(message);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setLoadingAttendance(false);
    }
  }

  function formatNumber(value) {
    const num = Number(value || 0);
    if (Number.isNaN(num)) return "0.00";
    return num.toFixed(2);
  }

  function formatTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const annualLeaves =
    attendanceData && attendanceData.records
      ? attendanceData.records.filter((rec) => rec.status === "Annual Leave")
      : [];
  const sickLeaves =
    attendanceData && attendanceData.records
      ? attendanceData.records.filter((rec) => rec.status === "Sick Leave")
      : [];

  return (
    <div className="w-full min-h-screen flex justify-center px-4 py-6 sm:px-6 md:px-10 bg-primary text-secondary custom-scrollbar">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-4 sm:p-6 md:p-8 overflow-hidden">
        <h1 className="text-3xl font-semibold mb-6 tracking-wide text-secondary">
          Attendance Summary (Payroll Cycle)
        </h1>

        {loadingEmployees ? (
          <Loader />
        ) : employees.length === 0 ? (
          <p className="text-sm text-red-600">
            No employees found. Please add employees first.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Employee</label>
                <select
                  className="w-full h-[40px] rounded-2xl border border-accent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                >
                  {employees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.employeeId} - {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Year</label>
                <input
                  type="number"
                  className="w-full h-[40px] rounded-2xl border border-accent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  min="2000"
                  max="2100"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Month (Cycle End Month)</label>
                <select
                  className="w-full h-[40px] rounded-2xl border border-accent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {monthNames.map((name, index) => (
                    <option key={name} value={index + 1}>
                      {index + 1} - {name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  Uses payroll cycle from 21st of previous month to 20th of selected month.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                type="button"
                onClick={handleFetchAttendance}
                disabled={loadingAttendance}
                className="px-4 h-[40px] bg-black text-white rounded-2xl hover:bg-accent/90 disabled:opacity-60"
              >
                {loadingAttendance ? "Loading..." : "Get Attendance"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/attendance")}
                className="px-4 h-[40px] border border-accent text-secondary rounded-2xl hover:bg-primary/60"
              >
                Back to Record Attendance
              </button>
            </div>

            {loadingAttendance && <Loader />}

            {!loadingAttendance && attendanceData && (
              <div className="space-y-6">
                <div className="bg-primary/40 rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Employee</h2>
                    <p className="text-sm">
                      <span className="font-medium">ID:</span> {attendanceData.employee.employeeId}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Name:</span> {attendanceData.employee.firstName}{" "}
                      {attendanceData.employee.lastName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Base Salary:</span> Rs. {attendanceData.employee.baseSalary}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Period</h2>
                    <p className="text-sm">
                      <span className="font-medium">Payroll Month:</span> {attendanceData.period.month} / {attendanceData.period.year}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">From:</span> {attendanceData.period.startDate}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">To:</span> {attendanceData.period.endDate}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Totals</h2>
                    <p className="text-sm">
                      <span className="font-medium">Working Hours:</span> {formatNumber(attendanceData.totals.workingHours)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">OT Hours:</span> {formatNumber(attendanceData.totals.otHours)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Annual Leave Days:</span> {attendanceData.totals.annualLeaveDays}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Sick Leave Days:</span> {attendanceData.totals.sickLeaveDays}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">No Pay Days:</span> {attendanceData.totals.noPayDays}
                    </p>
                    {attendanceData.annualLeaveSummary && (
                      <>
                        <p className="text-sm mt-2 font-semibold">Annual Leaves (Year {attendanceData.annualLeaveSummary.year})</p>
                        <p className="text-sm">
                          <span className="font-medium">Entitlement:</span> {attendanceData.annualLeaveSummary.entitlementDays} days
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Taken:</span> {attendanceData.annualLeaveSummary.takenDays} days
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Remaining:</span> {attendanceData.annualLeaveSummary.remainingDays} days
                        </p>
                      </>
                    )}
                    {attendanceData.sickLeaveSummary && (
                      <>
                        <p className="text-sm mt-2 font-semibold">Sick Leaves (Year {attendanceData.sickLeaveSummary.year})</p>
                        <p className="text-sm">
                          <span className="font-medium">Entitlement:</span> {attendanceData.sickLeaveSummary.entitlementDays} days
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Taken:</span> {attendanceData.sickLeaveSummary.takenDays} days
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Remaining:</span> {attendanceData.sickLeaveSummary.remainingDays} days
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-primary/20 rounded-2xl p-4">
                    <h2 className="text-lg font-semibold mb-2">Annual Leaves (This Period)</h2>
                    <p className="text-sm mb-2">
                      <span className="font-medium">Total Days:</span> {attendanceData.totals.annualLeaveDays}
                    </p>
                    {annualLeaves.length > 0 ? (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {annualLeaves.map((rec) => (
                          <span
                            key={rec.id}
                            className="px-2 py-1 rounded-full bg-white text-secondary border border-accent/40"
                          >
                            {rec.date} ({rec.dayType})
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600">No annual leaves in this payroll cycle.</p>
                    )}
                  </div>

                  <div className="bg-primary/20 rounded-2xl p-4">
                    <h2 className="text-lg font-semibold mb-2">Sick Leaves (This Period)</h2>
                    <p className="text-sm mb-2">
                      <span className="font-medium">Total Days:</span> {attendanceData.totals.sickLeaveDays}
                    </p>
                    {sickLeaves.length > 0 ? (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {sickLeaves.map((rec) => (
                          <span
                            key={rec.id}
                            className="px-2 py-1 rounded-full bg-white text-secondary border border-accent/40"
                          >
                            {rec.date} ({rec.dayType})
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600">No sick leaves in this payroll cycle.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3">Daily Attendance Records</h2>
                  {attendanceData.records && attendanceData.records.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                      <table className="min-w-[700px] w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-secondary text-primary text-left uppercase tracking-wider">
                            <th className="py-2 px-3 rounded-l-xl">Date</th>
                            <th className="py-2 px-3">Day Type</th>
                            <th className="py-2 px-3">Status</th>
                            <th className="py-2 px-3">In Time</th>
                            <th className="py-2 px-3 rounded-r-xl">Out Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-accent/30">
                          {attendanceData.records.map((rec) => (
                            <tr key={rec.id} className="hover:bg-primary/70 transition-all ease-in-out">
                              <td className="py-2 px-3">{rec.date}</td>
                              <td className="py-2 px-3">
                                <span className="inline-flex px-2 py-1 rounded-full text-xs bg-primary/70 text-secondary">
                                  {rec.dayType}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                <span
                                  className={`inline-flex px-2 py-1 rounded-full text-xs ${
                                    rec.status === "Present"
                                      ? "bg-green-100 text-green-700"
                                      : rec.status === "No Pay"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {rec.status}
                                </span>
                              </td>
                              <td className="py-2 px-3">{formatTime(rec.checkInTime)}</td>
                              <td className="py-2 px-3">{formatTime(rec.checkOutTime)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">No attendance records found for this period.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
