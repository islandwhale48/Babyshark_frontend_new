import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <MainLayout />

      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center text-center px-6 pt-28">
        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight mb-4">
          Baby<span className="text-violet-500">Shark</span> 🚀
        </h1>

        <p className="text-zinc-400 max-w-xl mb-16">
          Your AI co-pilot to build, validate, and scale startups faster.
        </p>

        {/* ACTION BUTTONS */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row gap-6 mb-32">
          <button
            onClick={() => navigate("/home")}
            className="flex-1 p-6 rounded-xl bg-zinc-900 border border-zinc-800
                       hover:border-violet-500 hover:bg-zinc-800
                       transition-all text-left group"
          >
            <div className="text-3xl mb-2">🚀</div>
            <h2 className="text-lg font-semibold group-hover:text-violet-400">
              I have an idea
            </h2>
            <p className="text-sm text-zinc-400">
              Build, validate, and launch your startup
            </p>
          </button>

          <button
            disabled
            className="flex-1 p-6 rounded-xl bg-zinc-900 border border-zinc-800
                       opacity-50 cursor-not-allowed text-left"
          >
            <div className="text-3xl mb-2">💰</div>
            <h2 className="text-lg font-semibold">I want to invest</h2>
            <p className="text-sm text-zinc-400">
              Discover promising startups (coming soon)
            </p>
          </button>

          <button
            disabled
            className="flex-1 p-6 rounded-xl bg-zinc-900 border border-zinc-800
                       opacity-50 cursor-not-allowed text-left"
          >
            <div className="text-3xl mb-2">🤝</div>
            <h2 className="text-lg font-semibold">I want to work</h2>
            <p className="text-sm text-zinc-400">
              Join exciting startup journeys (coming soon)
            </p>
          </button>
        </div>
      </div>

      {/* ================= FEATURES SECTION ================= */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-4">
          What BabyShark helps you do
        </h2>

        <p className="text-zinc-400 text-center max-w-2xl mx-auto mb-14">
          From idea validation to execution, BabyShark brings everything founders
          need into one intelligent workspace.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <Feature
            icon="🧠"
            title="AI Idea Validator"
            desc="Test your startup idea against real-world constraints, market demand, and feasibility."
          />

          <Feature
            icon="📊"
            title="Smart Roadmap Builder"
            desc="Get step-by-step execution plans tailored to your idea, stage, and resources."
          />

          <Feature
            icon="📝"
            title="Pitch & Content Generator"
            desc="Generate investor pitches, product descriptions, and launch posts instantly."
          />

          <Feature
            icon="📅"
            title="Daily Founder Planner"
            desc="AI-curated daily tasks that keep you focused on what actually moves the needle."
          />

          <Feature
            icon="⚠️"
            title="Failure Simulator"
            desc="Simulate risks, mistakes, and worst-case scenarios before they happen."
          />

          <Feature
            icon="📜"
            title="License & Compliance Guide"
            desc="Know exactly which registrations, licenses, and legal steps apply to your startup."
          />
        </div>
      </div>
    </div>
  );
}

/* FEATURE CARD */
function Feature({ icon, title, desc }) {
  return (
    <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800
                    hover:border-violet-500 transition-all">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-zinc-400">{desc}</p>
    </div>
  );
}
