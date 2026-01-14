import { useState } from "react";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("PRODUCER");
  const [message, setMessage] = useState("");

  const createUser = () => {
    console.log("Creating user:", username, role);
    setMessage(`User ${username} with role ${role} created successfully!`);
    setUsername("");
    setRole("PRODUCER");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>

      {/* Create Users */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Create New User</h3>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border px-3 py-1 mr-2 mb-2"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border px-3 py-1 mr-2 mb-2"
        >
          <option value="PRODUCER">Producer</option>
          <option value="INSPECTOR">Inspector</option>
          <option value="DISTRIBUTOR">Distributor</option>
        </select>
        <button
          onClick={createUser}
          className="bg-blue-700 text-white px-4 py-1 rounded mb-2"
        >
          Create User
        </button>
      </div>

      {/* View Water Reports */}
      <div>
        <h3 className="font-semibold mb-2">Reported Water Batches</h3>
        <p>Here you can view and manage reported water batches.</p>
        {/* Later connect to backend to fetch real reports */}
      </div>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default Admin;
