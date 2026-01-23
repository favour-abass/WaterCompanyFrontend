import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../../context/AuthContext";
import {
  FiPackage,
  FiPlus,
  FiDroplet,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const ProducerDashboard = () => {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState("");
  const [waterType, setWaterType] = useState("BAG");
  const [message, setMessage] = useState("");

  const addBatch = async () => {
    const qty = Number(quantity);
    if (!qty || qty <= 0) {
      setMessage("Quantity must be positive!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/water", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ waterType, quantity: qty }),
      });

      if (!res.ok) throw new Error("Failed to create batch");

      const data = await res.json();
      setMessage(`Batch created successfully! Serial: ${data.serialCode}`);
      setQuantity("");
      setWaterType("BAG");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isSuccess = message && message.includes("successfully");

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiPackage className="text-2xl text-blue-900" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-blue-900">
                Producer Dashboard
              </h2>
              <p className="text-gray-600">
                Create new water batches for distribution
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
          <h3 className="text-xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
            <FiPlus />
            Add New Water Batch
          </h3>

          <div className="space-y-6">
            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Enter quantity (e.g., 100)"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg px-4 py-3 transition-colors"
              />
            </div>

            {/* Water Type Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Water Type
              </label>
              <div className="relative">
                <FiDroplet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-900" />
                <select
                  value={waterType}
                  onChange={(e) => setWaterType(e.target.value)}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg pl-10 pr-4 py-3 transition-colors appearance-none bg-white cursor-pointer"
                >
                  <option value="BAG">Bag Water</option>
                  <option value="PACK">Pack Water</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={addBatch}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 text-lg"
            >
              <FiPlus className="text-xl" />
              <span>Create Batch</span>
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-lg border ${
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
                <p className="font-medium">{message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <FiPackage />
            Batch Creation Guidelines
          </h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-900 mt-0.5">•</span>
              <span>
                Each batch will receive a unique serial code for tracking
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-900 mt-0.5">•</span>
              <span>
                Batches must be approved by an inspector before distribution
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-900 mt-0.5">•</span>
              <span>All batch information is recorded on the blockchain</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;
