import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {user.role === "PRODUCER" && <p>Add new water batches</p>}
      {user.role === "INSPECTOR" && <p>Approve water quality</p>}
      {user.role === "ADMIN" && <p>Manage users and reports</p>}
    </div>
  );
};

export default Dashboard;
