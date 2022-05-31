import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import MainRoutes from "./routes/routes";

function App() {
  return (
    <div className="App">
      <Router>
        <MainRoutes />
      </Router>
    </div>
  );
}

export default App;
