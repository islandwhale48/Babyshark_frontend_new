import React from "react";
import { useEffect, useState } from "react";
import PostCard from "../Layout/PostCard.jsx";

const TABS = ["New", "Promising", "Ideas"];

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("New");

  useEffect(() => {
    fetch("http://localhost:5000/api/pitch/explore/feed")
      .then(r => r.json())
      .then(data => {
        console.log(data)
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = posts.filter(p => {
    if (activeTab === "New") return true;
    if (activeTab === "Promising") return p?.feasibility?.score >= 7;
    if (activeTab === "Ideas") return p?.form?.stage === "Idea";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0c] text-zinc-400">
        Loading explore feed…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0c] flex justify-center pt-12">
      <div className="w-full max-w-7xl px-7 text-zinc-100">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-[34px] font-bold">
            Explore Startups
          </h1>
          <p className="text-zinc-400 mt-1">
            Discover what founders are building
          </p>
        </div>

        {/* TAB BAR */}
        <div className="flex gap-3 mb-7 border-b border-[#1f1f22] pb-3">
          {TABS.map(tab => {
            const active = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-2 text-sm rounded-full transition
                  border
                  ${
                    active
                      ? "bg-violet-600 text-white font-semibold border-transparent"
                      : "bg-[#121214] text-indigo-200 border-[#262626] hover:bg-[#1a1a1d]"
                  }
                `}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* GRID */}
        <div className="grid gap-[26px] grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
          {filtered.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Explore;
