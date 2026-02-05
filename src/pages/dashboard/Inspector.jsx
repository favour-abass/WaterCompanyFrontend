import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Inspector = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [actionLoading, setActionLoading] = useState({});

  if (!user || !user.token) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  const fetchQueue = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:3000/water/createdBatch", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || `Failed with status ${res.status}`);
      }

      const data = await res.json();
      setBatches(data); // backend should already return unique batches
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchQueue();
  }, [user?.token]);

  const approveBatch = async (batch_no) => {
    setActionLoading((prev) => ({ ...prev, [batch_no]: true }));
    try {
      const res = await fetch(`http://localhost:3000/water/batch/${batch_no}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Batch approval failed");
      }

      alert(`Batch ${batch_no} approved!`);
      fetchQueue();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [batch_no]: false }));
    }
  };

  const rejectBatch = async (batch_no) => {
    const reason = prompt("Reason for rejection:");
    if (!reason) return;

    setActionLoading((prev) => ({ ...prev, [batch_no]: true }));
    try {
      const res = await fetch(`http://localhost:3000/water/batch/${batch_no}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Batch rejection failed");
      }

      alert(`Batch ${batch_no} rejected!`);
      fetchQueue();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [batch_no]: false }));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🧪 Inspection Queue</h1>
        <button
          onClick={fetchQueue}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          Refresh Queue
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {message && <p className="text-red-500 mb-4">{message}</p>}

      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-105 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left">Batch No</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {batches.length === 0 && !loading && (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No batches awaiting inspection
                  </td>
                </tr>
              )}

              {batches.map((batch) => (
                <tr key={batch.batch_no} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono">{batch.batch_no}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-semibold">
                      {batch.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => approveBatch(batch.batch_no)}
                      disabled={actionLoading[batch.batch_no]}
                      className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      Approve Batch
                    </button>

                    <button
                      onClick={() => rejectBatch(batch.batch_no)}
                      disabled={actionLoading[batch.batch_no]}
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      Reject Batch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inspector;
