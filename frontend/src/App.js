import "./App.css";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  });

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="/whatsapp.png"
          className="max-w-sm rounded-lg shadow-2xl w-64 sm:w-96"
        />
        <div>
          <h1 className="text-5xl font-bold">BUY/SELL@IIITH</h1>
          <p className="py-6">Quit whatsapp , Join "www.buy/sell.iiit.ac.in"</p>
          {!loggedIn && (
            <div className="flex justify-center items-center gap-2">
              <Link to="/login">
                <button className="btn btn-primary">Login</button>
              </Link>
              <Link to="/signup">
                <button className="btn btn-primary">Sign Up</button>
              </Link>
            </div>
          )}

          <div className="flex justify-center items-center">
            {loggedIn && (
              <Link to="/profile">
                <button className="btn btn-primary ">Continue</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
