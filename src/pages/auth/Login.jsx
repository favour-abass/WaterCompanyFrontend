import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
  console.log("Attempting login with:", email, password); // ✅ debug
  try {
    await login(email, password);
    console.log("Login successful"); // ✅ debug
    // You could navigate to dashboard here if using react-router
  } catch (err) {
    console.error("Login error:", err); // ✅ debug
    setError("Invalid email or password");
  }
};


  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-3 py-1 mb-2 w-full"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-3 py-1 mb-2 w-full"
      />

      <button
        onClick={handleLogin}
        className="bg-blue-700 text-white px-4 py-1 rounded w-full"
      >
        Login
      </button>

      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
};

export default Login;
