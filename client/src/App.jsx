import { useState } from "react";
import Login from "./Login";
import ChatApp from "./ChatApp";
import { jwtDecode } from "jwt-decode";

function App() {
  const getUserFromToken = () => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
      const decoded = jwtDecode(token);

      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return null;
      }

      return decoded;
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      return null;
    }
  };

  const [user, setUser] = useState(getUserFromToken());

  return (
    <>
      {user ? (
        <ChatApp user={user} />
      ) : (
        <Login onLogin={setUser} />
      )}
    </>
  );
}

export default App;