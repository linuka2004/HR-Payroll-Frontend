import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/loader";

export default function AdminAttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [workingHours, setWorkingHours] = useState("");
  const [status, setStatus] = useState("Present");
  const [dayType, setDayType] = useState(() => {
    const today = new Date();
    return today.getDay() === 0 ? "Sunday" : "Normal";
  });
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

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

  useEffect(() => {
    // When date changes, set a sensible default for day type
    if (!date) return;
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return;
    const isSunday = parsed.getDay() === 0;
    setDayType(isSunday ? "Sunday" : "Normal");
  }, [date]);

  useEffect(() => {
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedEmployeeId) {
      toast.error("Please select an employee");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    let hours = null;
    if (status === "Present") {
      hours = Number(workingHours);
      if (!workingHours || Number.isNaN(hours) || hours < 0) {
        toast.error("Please enter a valid number of working hours");
        return;
      }
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attendance/${selectedEmployeeId}`,
        {
          date,
          status,
          dayType,
          ...(status === "Present" ? { workingHours: hours } : {}),
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Attendance recorded successfully");
      // Keep date/employee; just clear hours for quick multiple entries
      setWorkingHours("");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to record attendance"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleExcelUpload() {
    if (!selectedEmployeeId) {
      toast.error("Please select an employee");
      return;
    }

    if (!excelFile) {
      toast.error("Please choose an Excel file to upload");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      setUploadingExcel(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attendance/${selectedEmployeeId}/upload-excel`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const msg = res?.data?.message || "Attendance Excel uploaded successfully";
      toast.success(msg);
      setExcelFile(null);
      setFileInputKey((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to upload attendance Excel file"
      );
    } finally {
      setUploadingExcel(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center px-4 py-6 sm:px-6 md:px-10 bg-primary text-secondary custom-scrollbar">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-4 sm:p-6 md:p-8 overflow-hidden">
        <h1 className="text-3xl font-semibold mb-6 tracking-wide text-secondary">
          Record Attendance
        </h1>

        {loadingEmployees ? (
          <Loader />
        ) : employees.length === 0 ? (
          <p className="text-sm text-red-600">
            No employees found. Please add employees first.
          </p>
        ) : (
          <>
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                className="w-full h-[40px] rounded-2xl border border-accent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Day Type</label>
              <select
                className="w-full h-[40px] rounded-2xl border border-accent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                value={dayType}
                onChange={(e) => setDayType(e.target.value)}
              >
                <option value="Normal">Normal Working Day</option>
                <option value="Sunday">Sunday</option>
                <option value="MercantileHoliday">Mercantile Holiday</option>
              </select>
              <p className="text-xs text-gray-500">
                Choose whether this date is a normal day, a Sunday, or a mercantile holiday.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full h-[40px] rounded-2xl border border-accent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Present">Present</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="No Pay">No Pay</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Working Hours</label>
              <input
                type="number"
                min="0"
                step="0.25"
                className="w-full h-[40px] rounded-2xl border border-accent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder={status === "Present" ? "e.g. 8 or 8.5" : "Not required for leave"}
                disabled={status !== "Present"}
              />
              {status === "Present" ? (
                <p className="text-xs text-gray-500">
                  OT is calculated automatically when working hours exceed 8.
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Working hours are not needed for Annual/Sick/No Pay leave.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-[44px] bg-black text-white rounded-2xl hover:bg-accent/90 disabled:opacity-60 mt-2"
            >
              {submitting ? "Saving..." : "Save Attendance"}
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-accent/20 space-y-3">
            <h2 className="text-lg font-semibold">Upload Monthly Attendance (Excel)</h2>
            <p className="text-xs text-gray-600">
              Select an Excel file containing this employee&apos;s attendance for a month.
              Required columns in the first row: <strong>date</strong>, <strong>day type</strong>,
              <strong>status</strong>, <strong>in time</strong>, <strong>out time</strong>.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                key={fileInputKey}
                type="file"
                accept=".xlsx,.xls"
                className="text-sm"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  setExcelFile(file || null);
                }}
              />
              <button
                type="button"
                onClick={handleExcelUpload}
                disabled={uploadingExcel}
                className="px-4 h-[40px] bg-black text-white rounded-2xl hover:bg-accent/90 disabled:opacity-60"
              >
                {uploadingExcel ? "Uploading..." : "Upload Excel"}
              </button>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
