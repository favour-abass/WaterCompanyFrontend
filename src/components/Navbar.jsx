import { Link } from "react-router-dom";
import { useContext } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between">
      <Link to="/" className="font-bold">WaterChain</Link>

      <div className="space-x-4">
        {!isAuthenticated && (
          <>
            <Link to="/verify">Verify</Link>
            <Link to="/report">Report</Link>
            <Link to="/login" className="bg-white text-blue-900 px-3 py-1 rounded">
              Login
            </Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
