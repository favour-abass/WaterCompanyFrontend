import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const InspectorDashboard = () => {
  const { user } = useAuth();
  const [serialCode, setSerialCode] = useState("");
  const [message, setMessage] = useState("");
  const [currentStatus, setCurrentStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!serialCode.trim()) {
      setMessage("❌ Please enter a serial code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/water/verify/${serialCode}`);
      if (!res.ok) throw new Error("Water pack not found");
      
      const data = await res.json();
      setCurrentStatus(data.status);
      setMessage(`✅ Status: ${data.status}`);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
      setCurrentStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const moveToInspector = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      const res = await fetch(`http://localhost:3000/water/${serialCode}/test`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to move to inspector");
      }

      const data = await res.json();
      setMessage(`✅ ${data.message}`);
      setCurrentStatus("INSPECTOR");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const approveWaterPack = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`http://localhost:3000/water/${serialCode}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to approve");
      }

      const data = await res.json();
      setMessage(`✅ ${data.message}`);
      setCurrentStatus("APPROVED");
      setSerialCode("");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const rejectWaterPack = async (reason) => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`http://localhost:3000/water/${serialCode}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to reject");
      }

      const data = await res.json();
      setMessage(`✅ ${data.message}`);
      setCurrentStatus(`REJECTED_${reason}`);
      setSerialCode("");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-3xl">🔍</span>
          Inspector Approval Dashboard
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Water Pack Serial Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={serialCode}
              onChange={(e) => setSerialCode(e.target.value)}
              placeholder="WAT-xxxxx-xxxx-xxxx"
              className="flex-1 border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={checkStatus}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-60 transition-colors"
            >
              Check Status
            </button>
          </div>
        </div>

        {currentStatus && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="font-semibold text-blue-800">
              Current Status: <span className="text-lg">{currentStatus}</span>
            </p>
          </div>
        )}

        {message && (
          <div className={`mb-6 p-4 rounded ${
            message.includes("❌")
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-green-50 border border-green-200 text-green-700"
          }`}>
            <p className="font-medium">{message}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <h3 className="font-semibold text-yellow-800 mb-3">
              📋 Step 1: Move to Inspector Queue
            </h3>
            <p className="text-sm text-yellow-700 mb-3">
              Move water pack from production to quality inspection
            </p>
            <button
              onClick={moveToInspector}
              disabled={loading || !serialCode || currentStatus === "INSPECTOR" || currentStatus === "APPROVED"}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Processing..." : "🔄 Move to Inspector"}
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h3 className="font-semibold text-green-800 mb-3">
              ✅ Step 2: Approve Quality
            </h3>
            <p className="text-sm text-green-700 mb-3">
              Approve water pack after quality inspection (requires INSPECTOR status)
            </p>
            <button
              onClick={approveWaterPack}
              disabled={loading || !serialCode || currentStatus !== "INSPECTOR"}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Processing..." : "✅ Approve Water Pack"}
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <h3 className="font-semibold text-red-800 mb-3">
              ❌ Reject Water Pack
            </h3>
            <p className="text-sm text-red-700 mb-3">
              Reject if quality standards are not met
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => rejectWaterPack("CONTAMINATED")}
                disabled={loading || !serialCode || currentStatus !== "INSPECTOR"}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ☣️ Contaminated
              </button>
              <button
                onClick={() => rejectWaterPack("EXPIRED")}
                disabled={loading || !serialCode || currentStatus !== "INSPECTOR"}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ⏰ Expired
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">
            ℹ️ Workflow:
          </p>
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono bg-white px-2 py-1 rounded border">CREATED</span>
              <span>→</span>
              <span className="font-mono bg-yellow-100 px-2 py-1 rounded border border-yellow-300">INSPECTOR</span>
              <span>→</span>
              <span className="font-mono bg-green-100 px-2 py-1 rounded border border-green-300">APPROVED</span>
            </div>
            <p className="mt-2">⚠️ Water packs must be moved to INSPECTOR status before approval</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectorDashboard;