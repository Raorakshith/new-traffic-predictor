import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./Login/AuthPage";
import Dashboard from "./Dashboard/Dashboard";
import RoutePlanner from "./Predictroute";


function App() {
  const [count, setCount] = useState(0);


  return (
    <BrowserRouter>
      <Routes>
        {/* <Route index path="/" element={<AuthPage />} /> */}
        <Route index path="/" element={<RoutePlanner/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
