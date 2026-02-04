import React from "react"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "../../Layout/MainLayout";
const Roadmap = () => {
  const { startupId } = useParams();
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/roadmap/${startupId}`)
      .then(res => res.json())
      .then(data => {
        const cleanText = data.roadmap.replace(/\*\*/g, "");
        setRoadmap(cleanText);
        setLoading(false);
      });
  }, [startupId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-300">
        <p className="animate-pulse text-sm">Preparing your roadmap…</p>
      </div>
    );
  }

  return (
    <div><MainLayout/>
    <div className="min-h-screen bg-zinc-950 py-12 px-4 flex justify-center">
      <div className="w-full max-w-4xl">

        {/* Main Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8 md:p-10">

          {/* Header */}
          <h1 className="text-3xl font-semibold text-white mb-2">
            90-Day Startup Roadmap
          </h1>

          <p className="text-sm text-zinc-400 mb-6">
            A practical execution plan to take your idea from zero to launch.
          </p>

          <div className="h-px bg-zinc-800 mb-8" />

          {/* Content */}
          <div className="space-y-3 leading-relaxed">
            {roadmap.split("\n").map((line, i) => {
              // Section headers
              if (line.startsWith("Week") || line.endsWith(":")) {
                return (
                  <div
                    key={i}
                    className="mt-8 mb-3 px-4 py-2 bg-zinc-800/50 border-l-4 border-blue-500 rounded"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {line}
                    </h3>
                  </div>
                );
              }

              // Empty lines
              if (line.trim() === "") {
                return <div key={i} className="h-3" />;
              }

              // Normal text
              return (
                <p
                  key={i}
                  className="text-sm text-zinc-300 pl-2"
                >
                  {line}
                </p>
              );
            })}
          </div>

        </div>

        {/* Footer hint */}
        <p className="text-xs text-zinc-500 mt-6 text-center">
          This roadmap is dynamically generated based on your startup inputs.
        </p>
      </div>
    </div>
    </div>
  );
};

export default Roadmap;
