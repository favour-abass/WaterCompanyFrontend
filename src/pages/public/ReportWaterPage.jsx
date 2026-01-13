import { useState } from "react";

const ReportWaterPage = () => {
  const [batchId, setBatchId] = useState("");
  const [reason, setReason] = useState("");

  const submit = async () => {
    alert("Report submitted");
    setBatchId("");
    setReason("");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Report Water Issue</h2>

      <input
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
        placeholder="Batch ID (if available)"
        className="border p-2 w-full mb-3"
      />

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Describe the issue"
        className="border p-2 w-full mb-3"
      />

      <button className="bg-red-600 text-white px-4 py-2 rounded w-full">
        Submit Report
      </button>
    </div>
  );
};

export default ReportWaterPage;
