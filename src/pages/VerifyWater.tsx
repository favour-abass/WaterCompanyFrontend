import { useState } from "react";

const VerifyWater = () => {
  const [serialCode, setSerialCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [waterPack, setWaterPack] = useState(null);
  const [error, setError] = useState("");

  const statusColors = {
    CREATED: "bg-gray-100 text-gray-800 border-gray-300",
    INSPECTOR: "bg-yellow-100 text-yellow-800 border-yellow-300",
    APPROVED: "bg-green-100 text-green-800 border-green-300",
    REJECTED_CONTAMINATED: "bg-red-100 text-red-800 border-red-300",
    REJECTED_EXPIRED: "bg-orange-100 text-orange-800 border-orange-300",
    DISTRIBUTED: "bg-blue-100 text-blue-800 border-blue-300",
    SOLD: "bg-purple-100 text-purple-800 border-purple-300",
  };

  const statusEmojis = {
    CREATED: "📝",
    INSPECTOR: "🔍",
    APPROVED: "✅",
    REJECTED_CONTAMINATED: "☣️",
    REJECTED_EXPIRED: "⏰",
    DISTRIBUTED: "🚚",
    SOLD: "💰",
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
        `http://localhost:3000/water/verify/${serialCode}`
      );

      if (!res.ok) {
        throw new Error("Water pack not found on blockchain");
      }

      const data = await res.json();
      setWaterPack(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
const formatDate = (value) => {
  if (!value) return "—";

  // If it's already a Date-compatible string
  if (typeof value === "string" && isNaN(Number(value))) {
    const d = new Date(value);
    return isNaN(d.getTime()) ? "—" : d.toLocaleString();
  }

  // If it's a number or numeric string (seconds)
  const seconds = Number(value);
  if (isNaN(seconds)) return "—";

  return new Date(seconds * 1000).toLocaleString();
};


  const getStatusNumber = (status) => {
    const statusMap = {
      CREATED: 0,
      INSPECTOR: 1,
      APPROVED: 2,
      REJECTED_CONTAMINATED: 3,
      REJECTED_EXPIRED: 4,
      DISTRIBUTED: 5,
      SOLD: 6,
    };
    return statusMap[status] ?? 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🔗 Blockchain Water Verification
            </h1>
            <p className="text-gray-600">
              Verify the authenticity of your water pack on the Ethereum blockchain
            </p>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter serial code (e.g., WAT-xxxxx-xxxxx)"
              value={serialCode}
              onChange={(e) => setSerialCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && verifyWaterPack()}
              className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          <button
            onClick={verifyWaterPack}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying on Blockchain...
              </span>
            ) : (
              "🔍 Verify on Blockchain"
            )}
          </button>

          {error && (
            <div className="mt-6 bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-lg">
              <p className="font-semibold">❌ {error}</p>
              <p className="text-sm mt-1">
                This water pack could not be found on the blockchain
              </p>
            </div>
          )}

          {waterPack && (
            <div className="mt-8 space-y-4">
              <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
                <p className="text-green-800 font-bold text-xl text-center">
                  ✅ Verified on Ethereum Blockchain
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Water Pack Details
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="text-gray-600 font-medium">Serial Code</span>
                    <span className="font-mono font-bold text-blue-700">
                      {waterPack.serialCode}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="text-gray-600 font-medium">Status</span>
                    <span className={`px-4 py-1 rounded-full border font-semibold ${
                      statusColors[waterPack.status] || "bg-gray-100 text-gray-800"
                    }`}>
                      {statusEmojis[waterPack.status]} {waterPack.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="text-gray-600 font-medium">Created By</span>
                    <span className="font-mono text-sm text-gray-800">
                      {waterPack.createdBy.substring(0, 10)}...
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="text-gray-600 font-medium">Created At</span>
                    <span className="text-gray-800 font-medium">
                      {formatDate(waterPack.createdAt)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white rounded border">
                    <span className="text-gray-600 font-medium">Last Modified</span>
                    <span className="text-gray-800 font-medium">
                      {formatDate(waterPack.lastModifiedAt)}
                    </span>
                  </div>

                  {waterPack.rejectionReason && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <span className="text-red-700 font-semibold">
                        ⚠️ Rejection Reason: {waterPack.rejectionReason}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-800 text-center">
                  🔐 This information is permanently stored on the Ethereum blockchain
                  and cannot be altered or deleted
                </p>
              </div>

              <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-3 text-center">
                  Lifecycle Journey
                </h4>
                <div className="flex items-center justify-between">
                  {["CREATED", "INSPECTOR", "APPROVED", "DISTRIBUTED", "SOLD"].map((status, idx) => {
                    const isActive = getStatusNumber(waterPack.status) >= idx;
                    const isCurrent = waterPack.status === status;
                    
                    return (
                      <div key={status} className="flex items-center">
                        <div className={`flex flex-col items-center ${
                          idx > 0 ? "ml-2" : ""
                        }`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            isCurrent 
                              ? "bg-blue-600 text-white ring-4 ring-blue-200" 
                              : isActive 
                                ? "bg-green-500 text-white" 
                                : "bg-gray-300 text-gray-600"
                          }`}>
                            {statusEmojis[status]}
                          </div>
                          <span className={`text-xs mt-1 font-medium ${
                            isActive ? "text-gray-800" : "text-gray-400"
                          }`}>
                            {status}
                          </span>
                        </div>
                        {idx < 4 && (
                          <div className={`h-1 w-8 mx-1 ${
                            isActive ? "bg-green-500" : "bg-gray-300"
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-gray-800 mb-3">
            ℹ️ Why Blockchain Verification Matters
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span><strong>Immutable Records:</strong> Data cannot be altered once recorded</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span><strong>Transparency:</strong> Full lifecycle visible to everyone</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span><strong>Trust:</strong> No central authority can manipulate records</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span><strong>Authenticity:</strong> Verify product genuineness instantly</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VerifyWater;