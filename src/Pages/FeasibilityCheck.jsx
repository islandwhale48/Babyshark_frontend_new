import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";

export default function FeasibilityCheck() {
  const [form, setForm] = useState({
    idea: "",
    location: "",
    budget: "",
    audience: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [startupName, setStartupName] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkFeasibility = async () => {
    setError("");
    setResult(null);

    if (!form.idea || !form.location || !form.budget || !form.audience) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/feasibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setError("Feasibility analysis failed");
    }

    setLoading(false);
  };

  const handleContinue = () => {
    if (!startupName.trim()) {
      alert("Please enter a startup name");
      return;
    }

    navigate("/workspace", {
      state: {
        startupId: result.startupId,
        startupName
      }
    });
  };

  const score = result?.feasibility?.score ?? 0;
  const isPromising = score >= 0.4;

  return (
    <div>
      <MainLayout />

      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center px-4">
        <div className="w-full max-w-4xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 rounded-2xl p-10 shadow-xl">

          {/* Header */}
          <h1 className="text-3xl font-bold text-center mb-8
                         bg-gradient-to-r from-blue-400 to-indigo-500
                         bg-clip-text text-transparent">
            Startup Feasibility Checker
          </h1>

          {/* Form */}
          <div className="space-y-5">
            <textarea
              name="idea"
              rows={4}
              placeholder="Describe your startup idea in simple words"
              value={form.idea}
              onChange={handleChange}
              className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700
                         rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="location"
              placeholder="Target location (India, Bangalore, etc.)"
              value={form.location}
              onChange={handleChange}
              className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700
                         rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="bg-zinc-800 text-zinc-100 border border-zinc-700
                           rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Budget</option>
                <option value="low">Low (₹0–2L)</option>
                <option value="medium">Medium (₹2–10L)</option>
                <option value="high">High (₹10L+)</option>
              </select>

              <select
                name="audience"
                value={form.audience}
                onChange={handleChange}
                className="bg-zinc-800 text-zinc-100 border border-zinc-700
                           rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Audience</option>
                <option value="students">Students</option>
                <option value="professionals">Professionals</option>
                <option value="businesses">Businesses</option>
                <option value="general">General Public</option>
              </select>
            </div>

            <button
              onClick={checkFeasibility}
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600
                         hover:opacity-90 transition text-white py-3
                         rounded-lg font-semibold"
            >
              {loading ? "Analyzing..." : "Check Feasibility"}
            </button>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </div>

          {/* Result */}
          {result?.feasibility && (
            <div className="mt-10 bg-zinc-900 border border-zinc-700 rounded-xl p-6 space-y-3">
              <p className="text-zinc-300">
                <span className="text-blue-400 font-semibold">Problem:</span>{" "}
                {result.feasibility.problem}
              </p>
              <p className="text-zinc-300">
                <span className="text-blue-400 font-semibold">Existing Solutions:</span>{" "}
                {result.feasibility.existingSolutions}
              </p>
              <p className="text-zinc-300">
                <span className="text-blue-400 font-semibold">Market Gap:</span>{" "}
                {result.feasibility.marketGap}
              </p>
              <p className="text-zinc-300">
                <span className="text-blue-400 font-semibold">Feasibility Score:</span>{" "}
                {result.feasibility.score} / 10
              </p>
              <p className="text-zinc-300">
                <span className="text-blue-400 font-semibold">Justification:</span>{" "}
                {result.feasibility.justification}
              </p>
              <p className="text-zinc-300">
                <span className="text-blue-400 font-semibold">Category:</span>{" "}
                {result.feasibility.category}
              </p>
            </div>
          )}

          {/* Success */}
          {isPromising && (
            <div className="mt-8 bg-green-900/30 border border-green-600 rounded-xl p-6 text-center">
              <h2 className="text-2xl font-bold text-green-400">
                🎉 Idea looks promising!
              </h2>
              <p className="text-zinc-300 mt-2">
                Give your startup a name to continue
              </p>

              <input
                type="text"
                placeholder="Startup name"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                className="mt-4 w-full bg-zinc-800 text-zinc-100
                           border border-zinc-700 rounded-lg p-3
                           focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <button
                onClick={handleContinue}
                className="mt-4 bg-green-600 hover:bg-green-700
                           text-white px-6 py-2 rounded-lg font-semibold"
              >
                Continue →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
