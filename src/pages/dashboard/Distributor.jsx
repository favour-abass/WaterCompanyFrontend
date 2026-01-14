import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Distributor = () => {
  const { user } = useAuth();
  const [serial, setSerial] = useState("");
  const [status, setStatus] = useState("");

  const updateStatus = async (action) => {
    if (!serial) return setStatus("Enter a serial code!");

    try {
      const res = await fetch(
        `http://localhost:5000/water/${serial}/${action}`,
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
      setSerial("");
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Distributor Dashboard</h2>

      <input
        type="text"
        placeholder="Serial Code"
        value={serial}
        onChange={(e) => setSerial(e.target.value)}
        className="border px-3 py-1 mb-2 mr-2"
      />

      <div className="space-x-2">
        <button
          onClick={() => updateStatus("distribute")}
          className="bg-yellow-700 text-white px-4 py-1 rounded"
        >
          Mark Distributed
        </button>

        <button
          onClick={() => updateStatus("sell")}
          className="bg-green-700 text-white px-4 py-1 rounded"
        >
          Mark Sold
        </button>
      </div>

      {status && <p className="mt-4 text-green-600">{status}</p>}
    </div>
  );
};

export default Distributor;
