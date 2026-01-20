import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Loader from "../../components/loader";
import toast from "react-hot-toast";

export default function AdminPayrollPage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [incentive, setIncentive] = useState("");
  const [payroll, setPayroll] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailPayroll, setDetailPayroll] = useState(null);
  const [detailAttendance, setDetailAttendance] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [allowances, setAllowances] = useState([]);
  const [deductions, setDeductions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in as admin to view payroll.");
      window.location.href = "/login";
      return;
    }

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/employees", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        const list = response.data.employees || [];
        setEmployees(list);

        const fromQuery = searchParams.get("employeeId");
        if (fromQuery && list.find((e) => e.employeeId === fromQuery)) {
          setSelectedEmployeeId(fromQuery);
        } else if (list.length > 0) {
          setSelectedEmployeeId(list[0].employeeId);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load employees for payroll");
      })
      .finally(() => {
        setInitialLoading(false);
      });
  }, [searchParams]);

  async function loadPayroll() {
    if (!selectedEmployeeId) {
      toast.error("Please select an employee");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in as admin to view payroll.");
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    setSearchParams({ employeeId: selectedEmployeeId });

    try {
      const { cleanAllowances, cleanDeductions } = buildCleanCustomItems();

      const [payrollRes, attendanceRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/payroll/employee/${selectedEmployeeId}` +
            `?year=${year}&month=${month}&incentive=${incentive || 0}` +
            `&allowances=${encodeURIComponent(JSON.stringify(cleanAllowances))}` +
            `&deductions=${encodeURIComponent(JSON.stringify(cleanDeductions))}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        ),
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/attendance/${selectedEmployeeId}` +
            `?year=${year}&month=${month}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        ),
      ]);

      setPayroll(payrollRes.data);
      setAttendanceSummary(attendanceRes.data);

      const backendAllowances =
        payrollRes.data?.payroll?.customAllowances &&
        Array.isArray(payrollRes.data.payroll.customAllowances)
          ? payrollRes.data.payroll.customAllowances
          : [];

      const backendDeductions =
        payrollRes.data?.payroll?.customDeductions &&
        Array.isArray(payrollRes.data.payroll.customDeductions)
          ? payrollRes.data.payroll.customDeductions
          : [];

      setAllowances(
        backendAllowances.map((item, index) => ({
          id: Date.now() + index + Math.random(),
          label: item.label || "",
          amount: item.amount != null ? String(item.amount) : "",
        }))
      );

      setDeductions(
        backendDeductions.map((item, index) => ({
          id: Date.now() + index + Math.random(),
          label: item.label || "",
          amount: item.amount != null ? String(item.amount) : "",
        }))
      );
      toast.success("Payroll loaded");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to load payroll for this employee"
      );
    } finally {
      setLoading(false);
    }
  }

  async function openHistoryDetails(item) {
    if (!selectedEmployeeId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in as admin to view payroll.");
      window.location.href = "/login";
      return;
    }

    setSelectedHistoryItem(item);
    setDetailModalOpen(true);
    setDetailLoading(true);
    setDetailPayroll(null);
    setDetailAttendance(null);

    try {
      const [payrollRes, attendanceRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/payroll/employee/${selectedEmployeeId}` +
            `?year=${item.year}&month=${item.month}&incentive=${item.incentive || 0}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        ),
        axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/attendance/${selectedEmployeeId}` +
            `?year=${item.year}&month=${item.month}`,
          {
            headers: { Authorization: "Bearer " + token },
          }
        ),
      ]);

      setDetailPayroll(payrollRes.data);
      setDetailAttendance(attendanceRes.data);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to load detailed payroll for this cycle"
      );
    } finally {
      setDetailLoading(false);
    }
  }
  async function refreshHistory() {
    if (!selectedEmployeeId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in as admin to view payroll.");
      window.location.href = "/login";
      return;
    }

    setHistoryLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/payroll/employee/${selectedEmployeeId}/history`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      setHistory(res.data.payrolls || []);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to load payroll history for this employee"
      );
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    refreshHistory();
  }, [selectedEmployeeId]);

  function formatCurrency(value) {
    if (value == null || value === "") return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return `Rs. ${num.toFixed(2)}`;
  }

  function addAllowanceRow() {
    setAllowances((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), label: "", amount: "" },
    ]);
  }

  function updateAllowanceRow(id, field, value) {
    setAllowances((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: field === "amount" ? value.replace(/[^0-9.\-]/g, "") : value,
            }
          : row
      )
    );
  }

  function removeAllowanceRow(id) {
    setAllowances((prev) => prev.filter((row) => row.id !== id));
  }

  function addDeductionRow() {
    setDeductions((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), label: "", amount: "" },
    ]);
  }

  function updateDeductionRow(id, field, value) {
    setDeductions((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: field === "amount" ? value.replace(/[^0-9.\-]/g, "") : value,
            }
          : row
      )
    );
  }

  function removeDeductionRow(id) {
    setDeductions((prev) => prev.filter((row) => row.id !== id));
  }

  function getAdditionalTotals() {
    const allowanceTotal = allowances.reduce((sum, row) => {
      const amount = parseFloat(row.amount);
      if (Number.isNaN(amount) || amount <= 0) return sum;
      return sum + amount;
    }, 0);

    const deductionTotal = deductions.reduce((sum, row) => {
      const amount = parseFloat(row.amount);
      if (Number.isNaN(amount) || amount <= 0) return sum;
      return sum + amount;
    }, 0);

    return {
      allowanceTotal: Number(allowanceTotal.toFixed(2)),
      deductionTotal: Number(deductionTotal.toFixed(2)),
    };
  }

  function buildCleanCustomItems() {
    const cleanAllowances = allowances
      .filter(
        (row) =>
          row &&
          String(row.label || "").trim() !== "" &&
          !Number.isNaN(parseFloat(row.amount))
      )
      .map((row) => ({
        label: String(row.label || "").trim(),
        amount: Number(parseFloat(row.amount || 0).toFixed(2)),
      }));

    const cleanDeductions = deductions
      .filter(
        (row) =>
          row &&
          String(row.label || "").trim() !== "" &&
          !Number.isNaN(parseFloat(row.amount))
      )
      .map((row) => ({
        label: String(row.label || "").trim(),
        amount: Number(parseFloat(row.amount || 0).toFixed(2)),
      }));

    return { cleanAllowances, cleanDeductions };
  }

  function buildPayslipHtml({ employee, payrollDetails, period, totals }) {
    const periodText =
      period && period.startDate && period.endDate
        ? `${period.startDate} to ${period.endDate}`
        : "";

    const baseSalaryStr = formatCurrency(payrollDetails.baseSalary);
    const normalOtHoursStr = Number(payrollDetails.normalOtHours ?? 0).toFixed(2);
    const normalOtRateStr = formatCurrency(payrollDetails.normalOtRate);
    const normalOtPayStr = formatCurrency(payrollDetails.normalOtPay);
    const holidayOtHoursStr = Number(payrollDetails.holidayOtHours ?? 0).toFixed(2);
    const holidayOtRateStr = formatCurrency(payrollDetails.holidayOtRate);
    const holidayOtPayStr = formatCurrency(payrollDetails.holidayOtPay);
    const noPayDeductionStr = formatCurrency(payrollDetails.noPayDeduction);
    const incentiveStr = formatCurrency(payrollDetails.incentive);
    const fullSalaryStr = formatCurrency(payrollDetails.fullSalary);
    const epfDeductionStr = formatCurrency(payrollDetails.epfDeduction);
    const netSalaryStr = formatCurrency(payrollDetails.netSalary);

    const slipAllowances =
      (Array.isArray(payrollDetails.customAllowances)
        ? payrollDetails.customAllowances
        : allowances.map((row) => ({
            label: row.label,
            amount: parseFloat(row.amount || 0),
          }))) || [];

    const slipDeductions =
      (Array.isArray(payrollDetails.customDeductions)
        ? payrollDetails.customDeductions
        : deductions.map((row) => ({
            label: row.label,
            amount: parseFloat(row.amount || 0),
          }))) || [];

    const allowanceTotal = slipAllowances.reduce((sum, item) => {
      const val = parseFloat(item.amount || 0);
      if (Number.isNaN(val)) return sum;
      return sum + val;
    }, 0);

    const deductionTotal = slipDeductions.reduce((sum, item) => {
      const val = parseFloat(item.amount || 0);
      if (Number.isNaN(val)) return sum;
      return sum + val;
    }, 0);

    const allowanceTotalStr = formatCurrency(allowanceTotal);
    const deductionTotalStr = formatCurrency(deductionTotal);

    const grossEarnings =
      Number(payrollDetails.baseSalary || 0) +
      Number(payrollDetails.otPay || 0) +
      Number(payrollDetails.incentive || 0);
    const grossEarningsStr = formatCurrency(grossEarnings);

    const workingHoursStr = totals ? Number(totals.workingHours || 0).toFixed(2) : "0.00";
    const otHoursStr = totals ? Number(totals.otHours || 0).toFixed(2) : "0.00";
    const annualLeaveDaysStr = totals ? totals.annualLeaveDays : 0;
    const sickLeaveDaysStr = totals ? totals.sickLeaveDays : 0;
    const noPayDaysStr = totals ? totals.noPayDays : 0;

    const allowanceRowsHtml =
      slipAllowances.length > 0
        ? slipAllowances
            .map((item) => {
              const label = (item.label || "Custom Allowance").toString();
              const amountStr = formatCurrency(item.amount || 0);
              return `\n            <tr>\n              <td>${label}</td>\n              <td class="text-right">${amountStr}</td>\n            </tr>`;
            })
            .join("")
        : "";

    const deductionRowsHtml =
      slipDeductions.length > 0
        ? slipDeductions
            .map((item) => {
              const label = (item.label || "Custom Deduction").toString();
              const amountStr = formatCurrency(item.amount || 0);
              return `\n            <tr>\n              <td>${label}</td>\n              <td class="text-right">${amountStr}</td>\n            </tr>`;
            })
            .join("")
        : "";

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Payslip - ${employee.employeeId}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
      .payslip-container { max-width: 800px; margin: 0 auto; border: 1px solid #ccc; padding: 24px; }
      .header { text-align: center; margin-bottom: 20px; }
      .header h1 { margin: 0; font-size: 22px; text-transform: uppercase; }
      .header h2 { margin: 4px 0 0; font-size: 16px; font-weight: normal; }
      .section-title { font-weight: bold; margin-top: 16px; margin-bottom: 8px; text-decoration: underline; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
      th, td { padding: 6px 8px; font-size: 13px; }
      .table-bordered th, .table-bordered td { border: 1px solid #ccc; }
      .text-right { text-align: right; }
      .text-left { text-align: left; }
      .summary-row { font-weight: bold; background-color: #f8f8f8; }
      .footer { margin-top: 24px; font-size: 12px; }
      .sign-row { margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; }
      .sign-box { width: 45%; text-align: center; }
      .sign-line { border-top: 1px solid #000; margin-top: 32px; padding-top: 4px; }
    </style>
  </head>
  <body>
    <div class="payslip-container">
      <div class="header">
        <h1>Pay Slip</h1>
        <h2>Employee Management System</h2>
      </div>

      <div>
        <div class="section-title">Employee Details</div>
        <table>
          <tr>
            <td><strong>Employee ID:</strong> ${employee.employeeId}</td>
            <td><strong>Name:</strong> ${employee.firstName || ""} ${employee.lastName || ""}</td>
          </tr>
          <tr>
            <td><strong>Pay Period:</strong> ${period ? `${period.year}-${String(period.month).padStart(2, "0")}` : ""}</td>
            <td><strong>Designation:</strong> ${employee.role || ""}</td>
          </tr>
          <tr>
            <td colspan="2"><strong>Cycle:</strong> ${periodText}</td>
          </tr>
        </table>
      </div>

      <div>
        <div class="section-title">Earnings</div>
        <table class="table-bordered">
          <thead>
            <tr>
              <th class="text-left">Description</th>
              <th class="text-right">Amount (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Base Salary</td>
              <td class="text-right">${baseSalaryStr}</td>
            </tr>
            <tr>
              <td>Normal OT (${normalOtHoursStr} hrs @ ${normalOtRateStr})</td>
              <td class="text-right">${normalOtPayStr}</td>
            </tr>
            <tr>
              <td>Holiday OT (${holidayOtHoursStr} hrs @ ${holidayOtRateStr})</td>
              <td class="text-right">${holidayOtPayStr}</td>
            </tr>
            <tr>
              <td>Incentive</td>
              <td class="text-right">${incentiveStr}</td>
            </tr>
            ${allowanceRowsHtml}
            <tr class="summary-row">
              <td>Gross Earnings (Base + OT + Incentive)</td>
              <td class="text-right">${grossEarningsStr}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div class="section-title">Deductions & Net Pay</div>
        <table class="table-bordered">
          <thead>
            <tr>
              <th class="text-left">Description</th>
              <th class="text-right">Amount (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>No Pay Deduction</td>
              <td class="text-right">${noPayDeductionStr}</td>
            </tr>
            <tr>
              <td>EPF Deduction</td>
              <td class="text-right">${epfDeductionStr}</td>
            </tr>
            ${deductionRowsHtml}
            <tr>
              <td><strong>Salary Before EPF</strong></td>
              <td class="text-right"><strong>${fullSalaryStr}</strong></td>
            </tr>
            <tr class="summary-row">
              <td><strong>Net Salary (Take Home)</strong></td>
              <td class="text-right"><strong>${netSalaryStr}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div class="section-title">Attendance Summary (Cycle)</div>
        <table class="table-bordered">
          <tbody>
            <tr>
              <td>Total Working Hours</td>
              <td class="text-right">${workingHoursStr}</td>
            </tr>
            <tr>
              <td>Total OT Hours</td>
              <td class="text-right">${otHoursStr}</td>
            </tr>
            <tr>
              <td>Annual Leave Days</td>
              <td class="text-right">${annualLeaveDaysStr}</td>
            </tr>
            <tr>
              <td>Sick Leave Days</td>
              <td class="text-right">${sickLeaveDaysStr}</td>
            </tr>
            <tr>
              <td>No Pay Days</td>
              <td class="text-right">${noPayDaysStr}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="sign-row">
        <div class="sign-box">
          <div class="sign-line">Employee Signature</div>
        </div>
        <div class="sign-box">
          <div class="sign-line">Authorized Signature</div>
        </div>
      </div>

      <div class="footer">
        This is a system-generated payslip based on the current payroll and attendance records.
      </div>
    </div>
  </body>
</html>`;
  }

  function openPayslipWindow(html) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow pop-ups to download the paysheet.");
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  function downloadPayslipToDevice(html, employee, period) {
    const year = period?.year ?? new Date().getFullYear();
    const month = period?.month ?? new Date().getMonth() + 1;
    const safeId = employee?.employeeId || "employee";
    const filename = `payslip-${safeId}-${year}-${String(month).padStart(2, "0")}.html`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleSaveSalary() {
    if (!selectedEmployeeId) {
      toast.error("Please select an employee");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in as admin to save payroll.");
      window.location.href = "/login";
      return;
    }

    const { cleanAllowances, cleanDeductions } = buildCleanCustomItems();

    const url =
      `${import.meta.env.VITE_BACKEND_URL}/payroll/employee/${selectedEmployeeId}` +
      `?year=${year}&month=${month}&incentive=${incentive || 0}&finalize=true` +
      `&allowances=${encodeURIComponent(JSON.stringify(cleanAllowances))}` +
      `&deductions=${encodeURIComponent(JSON.stringify(cleanDeductions))}`;

    axios
      .get(url, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        const data = res.data;
        const payrollDetails = data?.payroll || null;

        if (!payrollDetails) {
          toast.error("Failed to save salary. Please try again.");
          return;
        }

        setPayroll(data);

        const backendAllowances =
          payrollDetails.customAllowances &&
          Array.isArray(payrollDetails.customAllowances)
            ? payrollDetails.customAllowances
            : [];
        const backendDeductions =
          payrollDetails.customDeductions &&
          Array.isArray(payrollDetails.customDeductions)
            ? payrollDetails.customDeductions
            : [];

        setAllowances(
          backendAllowances.map((item, index) => ({
            id: Date.now() + index + Math.random(),
            label: item.label || "",
            amount: item.amount != null ? String(item.amount) : "",
          }))
        );

        setDeductions(
          backendDeductions.map((item, index) => ({
            id: Date.now() + index + Math.random(),
            label: item.label || "",
            amount: item.amount != null ? String(item.amount) : "",
          }))
        );

        toast.success("Salary saved successfully");
        // Refresh history so the Past Payroll Cycles table reflects latest DB values
        refreshHistory();
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          err?.response?.data?.message ||
            "Failed to save salary. Please check the data and try again."
        );
      });
  }

  function handleDownloadPaysheet() {
    if (!selectedEmployeeId) {
      toast.error("Please select an employee");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in as admin to download payroll.");
      window.location.href = "/login";
      return;
    }

    const { cleanAllowances, cleanDeductions } = buildCleanCustomItems();

    const url =
      `${import.meta.env.VITE_BACKEND_URL}/payroll/employee/${selectedEmployeeId}` +
      `?year=${year}&month=${month}&incentive=${incentive || 0}&finalize=true` +
      `&allowances=${encodeURIComponent(JSON.stringify(cleanAllowances))}` +
      `&deductions=${encodeURIComponent(JSON.stringify(cleanDeductions))}`;

    axios
      .get(url, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        const data = res.data;
        const employee = data?.employee || null;
        const payrollDetails = data?.payroll || null;
        const period = data?.period || attendanceSummary?.period || null;
        const totals = attendanceSummary?.totals || null;

        if (!employee || !payrollDetails) {
          toast.error("Failed to generate paysheet. Please try again.");
          return;
        }

        // Keep local state in sync with saved values
        setPayroll(data);
        const backendAllowances =
          payrollDetails?.customAllowances && Array.isArray(payrollDetails.customAllowances)
            ? payrollDetails.customAllowances
            : [];
        const backendDeductions =
          payrollDetails?.customDeductions && Array.isArray(payrollDetails.customDeductions)
            ? payrollDetails.customDeductions
            : [];

        setAllowances(
          backendAllowances.map((item, index) => ({
            id: Date.now() + index + Math.random(),
            label: item.label || "",
            amount: item.amount != null ? String(item.amount) : "",
          }))
        );

        setDeductions(
          backendDeductions.map((item, index) => ({
            id: Date.now() + index + Math.random(),
            label: item.label || "",
            amount: item.amount != null ? String(item.amount) : "",
          }))
        );

        const html = buildPayslipHtml({ employee, payrollDetails, period, totals });
        downloadPayslipToDevice(html, employee, period);
        // After finalizing and downloading, refresh history from the database
        refreshHistory();
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          err?.response?.data?.message ||
            "Failed to refresh payroll before downloading the paysheet"
        );
      });
  }

  function handleDownloadPaysheetFromDetail() {
    const employee = detailPayroll?.employee || null;
    const payrollDetails = detailPayroll?.payroll || null;
    const period = detailPayroll?.period || detailAttendance?.period || null;
    const totals = detailAttendance?.totals || null;

    if (!employee || !payrollDetails) {
      toast.error("Details not loaded yet.");
      return;
    }

    const html = buildPayslipHtml({ employee, payrollDetails, period, totals });
    downloadPayslipToDevice(html, employee, period);
  }

  const employee = payroll?.employee || null;
  const payrollDetails = payroll?.payroll || null;
  const totals = attendanceSummary?.totals || null;
  const period = payroll?.period || attendanceSummary?.period || null;

  const { allowanceTotal, deductionTotal } = getAdditionalTotals();

  return (
    <div className="w-full min-h-screen flex justify-center px-4 py-6 sm:px-6 md:px-10 bg-primary text-secondary custom-scrollbar">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-4 sm:p-6 md:p-8 overflow-hidden custom-scrollbar">
        <h1 className="text-3xl font-semibold mb-6 tracking-wide text-secondary">
          Payroll Dashboard
        </h1>

        {initialLoading ? (
          <Loader />
        ) : (
          <>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Employee</label>
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
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Year</label>
                <input
                  type="number"
                  className="w-full h-[40px] rounded-2xl border border-accent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Month (cycle ends on 21st)</label>
                <select
                  className="w-full h-[40px] rounded-2xl border border-accent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                    <option key={m} value={m}>
                      {m.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
              {/* <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Incentive (Rs)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full h-[40px] rounded-2xl border border-accent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  value={incentive}
                  onChange={(e) => setIncentive(e.target.value)}
                  placeholder="0"
                />
              </div> */}
            </div>

            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <button
                onClick={loadPayroll}
                disabled={loading}
                className="w-full md:w-auto px-6 h-[44px] bg-black text-white rounded-2xl hover:bg-accent/90 disabled:opacity-60"
              >
                {loading ? "Loading..." : "Load Payroll"}
              </button>
            </div>

            {loading && !initialLoading && <Loader />}

            {payrollDetails && (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <div className="bg-primary/80 text-secondary rounded-2xl p-4 shadow-lg">
                  <h2 className="text-xl font-semibold mb-3">Employee & Period</h2>
                  {employee && (
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-semibold">ID:</span> {employee.employeeId}
                      </p>
                      <p>
                        <span className="font-semibold">Name:</span> {employee.firstName} {" "}
                        {employee.lastName}
                      </p>
                    </div>
                  )}
                  {period && (
                    <div className="text-sm space-y-1 mt-3">
                      <p>
                        <span className="font-semibold">Year:</span> {period.year}
                      </p>
                      <p>
                        <span className="font-semibold">Month:</span> {period.month}
                      </p>
                      {period.startDate && period.endDate && (
                        <p>
                          <span className="font-semibold">Cycle:</span> {period.startDate} to {" "}
                          {period.endDate}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-primary/80 text-secondary rounded-2xl p-4 shadow-lg">
                  <h2 className="text-xl font-semibold mb-3">Salary Breakdown</h2>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-semibold">Base Salary:</span> {" "}
                      {formatCurrency(payrollDetails.baseSalary)}
                    </p>
                    <p>
                      <span className="font-semibold">Normal OT Hours:</span> {" "}
                      {payrollDetails.normalOtHours ?? 0}
                    </p>
                    <p>
                      <span className="font-semibold">Normal OT Rate:</span> {" "}
                      {formatCurrency(payrollDetails.normalOtRate)}
                    </p>
                    <p>
                      <span className="font-semibold">Normal OT Pay:</span> {" "}
                      {formatCurrency(payrollDetails.normalOtPay)}
                    </p>
                    <p>
                      <span className="font-semibold">Holiday OT Hours:</span> {" "}
                      {payrollDetails.holidayOtHours ?? 0}
                    </p>
                    <p>
                      <span className="font-semibold">Holiday OT Rate:</span> {" "}
                      {formatCurrency(payrollDetails.holidayOtRate)}
                    </p>
                    <p>
                      <span className="font-semibold">Holiday OT Pay:</span> {" "}
                      {formatCurrency(payrollDetails.holidayOtPay)}
                    </p>
                    <p>
                      <span className="font-semibold">Total OT Pay:</span> {" "}
                      {formatCurrency(payrollDetails.otPay)}
                    </p>
                    <p>
                      <span className="font-semibold">No Pay Deduction:</span> {" "}
                      {formatCurrency(payrollDetails.noPayDeduction)}
                    </p>
                    <p>
                      <span className="font-semibold">Full Salary (before EPF):</span> {" "}
                      {formatCurrency(payrollDetails.fullSalary)}
                    </p>
                    <p>
                      <span className="font-semibold">EPF Deduction (12%):</span> {" "}
                      {formatCurrency(payrollDetails.epfDeduction)}
                    </p>
                    <p>
                      <span className="font-semibold">Incentive:</span> {" "}
                      {formatCurrency(payrollDetails.incentive)}
                    </p>
                    <p className="mt-2 font-semibold">
                      Net Salary (Take Home): {formatCurrency(payrollDetails.netSalary)}
                    </p>
                    <div className="mt-4 border-t border-accent/40 pt-3 space-y-1">
                      <p className="font-semibold text-sm">Additional Allowances</p>
                      {allowances.length === 0 && (
                        <p className="text-xs text-gray-700">No additional allowances added.</p>
                      )}
                      {allowances.map((row) => (
                        <div
                          key={row.id}
                          className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mb-1"
                        >
                          <input
                            type="text"
                            className="flex-1 rounded-xl border border-accent px-2 py-1 text-xs bg-white text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
                            placeholder="Allowance name"
                            value={row.label}
                            onChange={(e) =>
                              updateAllowanceRow(row.id, "label", e.target.value)
                            }
                          />
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-32 rounded-xl border border-accent px-2 py-1 text-xs bg-white text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
                            placeholder="Amount"
                            value={row.amount}
                            onChange={(e) =>
                              updateAllowanceRow(row.id, "amount", e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="text-xs text-red-600 hover:text-red-800"
                            onClick={() => removeAllowanceRow(row.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <div className="flex justify-between items-center mt-2">
                        <button
                          type="button"
                          className="px-3 py-1 rounded-xl bg-white text-black border border-accent text-xs hover:bg-primary/60"
                          onClick={addAllowanceRow}
                        >
                          + Add Allowance
                        </button>
                        <span className="text-xs font-semibold">
                          Total: {formatCurrency(allowanceTotal)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-accent/40 pt-3 space-y-1">
                      <p className="font-semibold text-sm">Additional Deductions</p>
                      {deductions.length === 0 && (
                        <p className="text-xs text-gray-700">No additional deductions added.</p>
                      )}
                      {deductions.map((row) => (
                        <div
                          key={row.id}
                          className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mb-1"
                        >
                          <input
                            type="text"
                            className="flex-1 rounded-xl border border-accent px-2 py-1 text-xs bg-white text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
                            placeholder="Deduction name"
                            value={row.label}
                            onChange={(e) =>
                              updateDeductionRow(row.id, "label", e.target.value)
                            }
                          />
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-32 rounded-xl border border-accent px-2 py-1 text-xs bg-white text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
                            placeholder="Amount"
                            value={row.amount}
                            onChange={(e) =>
                              updateDeductionRow(row.id, "amount", e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="text-xs text-red-600 hover:text-red-800"
                            onClick={() => removeDeductionRow(row.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <div className="flex justify-between items-center mt-2">
                        <button
                          type="button"
                          className="px-3 py-1 rounded-xl bg-white text-black border border-accent text-xs hover:bg-primary/60"
                          onClick={addDeductionRow}
                        >
                          + Add Deduction
                        </button>
                        <span className="text-xs font-semibold">
                          Total: {formatCurrency(deductionTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {totals && (
                  <div className="bg-primary/80 text-secondary rounded-2xl p-4 shadow-lg">
                    <h2 className="text-xl font-semibold mb-3">Attendance Summary</h2>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-semibold">Working Hours:</span> {" "}
                        {totals.workingHours}
                      </p>
                      <p>
                        <span className="font-semibold">OT Hours:</span> {" "}
                        {totals.otHours}
                      </p>
                      <p>
                        <span className="font-semibold">Annual Leave Days:</span> {" "}
                        {totals.annualLeaveDays}
                      </p>
                      <p>
                        <span className="font-semibold">Sick Leave Days:</span> {" "}
                        {totals.sickLeaveDays}
                      </p>
                      <p>
                        <span className="font-semibold">No Pay Days:</span> {" "}
                        {totals.noPayDays}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {payrollDetails && (
              <div className="w-full flex justify-end gap-3 mt-4">
                <button
                  onClick={handleSaveSalary}
                  disabled={!payrollDetails}
                  className="px-6 h-[44px] bg-black text-white border border-accent rounded-2xl hover:bg-accent/90 disabled:opacity-60"
                >
                  Save Salary
                </button>
                <button
                  onClick={handleDownloadPaysheet}
                  disabled={!payrollDetails}
                  className="px-6 h-[44px] bg-white text-black border border-accent rounded-2xl hover:bg-primary/60 disabled:opacity-60"
                >
                  Download Paysheet
                </button>
              </div>
            )}

            {selectedEmployeeId && (
              <div className="w-full mt-8 bg-primary/80 text-secondary rounded-2xl p-4 shadow-lg overflow-x-auto">
                <h2 className="text-xl font-semibold mb-3">
                  Past Payroll Cycles
                </h2>
                {historyLoading ? (
                  <Loader />
                ) : history && history.length > 0 ? (
                  <table className="min-w-[800px] w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-secondary text-primary text-left uppercase tracking-wider">
                        <th className="py-2 px-3">Year</th>
                        <th className="py-2 px-3">Month</th>
                        <th className="py-2 px-3">Cycle</th>
                        <th className="py-2 px-3">Full Salary</th>
                        <th className="py-2 px-3">EPF (8%)</th>
                        <th className="py-2 px-3">Final Salary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-accent/30">
                      {history.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-primary/70 cursor-pointer"
                          onClick={() => openHistoryDetails(item)}
                        >
                          <td className="py-2 px-3">{item.year}</td>
                          <td className="py-2 px-3">{item.month}</td>
                          <td className="py-2 px-3">
                            {item.periodStart} - {item.periodEnd}
                          </td>
                          <td className="py-2 px-3">
                            {formatCurrency(item.fullSalary)}
                          </td>
                          <td className="py-2 px-3">
                            {formatCurrency(item.epfDeduction)}
                          </td>
                          <td className="py-2 px-3 font-semibold text-gold">
                            {formatCurrency(item.netSalary)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm">No past payroll records found for this employee.</p>
                )}
              </div>
            )}

            {detailModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white text-secondary rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative">
                  <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                    onClick={() => setDetailModalOpen(false)}
                  >
                    ×
                  </button>

                  <h2 className="text-2xl font-semibold mb-4">Payroll Cycle Details</h2>

                  {detailLoading || !detailPayroll || !detailAttendance ? (
                    <div className="flex justify-center items-center py-6">
                      <Loader />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-primary/80 rounded-2xl p-4 text-sm">
                          <h3 className="font-semibold text-lg mb-2">Employee & Period</h3>
                          <p>
                            <span className="font-semibold">ID:</span>{" "}
                            {detailPayroll.employee?.employeeId}
                          </p>
                          <p>
                            <span className="font-semibold">Name:</span>{" "}
                            {detailPayroll.employee?.firstName} {" "}
                            {detailPayroll.employee?.lastName}
                          </p>
                          {selectedHistoryItem && (
                            <>
                              <p className="mt-2">
                                <span className="font-semibold">Year/Month:</span>{" "}
                                {selectedHistoryItem.year} / {selectedHistoryItem.month}
                              </p>
                              <p>
                                <span className="font-semibold">Cycle:</span>{" "}
                                {selectedHistoryItem.periodStart} - {selectedHistoryItem.periodEnd}
                              </p>
                            </>
                          )}
                        </div>

                        <div className="bg-primary/80 rounded-2xl p-4 text-sm">
                          <h3 className="font-semibold text-lg mb-2">Salary</h3>
                          <p>
                            <span className="font-semibold">Base Salary:</span>{" "}
                            {formatCurrency(detailPayroll.payroll?.baseSalary)}
                          </p>
                          <p>
                            <span className="font-semibold">Normal OT Hours:</span>{" "}
                            {detailPayroll.payroll?.normalOtHours ?? 0}
                          </p>
                          <p>
                            <span className="font-semibold">Normal OT Rate:</span>{" "}
                            {formatCurrency(detailPayroll.payroll?.normalOtRate)}
                          </p>
                          <p>
                            <span className="font-semibold">Normal OT Pay:</span>{" "}
                            {formatCurrency(detailPayroll.payroll?.normalOtPay)}
                          </p>
                          <p>
                            <span className="font-semibold">Holiday OT Hours:</span>{" "}
                            {detailPayroll.payroll?.holidayOtHours ?? 0}
                          </p>
                          <p>
                            <span className="font-semibold">Holiday OT Rate:</span>{" "}
                            {formatCurrency(detailPayroll.payroll?.holidayOtRate)}
                          </p>
                          <p>
                            <span className="font-semibold">Holiday OT Pay:</span>{" "}
                            {formatCurrency(detailPayroll.payroll?.holidayOtPay)}
                          </p>
                          <p>
                            <span className="font-semibold">Total OT Pay:</span>{" "}
                            {formatCurrency(detailPayroll.payroll?.otPay)}
                          </p>
                          <p>
                            <span className="font-semibold">No Pay Deduction:</span>{" "}
                            {formatCurrency(detailPayroll.payroll?.noPayDeduction)}
                          </p>
                          <p>
                            <span className="font-semibold">Incentive:</span>{" "}
                            {formatCurrency(detailPayroll.payroll?.incentive)}
                          </p>
                          <p>
                            <span className="font-semibold">Full Salary (before EPF):</span>{" "}
                            {formatCurrency(detailPayroll.payroll?.fullSalary)}
                          </p>
                          <p>
                            <span className="font-semibold">EPF (8%):</span>{" "}
                            {formatCurrency(detailPayroll.payroll?.epfDeduction)}
                          </p>
                          <p className="mt-2 font-bold text-gold">
                            Final Salary (after EPF): {" "}
                            {formatCurrency(detailPayroll.payroll?.netSalary)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-primary/80 rounded-2xl p-4 text-sm">
                        <h3 className="font-semibold text-lg mb-2">Attendance Summary</h3>
                        <p>
                          <span className="font-semibold">Working Hours:</span>{" "}
                          {detailAttendance.totals?.workingHours}
                        </p>
                        <p>
                          <span className="font-semibold">OT Hours:</span>{" "}
                          {detailAttendance.totals?.otHours}
                        </p>
                        <p>
                          <span className="font-semibold">Annual Leave Days:</span>{" "}
                          {detailAttendance.totals?.annualLeaveDays}
                        </p>
                        <p>
                          <span className="font-semibold">Sick Leave Days:</span>{" "}
                          {detailAttendance.totals?.sickLeaveDays}
                        </p>
                        <p>
                          <span className="font-semibold">No Pay Days:</span>{" "}
                          {detailAttendance.totals?.noPayDays}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="mt-4 flex justify-end">
                    <button
                      className="px-4 py-2 rounded-2xl bg-white text-black border border-accent hover:bg-primary/60 mr-2"
                      onClick={handleDownloadPaysheetFromDetail}
                    >
                      Download Paysheet
                    </button>
                    <button
                      className="px-4 py-2 rounded-2xl bg-black text-white hover:bg-accent/90"
                      onClick={() => setDetailModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
