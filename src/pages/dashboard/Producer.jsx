import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ProducerDashboard = () => {
  const { user } = useAuth();
  const [waterType, setWaterType] = useState("BAG");
  const [message, setMessage] = useState("");
  const [blockchainInfo, setBlockchainInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const addBatch = async () => {
    setLoading(true);
    setMessage("");
    setBlockchainInfo(null);

    try {
      const res = await fetch("http://localhost:3000/water", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ waterType }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create water pack");
      }

      const data = await res.json();
      setMessage(`✅ ${data.message}`);
      setBlockchainInfo({
        serialCode: data.serialCode,
        transactionHash: data.blockchain.transactionHash,
        blockNumber: data.blockchain.blockNumber,
      });
      setWaterType("BAG");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-xl bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-3xl">🏭</span>
          Add New Water Pack
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Water Type
          </label>
          <select
            value={waterType}
            onChange={(e) => setWaterType(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="BAG">💧 Bag</option>
            <option value="PACK">📦 Pack</option>
          </select>
        </div>

        <button
          onClick={addBatch}
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating on Blockchain...
            </span>
          ) : (
            "➕ Create Water Pack on Blockchain"
          )}
        </button>

        {message && (
          <div className={`mt-4 p-3 rounded ${
            message.includes("❌")
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-green-50 border border-green-200 text-green-700"
          }`}>
            <p className="font-medium">{message}</p>
          </div>
        )}

        {blockchainInfo && (
          <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded">
            <p className="font-semibold text-blue-800 mb-3 text-lg">
              🎉 Water Pack Created Successfully!
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="bg-white p-3 rounded border border-blue-100">
                <p className="text-gray-600 font-medium">Serial Code</p>
                <p className="text-lg font-bold text-blue-700 mt-1">
                  {blockchainInfo.serialCode}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Save this code for tracking
                </p>
              </div>

              <div className="bg-white p-2 rounded border border-blue-100">
                <p className="text-gray-600 font-medium">Transaction Hash</p>
                <p className="font-mono text-xs text-gray-800 break-all mt-1">
                  {blockchainInfo.transactionHash}
                </p>
              </div>

              <div className="bg-white p-2 rounded border border-blue-100">
                <p className="text-gray-600 font-medium">Block Number</p>
                <p className="font-semibold text-gray-800 mt-1">
                  #{blockchainInfo.blockNumber}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-gray-500 text-center">
                  🔐 Immutably recorded on Ethereum blockchain
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">
            ℹ️ How it works:
          </p>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>Each water pack is recorded on the Ethereum blockchain</li>
            <li>Creates an immutable, transparent record</li>
            <li>Anyone can verify authenticity using the serial code</li>
            <li>Full lifecycle tracking from production to sale</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;