import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Roadmap from "./Pages/Project/Roadmap";
import Pitch from "./Pages/Project/Pitch";
import Licenses from "./Pages/Project/Licenses";
import FailureSimulator from "./Pages/Project/FailureSimulator";
import MarketInsights from "./Pages/Project/MarketInsights"
import DailyPlanner from "./Pages/Project/DailyPlanner";
import Explore from "./Pages/Explore";
import FeasibilityCheck from "./Pages/FeasibilityCheck";
import Workspace from "./Pages/Workspace";
import PitchDetail from "./Pages/PitchDetail"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<FeasibilityCheck />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route
          path="/workspace/:startupId/licenses"
          element={<Licenses />}
        />

        <Route path="/workspace/:startupId/roadmap" element={<Roadmap />} />
        <Route path="/workspace/:startupId/pitch" element={<Pitch />} />
        <Route path="/workspace/:startupId/failuresimulator" element={<FailureSimulator />} />
        <Route path="/workspace/:startupId/marketinsights" element={<MarketInsights />} />
        <Route path="/workspace/:startupId/licenses" element={<Licenses />} />
        <Route path="/workspace/:startupId/dailyplanner" element={<DailyPlanner />} />
        <Route path="/pitch/:pitchId" element={<PitchDetail />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
