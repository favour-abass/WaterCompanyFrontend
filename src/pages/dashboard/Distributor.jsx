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
  const [blockchainInfo, setBlockchainInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (action) => {
    if (!serial) {
      setStatus("⚠️ Please enter a serial code!");
      return;
    }

    setLoading(true);
    setStatus("");
    setBlockchainInfo(null);

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
      setBlockchainInfo(data.blockchain);
      setSerial("");
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = status && !status.includes("!");

  return (
    <div className="p-6">
      <div className="max-w-2xl bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-3xl">🚚</span>
          Distributor Dashboard
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Water Pack Serial Code
          </label>
          <input
            type="text"
            placeholder="Enter serial code (e.g., WAT-xxxxx)"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => updateStatus("distribute")}
            disabled={loading}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Processing..." : "📦 Mark as Distributed"}
          </button>

          <button
            onClick={() => updateStatus("sell")}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Processing..." : "💰 Mark as Sold"}
          </button>
        </div>

        {status && (
          <div className={`mt-4 p-3 rounded ${
            status.includes("❌") 
              ? "bg-red-50 border border-red-200 text-red-700" 
              : "bg-green-50 border border-green-200 text-green-700"
          }`}>
            <p className="font-medium">{status}</p>
          </div>
        )}

        {blockchainInfo && (
          <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded">
            <p className="font-semibold text-blue-800 mb-2">
              🔗 Blockchain Confirmation
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="bg-white p-2 rounded">
                <p className="text-gray-600">Transaction Hash</p>
                <p className="font-mono text-xs text-gray-800 break-all">
                  {blockchainInfo.transactionHash}
                </p>
              </div>

              <div className="bg-white p-2 rounded">
                <p className="text-gray-600">Block Number</p>
                <p className="font-semibold text-gray-800">
                  #{blockchainInfo.blockNumber}
                </p>
              </div>

              <p className="text-xs text-center text-gray-500 mt-2 pt-2 border-t border-blue-200">
                🔐 Permanently recorded on Ethereum blockchain
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Distributor;