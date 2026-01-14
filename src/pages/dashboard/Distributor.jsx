import { useState } from "react";

const Distributor = () => {
  const [batchNumber, setBatchNumber] = useState("");
  const [status, setStatus] = useState("");

  const markDistributed = async () => {
    if (!batchNumber) return setStatus("Enter a batch number!");

    // Mock backend/blockchain call
    console.log("Marking batch distributed:", batchNumber);

    setStatus(`Batch ${batchNumber} marked as distributed successfully!`);
    setBatchNumber("");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Distribute Water</h2>

      <input
        type="text"
        placeholder="Batch Number"
        value={batchNumber}
        onChange={(e) => setBatchNumber(e.target.value)}
        className="border px-3 py-1 mb-2 mr-2"
      />

      <button
        onClick={markDistributed}
        className="bg-yellow-700 text-white px-4 py-1 rounded"
      >
        Mark Distributed
      </button>

      {status && <p className="mt-4 text-green-600">{status}</p>}
    </div>
  );
};

export default Distributor;
