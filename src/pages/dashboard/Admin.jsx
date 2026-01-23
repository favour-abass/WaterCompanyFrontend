import { useState } from "react";
import { FiUserPlus, FiShield, FiAlertTriangle, FiCheckCircle, FiUsers, FiSettings } from "react-icons/fi";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("PRODUCER");
  const [message, setMessage] = useState("");

  const createUser = () => {
    console.log("Creating user:", username, role);
    setMessage(`User ${username} with role ${role} created successfully!`);
    setUsername("");
    setRole("PRODUCER");
  };

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
              <h2 className="text-3xl font-bold text-blue-900">Admin Dashboard</h2>
              <p className="text-gray-600">Manage users and monitor system activity</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
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
                  Username
                </label>
                <div className="relative">
                  <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg pl-10 pr-4 py-3 transition-colors"
                  />
                </div>
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
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={createUser}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 text-lg"
              >
                <FiUserPlus className="text-xl" />
                <span>Create User</span>
              </button>
            </div>

            {/* Success Message */}
            {message && (
              <div className="mt-5 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="text-xl text-green-600 mt-0.5 shrink-0" />
                  <p className="text-green-800 font-medium">{message}</p>
                </div>
              </div>
            )}

            {/* Role Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Role Descriptions:</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-blue-900 font-bold">•</span>
                  <span><strong>Producer:</strong> Creates water batches</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-900 font-bold">•</span>
                  <span><strong>Inspector:</strong> Approves water quality</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-900 font-bold">•</span>
                  <span><strong>Distributor:</strong> Manages distribution</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
            <h3 className="text-xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
              <FiAlertTriangle />
              Reported Water Batches
            </h3>

            <div className="text-center py-12">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <FiAlertTriangle className="text-4xl text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">No reports available yet</p>
              <p className="text-sm text-gray-500">
                Reported water batches will appear here for review and action
              </p>
            </div>

            {/* Placeholder for future reports */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Coming soon:</strong> View and manage all water quality reports submitted by users. You'll be able to investigate issues and take necessary actions.
              </p>
            </div>
          </div>
        </div>

        {/* System Stats Card */}
        <div className="mt-6 bg-linear-to-r from-blue-900 to-blue-800 rounded-xl shadow-lg p-8 text-white">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FiShield />
            System Overview
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-blue-200 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold">-</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-blue-200 text-sm mb-1">Active Batches</p>
              <p className="text-3xl font-bold">-</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-blue-200 text-sm mb-1">Pending Reports</p>
              <p className="text-3xl font-bold">-</p>
            </div>
          </div>
          <p className="text-blue-200 text-sm mt-4">Connect to backend to view live statistics</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;