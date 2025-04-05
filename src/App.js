import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SymptomList from "./pages/SymptomList";
import SymptomForm from "./pages/SymptomForm";
import { useState } from "react";
import EditSymptom from "./pages/EditSymptom";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    setToken(null);
  };

  return (
    <Router>
      <nav className="bg-gray-800 text-white p-4 flex justify-between">
        <ul className="flex items-center">
          <li className="mr-4">
            <Link to="/" className="text-white hover:text-blue-300">Home</Link>
          </li>
          <li className="mr-4">
            <Link to="/add-symptom" className="text-white hover:text-blue-300">Add Symptom</Link>
          </li>
          <li className="mr-4">
            {!token && <Link to="/login" className="text-white hover:text-blue-300">Login</Link>}
          </li>
          <li className="mr-4">
            {!token && <Link to="/register" className="text-white hover:text-blue-300">New Register</Link>}
          </li>
          <li>
            {token && <button onClick={handleLogout} className="text-white hover:text-blue-300">Logout</button>}
          </li>
        </ul>
      </nav>
      <Outlet />
      <Routes>
        <Route path="/" element={token ? <SymptomList /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-symptom" element={token ? <SymptomForm /> : <Navigate to="/login" />} />
        <Route path="/symptoms" element={token ? <SymptomList /> : <Navigate to="/login" />} />
        <Route path="/edit-symptom/:id" element={<EditSymptom />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/maggi" element={<div>Maggi</div>} />
      </Routes>
    </Router>
  );
}

export default App;

