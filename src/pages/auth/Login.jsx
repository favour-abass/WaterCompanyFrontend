import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiLogIn, FiMail, FiShield } from "react-icons/fi";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleLogin = () => {
    // Replace with backend auth
    login({ email, role: "PRODUCER" });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <FiShield className="text-4xl text-blue-900" />
          </div>
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to access your WaterChain dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FiMail className="text-blue-900" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg p-3 w-full transition-colors"
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg w-full transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 text-lg"
            >
              <FiLogIn />
              <span>Sign In</span>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            By signing in, you agree to our terms of service and blockchain data policies
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
