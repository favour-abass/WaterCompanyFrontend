import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FiUserPlus,
  FiShield,
  FiAlertTriangle,
  FiCheckCircle,
  FiUsers,
  FiSettings,
  FiClock,
  FiX,
} from "react-icons/fi";

const Admin = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PRODUCER");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeBatches: 0,
    pendingReports: 0,
  });
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]); // NEW: Store all reports for counting
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [adminNotes, setAdminNotes] = useState({});

  useEffect(() => {
    if (user?.token) {
      fetchStats();
      fetchAllReports(); // NEW: Always fetch all reports for counts
      fetchReports(activeTab);
    }
  }, [user, activeTab]);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/stats", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  // NEW: Fetch all reports for count calculation
  const fetchAllReports = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/reports", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setAllReports(data);
      }
    } catch (err) {
      console.error("Failed to fetch all reports:", err);
    }
  };

  const fetchReports = async (status = "PENDING") => {
    try {
      const url =
        status === "ALL"
          ? "http://localhost:3000/admin/reports"
          : `http://localhost:3000/admin/reports?status=${status}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  const createUser = async () => {
    if (!username || !email || !password) {
      setMessage("❌ Name, email and password are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: username,
          email: email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      setMessage(`✅ User ${username} with role ${role} created successfully!`);
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("PRODUCER");

      fetchStats();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const body = { status: newStatus };

      if (adminNotes[reportId]?.trim()) {
        body.admin_notes = adminNotes[reportId];
      }

      const res = await fetch(
        `http://localhost:3000/admin/reports/${reportId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(body),
        },
      );

      if (res.ok) {
        setAdminNotes((prev) => {
          const updated = { ...prev };
          delete updated[reportId];
          return updated;
        });

        // Refresh all data
        fetchStats();
        fetchAllReports(); // NEW: Refresh counts
        fetchReports(activeTab);
      }
    } catch (err) {
      console.error("Failed to update report:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-red-100 border-red-200 text-red-800";
      case "INVESTIGATING":
        return "bg-yellow-100 border-yellow-200 text-yellow-800";
      case "RESOLVED":
        return "bg-green-100 border-green-200 text-green-800";
      case "DISMISSED":
        return "bg-gray-100 border-gray-200 text-gray-800";
      default:
        return "bg-gray-100 border-gray-200 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <FiAlertTriangle className="text-red-600" />;
      case "INVESTIGATING":
        return <FiClock className="text-yellow-600" />;
      case "RESOLVED":
        return <FiCheckCircle className="text-green-600" />;
      case "DISMISSED":
        return <FiX className="text-gray-600" />;
      default:
        return <FiAlertTriangle />;
    }
  };

  // UPDATED: Calculate counts from allReports
  const tabs = [
    {
      id: "PENDING",
      label: "Pending",
      count: allReports.filter((r) => r.status === "PENDING").length,
    },
    {
      id: "INVESTIGATING",
      label: "Investigating",
      count: allReports.filter((r) => r.status === "INVESTIGATING").length,
    },
    {
      id: "RESOLVED",
      label: "Resolved",
      count: allReports.filter((r) => r.status === "RESOLVED").length,
    },
    {
      id: "DISMISSED",
      label: "Dismissed",
      count: allReports.filter((r) => r.status === "DISMISSED").length,
    },
    {
      id: "ALL",
      label: "All Reports",
      count: allReports.length,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiShield className="text-2xl text-purple-700" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-blue-900">
                Admin Dashboard
              </h2>
              <p className="text-gray-600">
                Manage users and monitor system activity
              </p>
            </div>
          </div>
        </div>

        {/* System Stats Card */}
        <div className="mb-6 bg-linear-to-r from-blue-900 to-blue-800 rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FiShield />
            System Overview
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-blue-200 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold text-blue-300">
                {stats.totalUsers}
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-blue-200 text-sm mb-1">Active Batches</p>
              <p className="text-3xl font-bold text-blue-300">
                {stats.activeBatches}
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-blue-200 text-sm mb-1">Pending Reports</p>
              <p className="text-3xl font-bold text-blue-300">
                {stats.pendingReports}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Create User Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
            <h3 className="text-xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
              <FiUserPlus />
              Create New User
            </h3>

            <div className="space-y-5">
              {/* Username Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <div className="relative">
                  <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg pl-10 pr-4 py-3 transition-colors"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg px-4 py-3 transition-colors"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg px-4 py-3 transition-colors"
                />
              </div>

              {/* Role Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Role
                </label>
                <div className="relative">
                  <FiSettings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg pl-10 pr-4 py-3 transition-colors appearance-none bg-white cursor-pointer"
                  >
                    <option value="PRODUCER">Producer</option>
                    <option value="INSPECTOR">Inspector</option>
                    <option value="DISTRIBUTOR">Distributor</option>
                  </select>
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={createUser}
                disabled={loading}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 text-lg"
              >
                <FiUserPlus className="text-xl" />
                <span>{loading ? "Creating..." : "Create User"}</span>
              </button>
            </div>

            {/* Success/Error Message */}
            {message && (
              <div
                className={`mt-5 ${message.startsWith("✅") ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border rounded-lg p-4`}
              >
                <div className="flex items-start gap-3">
                  {message.startsWith("✅") ? (
                    <FiCheckCircle className="text-xl text-green-600 mt-0.5 shrink-0" />
                  ) : (
                    <FiAlertTriangle className="text-xl text-red-600 mt-0.5 shrink-0" />
                  )}
                  <p
                    className={`${message.startsWith("✅") ? "text-green-800" : "text-red-800"} font-medium`}
                  >
                    {message}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Reports Management Card */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-blue-100">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <FiAlertTriangle />
                Water Quality Reports Management
              </h3>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-900 text-blue-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tab.label}
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-white bg-opacity-20 text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reports List */}
            <div className="p-6">
              <div className="max-h-150 overflow-y-auto space-y-4">
                {reports.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                      <FiCheckCircle className="text-4xl text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-2">
                      No {activeTab.toLowerCase()} reports
                    </p>
                    <p className="text-sm text-gray-500">
                      {activeTab === "PENDING"
                        ? "All reports have been addressed"
                        : `No reports in ${activeTab.toLowerCase()} status`}
                    </p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <div
                      key={report.id}
                      className={`border rounded-lg p-4 ${getStatusColor(report.status)}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(report.status)}
                            <p className="font-semibold text-sm">
                              Report #{report.id}
                            </p>
                            <span className="text-xs px-2 py-1 rounded bg-white bg-opacity-50">
                              {report.status}
                            </span>
                          </div>
                          <p className="font-mono text-xs text-gray-700">
                            Batch: {report.batch_no || "Not specified"}
                          </p>
                          {report.serial_code && (
                            <p className="font-mono text-xs text-gray-700">
                              Serial: {report.serial_code}
                            </p>
                          )}
                          <p className="text-xs text-gray-600 mt-1">
                            Reported by:{" "}
                            {report.reported_by_name || "Anonymous"}
                          </p>
                          {report.reported_by_email && (
                            <p className="text-xs text-gray-600">
                              Email: {report.reported_by_email}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(report.reported_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white bg-opacity-50 rounded p-3 mb-3">
                        <p className="text-sm font-medium mb-1">
                          Issue Description:
                        </p>
                        <p className="text-sm text-gray-700">{report.reason}</p>
                      </div>

                      {report.admin_notes && (
                        <div className="bg-blue-50 rounded p-3 mb-3">
                          <p className="text-xs font-medium text-blue-900 mb-1">
                            Admin Notes:
                          </p>
                          <p className="text-sm text-gray-700">
                            {report.admin_notes}
                          </p>
                          {report.resolved_by_name && (
                            <p className="text-xs text-gray-600 mt-1">
                              Resolved by: {report.resolved_by_name}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Admin Notes Input (only for active reports) */}
                      {report.status !== "RESOLVED" &&
                        report.status !== "DISMISSED" && (
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Add Notes (optional):
                            </label>
                            <textarea
                              value={adminNotes[report.id] || ""}
                              onChange={(e) =>
                                setAdminNotes((prev) => ({
                                  ...prev,
                                  [report.id]: e.target.value,
                                }))
                              }
                              placeholder="Add investigation notes or comments..."
                              className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"
                              rows="2"
                            />
                          </div>
                        )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {report.status === "PENDING" && (
                          <button
                            onClick={() =>
                              updateReportStatus(report.id, "INVESTIGATING")
                            }
                            className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded font-medium transition-colors"
                          >
                            🔍 Start Investigation
                          </button>
                        )}

                        {report.status === "INVESTIGATING" && (
                          <button
                            onClick={() =>
                              updateReportStatus(report.id, "RESOLVED")
                            }
                            className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-medium transition-colors"
                          >
                            ✅ Mark as Resolved
                          </button>
                        )}

                        {(report.status === "PENDING" ||
                          report.status === "INVESTIGATING") && (
                          <button
                            onClick={() =>
                              updateReportStatus(report.id, "DISMISSED")
                            }
                            className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded font-medium transition-colors"
                          >
                            ❌ Dismiss Report
                          </button>
                        )}

                        {report.status === "DISMISSED" && (
                          <button
                            onClick={() =>
                              updateReportStatus(report.id, "PENDING")
                            }
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-medium transition-colors"
                          >
                            ↩️ Reopen Report
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
