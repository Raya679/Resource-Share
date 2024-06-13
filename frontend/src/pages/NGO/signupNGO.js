import { useState } from "react";
import { useSignUpNGO } from "../../hooks/useSignUpNGO";

const SignupNGO = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [NGO_ID,setNGO_ID] = useState("");
  const [password, setPassword] = useState("");
 
  const { signupNGO, error, isLoading } = useSignUpNGO();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signupNGO(email, name, NGO_ID, password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen  bg-teal-50 overflow-hidden">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-4xl font-bold text-teal-700 text-center">Give & Glow</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">NGO Email:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">NGO Name:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">NGO ID:</label>
            <input
              type="text"
              required
              value={NGO_ID}
              onChange={(e) => setNGO_ID(e.target.value)}
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
            <a href="/login" className="text-teal-500 hover:underline">Already have an account?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupNGO;
