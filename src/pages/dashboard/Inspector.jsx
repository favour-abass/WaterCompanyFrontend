import { useState } from "react";

const InspectorDashboard = () => {
  const [batchNumber, setBatchNumber] = useState("");
  const [status, setStatus] = useState("");

  const verifyBatch = async () => {
    // Mock verification
    console.log("Verifying batch:", batchNumber);
    setStatus(`Batch ${batchNumber} approved!`);
    setBatchNumber("");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Verify Water Quality</h2>
      <input
        type="text"
        placeholder="Batch Number"
        value={batchNumber}
        onChange={(e) => setBatchNumber(e.target.value)}
        className="border px-3 py-1 mb-2 mr-2"
      />
      <button
        onClick={verifyBatch}
        className="bg-green-700 text-white px-4 py-1 rounded"
      >
        Approve
      </button>

      {status && <p className="mt-4 text-green-600">{status}</p>}
    </div>
  );
};

export default InspectorDashboard;
