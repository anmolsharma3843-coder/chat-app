
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.email ||
        !formData.password ||
        (!isLogin && !formData.username)
      ) {
        return alert("Please fill all fields");
      }

      setLoading(true);

      const url = isLogin
        ? `${import.meta.env.VITE_BASE_URL}/users/login`
        : `${import.meta.env.VITE_BASE_URL}/users/register`;

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : formData;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();
console.log(data)
      if (!response.ok) {
        throw new Error(data.message);
      }

      if (isLogin) {
  onLogin(data.user);
}
}else {
        alert("Account created successfully!");
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-700">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg dark:bg-gray-600 dark:text-white">
        <h1 className="text-3xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Create Account"}
        </h1>

        <div className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg "
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}
          </button>

          <p className="text-center text-gray-600 dark:text-gray-200">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-blue-500 font-semibold dark:text-blue-100"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
