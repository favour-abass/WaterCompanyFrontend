import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyWater = () => {
  const [serialCode, setSerialCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [waterPack, setWaterPack] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const statusColors = {
    CREATED: "bg-gray-100 text-gray-800 border-gray-300",
    APPROVED: "bg-green-100 text-green-800 border-green-300",
    REJECTED: "bg-red-100 text-red-800 border-red-300",
    DISTRIBUTED: "bg-blue-100 text-blue-800 border-blue-300",
    SOLD: "bg-purple-100 text-purple-800 border-purple-300",
  };

  const statusEmojis = {
    CREATED: "📝",
    APPROVED: "✅",
    REJECTED: "❌",
    DISTRIBUTED: "🚚",
    SOLD: "💰",
  };

  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "—" : d.toLocaleString();
  };

  const evaluateSafety = (pack) => {
    if (!pack.produced_tx)
      return { label: "UNRECOGNISABLE", color: "bg-gray-200 text-gray-800" };
    if (pack.status === "REJECTED")
      return { label: "UNSAFE", color: "bg-red-200 text-red-900" };
    if (pack.status === "APPROVED" || pack.status === "SOLD")
      return { label: "SAFE", color: "bg-green-200 text-green-900" };
    if (!pack.distributed_tx || !pack.sold_tx)
      return { label: "SUSPICIOUS", color: "bg-yellow-200 text-yellow-900" };

    return { label: "UNKNOWN", color: "bg-gray-200 text-gray-800" };
  };

  const verifyWaterPack = async () => {
    if (!serialCode.trim()) {
      setError("Please enter a serial code");
      return;
    }

    setLoading(true);
    setError("");
    setWaterPack(null);

    try {
      const res = await fetch(
        `http://localhost:3000/water/verify/${serialCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) throw new Error("Water pack not found or unauthorized");

      const data = await res.json();
      setWaterPack(data.lifecycle);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const safety = waterPack ? evaluateSafety(waterPack) : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          🔗 Blockchain Water Verification
        </h1>

        <input
          value={serialCode}
          onChange={(e) => setSerialCode(e.target.value)}
          placeholder="Enter water serial code"
          className="w-full border px-4 py-3 rounded mb-4"
          onKeyPress={(e) => e.key === "Enter" && verifyWaterPack()}
        />

        <button
          onClick={verifyWaterPack}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {error && (
          <div className="mt-4 bg-red-100 border border-red-300 p-4 rounded text-red-800">
            ❌ {error}
          </div>
        )}

        {waterPack && (
          <div className="mt-6 space-y-4">
            <div
              className={`p-4 rounded text-center font-bold ${safety.color}`}
            >
              {safety.label}
            </div>

            <div className="border rounded p-4 space-y-2">
              <p>
                <b>Serial:</b> {waterPack.serial_code}
              </p>
              <p>
                <b>Status:</b>{" "}
                <span
                  className={`px-3 py-1 rounded border font-semibold ${
                    statusColors[waterPack.status] || ""
                  }`}
                >
                  {statusEmojis[waterPack.status]} {waterPack.status}
                </span>
              </p>

              <p>
                <b>Produced At:</b> {formatDate(waterPack.produced_at)}
              </p>
              <p>
                <b>Inspected At:</b> {formatDate(waterPack.inspected_at)}
              </p>
              <p>
                <b>Distributed At:</b> {formatDate(waterPack.distributed_at)}
              </p>
              <p>
                <b>Sold At:</b> {formatDate(waterPack.sold_at)}
              </p>

              {waterPack.rejection_reason && (
                <div className="bg-red-50 border border-red-200 p-3 rounded text-red-800">
                  ⚠️ {waterPack.rejection_reason}
                </div>
              )}
            </div>

            {safety.label === "SUSPICIOUS" && (
              <div className="bg-yellow-50 border border-yellow-300 p-4 rounded text-center">
                <p className="mb-2 font-semibold text-yellow-900">
                  This water appears suspicious.
                </p>
                <button
                  onClick={() =>
                    navigate(`/report?serial=${waterPack.serial_code}`)
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  🚨 Report This Water
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyWater;
