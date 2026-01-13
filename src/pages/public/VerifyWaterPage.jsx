import { useState } from "react";

const VerifyWaterPage = () => {
  const [batchId, setBatchId] = useState("");
  const [result, setResult] = useState(null);

  const verify = async () => {
    // Replace with real backend call
    setResult({
      status: "APPROVED",
      inspector: "Inspector A",
      hash: "0xabc123...",
      date: "2026-01-10"
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Verify Water Quality</h2>

      <input
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
        placeholder="Enter Batch ID"
        className="border p-2 w-full mb-3"
      />

      <button
        onClick={verify}
        className="bg-blue-900 text-white px-4 py-2 rounded w-full"
      >
        Verify
      </button>

      {result && (
        <div className="mt-6 bg-white shadow p-4 rounded">
          <p><b>Status:</b> {result.status}</p>
          <p><b>Inspector:</b> {result.inspector}</p>
          <p><b>Hash:</b> {result.hash}</p>
          <p><b>Date:</b> {result.date}</p>
        </div>
      )}
    </div>
  );
};

export default VerifyWaterPage;
