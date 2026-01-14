import { useAuth } from "../../context/AuthContext";
import Distributor from "./Distributor";
import Inspector from "./Inspector";
import Producer from "./Producer";
import Admin from "./Admin";

const Dashboard = () => {
  const { user } = useAuth();
  console.log("Dashboard user:", user);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        {user.role} Dashboard
      </h1>

      {/* {user.role === "PRODUCER" && <Producer />}
      {user.role === "INSPECTOR" && <Inspector />}
      {user.role === "DISTRIBUTOR" && <Distributor />} */}
      {user.role === "ADMIN" && <Producer />}
      {user.role === "ADMIN" && <Inspector />}
      {user.role === "ADMIN" && <Distributor />}
      {user.role === "ADMIN" && <Admin />}
    </div>
  );
};

export default Dashboard;
