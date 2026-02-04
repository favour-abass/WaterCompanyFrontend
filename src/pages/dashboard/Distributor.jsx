import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Distributor = () => {
  const { user } = useAuth();
  const [distributeQueue, setDistributeQueue] = useState([]);
  const [sellQueue, setSellQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");

  const fetchQueues = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      };

      const approvedRes = await fetch(
        "http://localhost:3000/water/approvedBatch",
        { headers },
      );

      const distributedRes = await fetch(
        "http://localhost:3000/water/distributedBatch",
        { headers },
      );

      if (!approvedRes.ok || !distributedRes.ok) {
        throw new Error("Failed to fetch queues");
      }

      setDistributeQueue(await approvedRes.json());
      setSellQueue(await distributedRes.json());

      if (showRefreshIndicator) {
        setMessage("✅ Queues refreshed");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setMessage("❌ Failed to load distributor queues");
      console.error(err);
    } finally {
      if (showRefreshIndicator) setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchQueues();
    }
  }, [user]);

  const updateBatch = async (batchNo, action) => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `http://localhost:3000/water/batch/${batchNo}/${action}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Action failed");
      }

      const data = await res.json();
      setMessage(`✅ ${data.message}`);

      // Refresh queues after successful action
      await fetchQueues();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">🚚 Distributor Dashboard</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded border ${
            message.startsWith("✅")
              ? "bg-green-100 border-green-300 text-green-800"
              : "bg-red-100 border-red-300 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribute Queue */}
        <div className="bg-white rounded shadow flex flex-col h-120">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-yellow-700">
              📦 Distribute Queue
            </h3>
            <button
              onClick={() => fetchQueues(true)}
              disabled={refreshing}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium disabled:opacity-50"
            >
              {refreshing ? "🔄 Refreshing..." : "🔄 Refresh"}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {distributeQueue.length === 0 && (
              <p className="text-sm text-gray-500 text-center mt-8">
                No approved batches ready for distribution
              </p>
            )}

            {distributeQueue.map((batch) => (
              <div
                key={batch.batch_no}
                className="border p-3 rounded mb-3 bg-yellow-50"
              >
                <p className="font-mono text-sm font-semibold">
                  {batch.batch_no}
                </p>
                <p className="text-xs text-gray-600">
                  Units: {batch.approved_units}
                </p>

                <button
                  disabled={loading}
                  onClick={() => updateBatch(batch.batch_no, "distribute")}
                  className="mt-2 w-full bg-yellow-600 text-white py-2 rounded font-semibold hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "📦 Distribute Batch"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sell Queue */}
        <div className="bg-white rounded shadow flex flex-col h-120">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-green-700">💰 Sell Queue</h3>
            <button
              onClick={() => fetchQueues(true)}
              disabled={refreshing}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium disabled:opacity-50"
            >
              {refreshing ? "🔄 Refreshing..." : "🔄 Refresh"}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {sellQueue.length === 0 && (
              <p className="text-sm text-gray-500 text-center mt-8">
                No distributed batches ready for sale
              </p>
            )}

            {sellQueue.map((batch) => (
              <div
                key={batch.batch_no}
                className="border p-3 rounded mb-3 bg-green-50"
              >
                <p className="font-mono text-sm font-semibold">
                  {batch.batch_no}
                </p>
                <p className="text-xs text-gray-600">
                  Units: {batch.distributed_units}
                </p>

                <button
                  disabled={loading}
                  onClick={() => updateBatch(batch.batch_no, "sell")}
                  className="mt-2 w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "💰 Sell Batch"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Distributor;
