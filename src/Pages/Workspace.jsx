import React from "react"
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FeatureCard from "../Layout/FeatureCard";

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
  <div className="min-h-screen bg-white flex justify-center pt-16 px-6">
    <div className="w-full max-w-6xl">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 mb-1">
          Startup Workspace
        </h1>
        <p className="text-sm text-zinc-500">
          Build, review, and shape your startup step by step
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <FeatureCard
          title="Roadmap"
          loading={loadingTile === "roadmap"}
          className="workspace-card"
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
          className="workspace-card"
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
          className="workspace-card"
          onClick={() =>
            navigate(`/workspace/${startupId}/licenses`)
          }
        />

        <FeatureCard
          title="Daily Planner"
          loading={loadingTile === "planner"}
          className="workspace-card"
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
          className="workspace-card"
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
          className="workspace-card"
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
);

};

export default Workspace;
