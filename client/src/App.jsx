import { useState} from "react";
import Login from "./Login";
import ChatApp from "./ChatApp";
function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      {user ? <ChatApp user={user} /> : <Login onLogin={setUser} />}
    </>
  );
}

export default App;
