import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";

const Login = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    // console.log(email, password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen  bg-teal-50 overflow-y-hidden overscroll-none">
      <div className="w-full max-w-md p-3 space-y-6 bg-white rounded-lg shadow-md overflow-y-hidden">
        <h2 className="text-4xl font-bold text-teal-700 text-center">Give & Glow</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <button
            disabled={isLoading}
            className="w-full py-2 px-4 bg-teal-500 text-white font-semibold rounded-md shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Submit
          </button>

          {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}

          <div className="text-center">
            <a href="/signup" className="text-teal-500 hover:underline">Don't have an account?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
