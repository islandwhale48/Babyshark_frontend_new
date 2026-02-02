import React from "react"
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FeatureCard from "../Layout/FeatureCard";
import MainLayout from "../Layout/MainLayout";
const Workspace = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const startupId = state?.startupId;

  const [loadingTile, setLoadingTile] = useState(null);

  const go = async (key, url, path) => {
    if (!startupId) return alert("Startup ID missing");

    setLoadingTile(key);

    try {
      await fetch(url);
      navigate(path);
    } catch {
      alert("Failed to open module");
    } finally {
      setLoadingTile(null);
    }
  };

  return (
<div><MainLayout/>
    <div className="min-h-screen bg-zinc-950 flex justify-center pt-16 px-4">
      
      <div className="w-full max-w-6xl text-zinc-100">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-1">
          Startup Workspace
        </h1>
        <p className="text-sm text-zinc-400 mb-8">
          Build and launch your startup step-by-step
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <FeatureCard
            title="Roadmap"
            loading={loadingTile === "roadmap"}
            onClick={() =>
              go(
                "roadmap",
                `http://localhost:5000/api/roadmap/${startupId}`,
                `/workspace/${startupId}/roadmap`
              )
            }
          />

          <FeatureCard
            title="Pitch"
            loading={loadingTile === "pitch"}
            onClick={() =>
              go(
                "pitch",
                `http://localhost:5000/api/pitch/${startupId}`,
                `/workspace/${startupId}/pitch`
              )
            }
          />

          <FeatureCard
  title="Licenses"
  loading={loadingTile === "licenses"}
  onClick={() =>
    navigate(`/workspace/${startupId}/licenses`)
  }
/>


          <FeatureCard
            title="Daily Planner"
            loading={loadingTile === "planner"}
            onClick={() =>
              go(
                "planner",
                `http://localhost:5000/api/dailyplanner/${startupId}`,
                `/workspace/${startupId}/dailyplanner`
              )
            }
          />

          <FeatureCard
            title="Failure Simulator"
            loading={loadingTile === "fail"}
            onClick={() =>
              go(
                "fail",
                `http://localhost:5000/api/failuresimulator/${startupId}`,
                `/workspace/${startupId}/failuresimulator`
              )
            }
          />

          <FeatureCard
            title="Market Insights"
            loading={loadingTile === "insights"}
            onClick={() =>
              go(
                "insights",
                `http://localhost:5000/api/marketinsights/${startupId}`,
                `/workspace/${startupId}/marketinsights`
              )
            }
          />

        </div>
      </div>
    </div>
    </div>
  );
};

export default Workspace;
