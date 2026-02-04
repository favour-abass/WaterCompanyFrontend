import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
const Producer = () => {
  const { user } = useAuth();
  const [waterType, setWaterType] = useState("BAG");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [batchInfo, setBatchInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const addBatch = async () => {
    if (!quantity || quantity < 1) {
      setMessage("Quantity must be at least 1");
      return;
    }

    setLoading(true);
    setMessage("");
    setBatchInfo(null);

    try {
      const res = await fetch("http://localhost:3000/water", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ quantity: Number(quantity), type: waterType }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create water batch");
      }
      const data = await res.json();
      setBatchInfo({
        batchNo: data.batch_no,
        quantity: data.quantity,
        type: data.type,
        transactionHash: data.blockchain || "N/A",
        blockNumber: data.blockNumber || "N/A",
      });
      setMessage(`🎉 ${data.message}`);
      setQuantity("");
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
        <h2 className="text-2xl font-bold mb-4">🏭 Create new water batch</h2>
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
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Number of units in batch"
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <button
          onClick={addBatch}
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading
            ? "Creating on Blockchain..."
            : "➕ Create Water Pack on Blockchain"}
        </button>
        {message && (
          <div
            className={`mt-4 p-3 rounded ${
              message.includes("❌")
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-green-50 border border-green-200 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
        {batchInfo && (
          <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded">
            <p className="font-semibold text-blue-800 mb-3 text-lg">
              🎉 Water batch Created Successfully!
            </p>
            <div className="space-y-2 text-sm">
              <div className="bg-white p-3 rounded border border-blue-100">
                <p className="text-gray-600 font-medium">Batch No:</p>
                <p className="text-lg font-bold text-blue-700 mt-1">
                  {batchInfo.batchNo}
                </p>
              </div>

              <div>
                <span className="font-medium">Type:</span> {batchInfo.type}
              </div>

              <div className="bg-white p-2 rounded border border-blue-100">
                <p className="text-gray-600 font-medium">Transaction Hash</p>
                <p className="font-mono text-xs text-gray-800 break-all mt-1">
                  {batchInfo.transactionHash}
                </p>
              </div>
              <div className="bg-white p-2 rounded border border-blue-100">
                <p className="text-gray-600 font-medium">Block Number</p>
                <p className="font-semibold text-gray-800 mt-1">
                  #{batchInfo.blockNumber}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Producer;
