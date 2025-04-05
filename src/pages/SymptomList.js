import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function SymptomList() {
  const [symptoms, setSymptoms] = useState([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [severityFilter, setSeverityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortOption, setSortOption] = useState("date");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSymptoms();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [symptoms, severityFilter, dateFilter, sortOption]);

  const fetchSymptoms = () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios.get("http://localhost:5002/api/symptoms", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setSymptoms(res.data))
    .catch(() => alert("Failed to fetch symptoms."));
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      await axios.delete(`http://localhost:5002/api/symptoms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSymptoms(symptoms.filter(symptom => symptom.id !== id)); 
    } catch (error) {
      alert("Failed to delete symptom.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-symptom/${id}`);
  };

  const applyFiltersAndSorting = () => {
    let filtered = [...symptoms];

    if (severityFilter) {
      filtered = filtered.filter(s => s.severity > severityFilter);
    }

    if (dateFilter) {
      const pastDate = dayjs().subtract(dateFilter, "day");
      filtered = filtered.filter(s => dayjs(s.dateOccurred).isAfter(pastDate));
    }

    if (sortOption === "severity") {
      filtered.sort((a, b) => b.severity - a.severity);
    } else {
      filtered.sort((a, b) => new Date(b.dateOccurred) - new Date(a.dateOccurred));
    }

    setFilteredSymptoms(filtered);
  };

 
  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold">My Symptoms</h1>
      {/* Filtering Options */}
      <div className="mt-4 flex gap-4">
        <div>
          <label className="block font-semibold">Severity &gt; </label>
          <input
            type="number"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded w-32"
            placeholder="Enter min severity"
          />
        </div>

        <div>
          <label className="block font-semibold">Date Range</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded w-40"
          >
            <option value="">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
          </select>
        </div>

        {/* Sorting Options */}
        <div>
          <label className="block font-semibold">Sort By</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 p-2 rounded w-40"
          >
            <option value="date">Date Occurred</option>
            <option value="severity">Severity</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => navigate("/add-symptom")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
      >
        Add Symptom
      </button>

      {/* Symptom List */}
      <ul className="list-none mt-4">
        {filteredSymptoms.map(symptom => (
          <li key={symptom.id} className="bg-gray-100 p-3 mt-2 rounded shadow flex justify-between items-center">
            <p className="text-lg font-semibold">
              <strong>{symptom.description}</strong> - Severity: {symptom.severity} 
              <span className="text-gray-600 text-sm ml-2">({dayjs(symptom.dateOccurred).format("DD/MM/YYYY")})</span>
            </p>
            <div className="flex items-center">
              <button
                onClick={() => handleEdit(symptom.id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(symptom.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
