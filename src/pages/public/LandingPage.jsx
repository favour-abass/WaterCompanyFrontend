import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="text-center py-20 px-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">
        Water Quality on the Blockchain
      </h1>

      <p className="text-gray-600 max-w-xl mx-auto mb-8">
        Verify water authenticity, check quality approvals, and report
        suspicious water using an immutable blockchain system.
      </p>

      <div className="flex justify-center gap-4">
        <Link to="/verify/water" className="bg-blue-900 text-white px-6 py-3 rounded">
          Verify Water
        </Link>
        <Link to="/report" className="border border-blue-900 px-6 py-3 rounded">
          Report Water
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
