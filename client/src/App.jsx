import { useState} from "react";
import Login from "./Login";
import ChatApp from "./ChatApp";
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const cookie = await cookieStore.get("token"); // 👈 await here
      if (cookie) {
        setToken(cookie.value);
        const decoded = jwtDecode(cookie.value);
        setUser(decoded); // or however you want to set user
      }
    };
    fetchToken();
  }, []);

  return (
    <>
      {user ? <ChatApp user={user} /> : <Login onLogin={setUser} />}
    </>
  );
}

export default App;
