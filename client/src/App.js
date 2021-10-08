import React, { useEffect, useState } from "react";
import io from "socket.io-client";

function App() {
  const [name, setName] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    const newSocket = io(`http://localhost:8000`);

    newSocket.on("connect", function () {
      console.log("Connected to Server");
    });

    newSocket.on("message", function (message) {
      console.log(message);
      setData(message);
    });

    // emits message from user side
    newSocket.emit("createMessage", {
      to: "user@app.com",
      text: "user1",
    });

    // when disconnected from server
    newSocket.on("disconnect", function () {
      console.log("Disconnect from server");
    });

    return () => newSocket.close();
  }, []);

  const handleChange = async () => {
    const response = await fetch(`http://localhost:8000/dbchange?name=${name}`);
    await response.json();
  };

  const handleInput = (e) => {
    setName(e.target.value);
  };

  return (
    <div className="App">
      <div>
        <h1>Value From DB via Socket : {data}</h1>
      </div>
      <br />
      <div>
        <input name="name" type="string" value={name} onChange={handleInput} />
        <button type="button" onClick={handleChange}>
          Change DB
        </button>
      </div>
    </div>
  );
}

export default App;
