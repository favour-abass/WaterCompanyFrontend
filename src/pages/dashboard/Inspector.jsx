import { useState } from "react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
  FiHash,
  FiClock,
  FiSearch,
} from "react-icons/fi";

const InspectorDashboard = () => {
  const [serial, setSerial] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const approveWater = async () => {
    if (!serial.trim()) {
      setError("Enter a valid water serial number");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await fetch(`http://localhost:3000/water/${serial}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Approval failed");
      }

      setResult({
        message: data.message,
        blockIndex: data.block.index,
        timestamp: data.block.timestamp,
      });

      setSerial("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiShield className="text-2xl text-green-700" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-blue-900">
                Inspector Dashboard
              </h2>
              <p className="text-gray-600">
                Approve water batches and record on blockchain
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
          <h3 className="text-xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
            <FiCheckCircle />
            Water Quality Approval
          </h3>

          <div className="space-y-6">
            {/* Serial Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Water Serial Number
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter water serial number"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  className="w-full border-2 border-gray-200 focus:border-green-500 focus:outline-none rounded-lg pl-10 pr-4 py-3 transition-colors"
                />
              </div>
            </div>

            {/* Approve Button */}
            <button
              onClick={approveWater}
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Recording on Blockchain...</span>
                </>
              ) : (
                <>
                  <FiCheckCircle className="text-xl" />
                  <span>Approve Water Batch</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="text-xl text-red-600 mt-0.5 shrink-0" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Success Result */}
          {result && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <FiCheckCircle className="text-2xl text-green-700 mt-0.5 shrink-0" />
                <p className="text-lg font-semibold text-green-800">
                  {result.message}
                </p>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                  <FiHash className="text-green-700" />
                  <div>
                    <p className="text-xs text-gray-600">Blockchain Block</p>
                    <p className="font-semibold text-gray-900">
                      #{result.blockIndex}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                  <FiClock className="text-green-700" />
                  <div>
                    <p className="text-xs text-gray-600">Timestamp</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(result.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <FiShield />
            Inspector Responsibilities
          </h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-900 mt-0.5">•</span>
              <span>
                Verify water quality meets all safety standards before approval
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-900 mt-0.5">•</span>
              <span>
                Each approval is permanently recorded on the blockchain
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-900 mt-0.5">•</span>
              <span>Only approved batches can be distributed to consumers</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InspectorDashboard;
