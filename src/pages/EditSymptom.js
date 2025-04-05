import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditSymptom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [symptom, setSymptom] = useState( { description: "", severity: "", notes: "" });
  const [originalSymptom, setOriginalSymptom] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios.get(`http://localhost:5002/api/symptoms/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      setSymptom(res.data);
      setOriginalSymptom(res.data);
    })
    .catch(() => alert("Failed to fetch symptom."));
  }, [id, navigate]);

  const handleChange = (e) => {
    setSymptom({ ...symptom, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    if (JSON.stringify(originalSymptom) === JSON.stringify(symptom)) {
      alert("No changes made.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(`http://localhost:5002/api/symptoms/${id}`, symptom, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Symptom updated successfully!");
      navigate("/");
    } catch (error) {
      alert("Failed to update symptom.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold">Edit Symptom</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Description</label>
          <input
            type="text"
            name="description"
            value={symptom.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Severity</label>
          <input
            type="number"
            name="severity"
            value={symptom.severity}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Notes</label>
          <textarea
            name="notes"
            value={symptom.notes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

