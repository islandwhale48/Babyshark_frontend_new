import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
const FailureSimulator = () => {
  const { startupId } = useParams(); // future use

  const [scenarios, setScenarios] = useState([]);
  const [level, setLevel] = useState("easy");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -------- FETCH SCENARIOS (effect only does side-effects) -------- */

  useEffect(() => {
    setLoading(true);

    fetch(
      `http://localhost:5000/api/failure-simulator?level=${level}`
    )
      .then(res => res.json())
      .then(data => {
        setScenarios(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [level]);

  const scenario = scenarios[index];

  /* -------- USER INTENT HANDLERS -------- */

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    setIndex(0);        // ✅ reset here
    setSelected(null);  // ✅ reset here
  };

  const handleOption = (option) => {
    setSelected(option);
  };

  const nextScenario = () => {
    setIndex(prev => prev + 1);
    setSelected(null);
  };

  /* -------- STATES -------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0c] text-zinc-400">
        Loading scenarios…
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0c] text-zinc-400">
        No scenarios available for this level.
      </div>
    );
  }

  /* -------- UI -------- */

  return (
    <div><MainLayout/>
    <div className="min-h-screen bg-[#0b0b0c] flex justify-center px-6 py-12 text-zinc-100">
      <div className="w-full max-w-3xl space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            Decision Practice
          </h1>
          <p className="text-zinc-400 mt-1">
            Practice tough startup decisions before they happen
          </p>
        </div>

        {/* LEVEL SELECTOR */}
        <div className="flex gap-3">
          {["easy", "medium", "hard"].map(l => (
            <button
              key={l}
              onClick={() => handleLevelChange(l)}
              className={`px-4 py-2 rounded-full text-sm border transition
                ${
                  level === l
                    ? "bg-violet-600 border-violet-600 font-semibold"
                    : "bg-[#111114] border-[#1f1f22] text-zinc-400 hover:text-white"
                }`}
            >
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>

        {/* SCENARIO CARD */}
        <div className="bg-[#111114] border border-[#1f1f22] rounded-2xl p-6 space-y-4">

          <div className="flex gap-3 text-sm text-zinc-400">
            <span>{scenario.level.toUpperCase()}</span>
            <span>•</span>
            <span>{scenario.domain}</span>
          </div>

          <h2 className="text-xl font-semibold">
            {scenario.title}
          </h2>

          <p className="text-zinc-300">
            {scenario.situation}
          </p>

          {/* OPTIONS */}
          <div className="space-y-3 pt-4">
            {scenario.options.map((opt, i) => (
              <button
                key={i}
                disabled={!!selected}
                onClick={() => handleOption(opt)}
                className={`w-full text-left p-4 rounded-xl border transition
                  ${
                    selected
                      ? "border-[#222] bg-[#0b0b0c] text-zinc-400"
                      : "border-[#333] hover:border-violet-500 bg-black"
                  }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {/* FEEDBACK */}
          {selected && (
            <div className="mt-6 bg-[#0b0b0c] border border-[#222] rounded-xl p-4">
              <p className="text-zinc-300">
                {selected.feedback}
              </p>

              {scenario.learning?.length > 0 && (
                <div className="mt-4 text-sm text-zinc-400">
                  <p className="font-medium text-zinc-300 mb-1">
                    Learn more:
                  </p>
                  <ul className="list-disc list-inside">
                    {scenario.learning.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
              )}

              {index < scenarios.length - 1 && (
                <button
                  onClick={nextScenario}
                  className="mt-4 px-4 py-2 rounded-lg bg-violet-600 font-semibold"
                >
                  Next Scenario →
                </button>
              )}

              {index === scenarios.length - 1 && (
                <p className="mt-4 text-zinc-400 italic">
                  You’ve completed this level.
                </p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
    </div>
  );
};

export default FailureSimulator;
