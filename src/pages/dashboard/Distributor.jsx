import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FiTruck,
  FiShoppingCart,
  FiPackage,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { FaBarcode } from "react-icons/fa";

const Distributor = () => {
  const { user } = useAuth();
  const [distributeSerial, setDistributeSerial] = useState("");
  const [sellSerial, setSellSerial] = useState("");
  const [status, setStatus] = useState("");

  const updateStatus = async (action, serial, clearInput) => {
    if (!serial) return setStatus("Enter a serial code!");

    try {
      const res = await fetch(
        `http://localhost:3000/water/${serial}/${action}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update status");
      }

      const data = await res.json();
      setStatus(data.message);
      clearInput();
    } catch (err) {
      setStatus(err.message);
    }
  };

  const isSuccess = status && !status.includes("!");

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiTruck className="text-2xl text-yellow-700" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-blue-900">
                Distributor Dashboard
              </h2>
              <p className="text-gray-600">
                Manage water batch distribution and sales
              </p>
            </div>
          </div>
        </div>

        {/* Main Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Distribute Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <FiTruck className="text-yellow-600" />
              Mark as Distributed
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Code
                </label>
                <div className="relative">
                  <FaBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter batch serial code"
                    value={distributeSerial}
                    onChange={(e) => setDistributeSerial(e.target.value)}
                    className="w-full border-2 border-gray-200 focus:border-yellow-500 focus:outline-none rounded-lg pl-10 pr-4 py-3 transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={() =>
                  updateStatus("distribute", distributeSerial, () =>
                    setDistributeSerial("")
                  )
                }
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
              >
                <FiTruck className="text-xl" />
                <span>Mark as Distributed</span>
              </button>
            </div>
          </div>

          {/* Sell Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <FiShoppingCart className="text-green-700" />
              Mark as Sold
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Code
                </label>
                <div className="relative">
                  <FaBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter batch serial code"
                    value={sellSerial}
                    onChange={(e) => setSellSerial(e.target.value)}
                    className="w-full border-2 border-gray-200 focus:border-green-500 focus:outline-none rounded-lg pl-10 pr-4 py-3 transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={() =>
                  updateStatus("sell", sellSerial, () => setSellSerial(""))
                }
                className="w-full bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
              >
                <FiShoppingCart className="text-xl" />
                <span>Mark as Sold</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              isSuccess
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-start gap-3">
              {isSuccess ? (
                <FiCheckCircle className="text-xl mt-0.5 shrink-0" />
              ) : (
                <FiAlertCircle className="text-xl mt-0.5 shrink-0" />
              )}
              <p className="font-medium">{status}</p>
            </div>
          </div>
        )}

        {/* Status Guide Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <FiPackage />
            Distribution Status Guide
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 rounded">
                <FiTruck className="text-yellow-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Distributed</p>
                <p className="text-gray-600">
                  Mark batches that have been shipped to retailers or vendors
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded">
                <FiShoppingCart className="text-green-700" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sold</p>
                <p className="text-gray-600">
                  Mark batches that have been sold to end consumers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
            <FiAlertCircle />
            Important Reminder
          </h4>
          <p className="text-sm text-gray-700">
            All status updates are permanently recorded on the blockchain.
            Ensure the serial code is correct before updating the batch status.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Distributor;
