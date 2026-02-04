import { useState } from "react";

const ReportWaterPage = () => {
  const [batchNo, setBatchNo] = useState("");
  const [serialCode, setSerialCode] = useState("");
  const [reason, setReason] = useState("");
  const [reportedByName, setReportedByName] = useState("");
  const [reportedByEmail, setReportedByEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!reason.trim()) {
      setMessage("❌ Please describe the issue");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/water/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batch_no: batchNo || null,
          serial_code: serialCode || null,
          reason,
          reported_by_name: reportedByName || "Anonymous",
          reported_by_email: reportedByEmail || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit report");
      }

      setMessage(
        "✅ Report submitted successfully! We'll investigate this issue.",
      );
      setBatchNo("");
      setSerialCode("");
      setReason("");
      setReportedByName("");
      setReportedByEmail("");
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">
            Report Water Issue
          </h2>
          <p className="text-gray-600 mb-8">
            Help us maintain water quality by reporting any concerns
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Number <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                value={batchNo}
                onChange={(e) => setBatchNo(e.target.value)}
                placeholder="e.g., BAT-123-456"
                className="border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg p-3 w-full transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                Found on the package label
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serial Code <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                value={serialCode}
                onChange={(e) => setSerialCode(e.target.value)}
                placeholder="e.g., WAT-123-456"
                className="border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg p-3 w-full transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                Unique identifier on each water pack
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                value={reportedByName}
                onChange={(e) => setReportedByName(e.target.value)}
                placeholder="Leave blank to report anonymously"
                className="border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg p-3 w-full transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="email"
                value={reportedByEmail}
                onChange={(e) => setReportedByEmail(e.target.value)}
                placeholder="For follow-up communication"
                className="border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg p-3 w-full transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe the Issue <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide details about the water quality issue (taste, smell, appearance, packaging damage, etc.)"
                className="border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg p-3 w-full h-32 transition-colors"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Be as specific as possible to help our investigation
              </p>
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg w-full font-semibold transition-colors text-lg shadow-md hover:shadow-lg"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>

            {message && (
              <div
                className={`mt-4 p-4 rounded-lg border ${message.startsWith("✅") ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              >
                <p
                  className={`${message.startsWith("✅") ? "text-green-800" : "text-red-800"} font-medium`}
                >
                  {message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            📌 Report Guidelines
          </h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              • Include batch/serial numbers if available for faster
              investigation
            </li>
            <li>
              • Describe specific issues: taste, smell, color, contamination,
              etc.
            </li>
            <li>• Your report helps maintain water safety for everyone</li>
            <li>• All reports are taken seriously and investigated promptly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportWaterPage;
