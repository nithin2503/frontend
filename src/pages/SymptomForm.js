import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SymptomForm() {
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState(1);
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const userId = userDetails.userId;
    try {
      await axios.post("http://localhost:5002/api/symptoms", { user_id: userId, description, severity, notes }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/");
    } catch (error) {
      alert(error.message || "Failed to add symptom.");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add Symptom</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Description" className="w-full p-2 border rounded" onChange={(e) => setDescription(e.target.value)} required />
        <input type="number" placeholder="Severity (1-10)" className="w-full p-2 border rounded" min="1" max="10" onChange={(e) => setSeverity(Number(e.target.value))} required />
        <textarea placeholder="Notes" className="w-full p-2 border rounded" onChange={(e) => setNotes(e.target.value)}></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
      </form>
    </div>
  );
}

