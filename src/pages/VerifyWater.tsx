import { useState } from "react";

const VerifyWater = () => {
  const [serial, setSerial] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyWater = async () => {
    if (!serial.trim()) {
      setError("Please enter a water serial number");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `http://localhost:3000/water/verify/${serial}/blockchain`
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Verification failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Verify Water Originality
        </h1>
        <p className="text-gray-600 mb-6">
          Enter the serial number printed on the water pack to confirm its
          authenticity on the blockchain.
        </p>

        {/* Input */}
        <input
          type="text"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          placeholder="Enter water serial number"
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Button */}
        <button
          onClick={verifyWater}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
            <h2 className="text-lg font-semibold text-green-700 mb-3">
              ✅ Water Verified
            </h2>

            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Serial:</strong> {result.serial}
              </li>
              <li>
                <strong>Status:</strong> {result.status}
              </li>
              <li>
                <strong>Recorded By:</strong> {result.recordedBy}
              </li>
              <li>
                <strong>Blockchain Block:</strong> #{result.blockIndex}
              </li>
              <li>
                <strong>Timestamp:</strong>{" "}
                {new Date(result.timestamp).toLocaleString()}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyWater;
