import { useState } from "react";

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
      const res = await fetch(
        `http://localhost:3000/water/${serial}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

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
    <div className="p-4">
      <div className="max-w-xl bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">
          Inspector Approval Dashboard
        </h2>

        <input
          type="text"
          placeholder="Enter water serial number"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4"
        />

        <button
          onClick={approveWater}
          disabled={loading}
          className="w-full bg-green-700 text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? "Recording on Blockchain..." : "Approve Water"}
        </button>

        {error && (
          <div className="mt-4 bg-red-50 text-red-600 p-3 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded">
            <p className="font-semibold text-green-700">
              ✅ {result.message}
            </p>
            <p className="text-sm mt-2">
              <strong>Blockchain Block:</strong> #{result.blockIndex}
            </p>
            <p className="text-sm">
              <strong>Timestamp:</strong>{" "}
              {new Date(result.timestamp).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectorDashboard;
