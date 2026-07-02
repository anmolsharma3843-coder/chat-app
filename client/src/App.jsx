import { useState} from "react";
import Login from "./Login";
import ChatApp from "./ChatApp";
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      {user ? <ChatApp user={user} /> : <Login onLogin={setUser} />}
    </>
  );
}

export default App;
