import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Pitch = () => {
  const { startupId } = useParams();

  const [form, setForm] = useState({
    startupName: "",
    tagline: "",
    problem: "",
    solution: "",
    audience: "",
    uniqueness: "",
    stage: "",
    ask: ""
  });

  const [aiVersion, setAiVersion] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // Load existing pitch
  useEffect(() => {
    fetch(`http://localhost:5000/api/pitch/${startupId}`)
      .then(r => r.json())
      .then(data => {
        if (data) {
          setForm(data.form || {});
          setAiVersion(data.refinedText || "");
        }
      })
      .catch(() => {});
  }, [startupId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const refineWithAI = async () => {
    setLoadingAI(true);

    const res = await fetch("http://localhost:5000/api/pitch/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setAiVersion(data.refined);
    setLoadingAI(false);
  };

  const uploadMedia = async () => {
    console.log("uploadMedia called", { imageFile, videoFile });
    if (!imageFile && !videoFile) return;

    const fd = new FormData();
    fd.append("startupId", startupId);

    if (imageFile) fd.append("image", imageFile);
    if (videoFile) fd.append("video", videoFile);

    await fetch("http://localhost:5000/api/pitch/media", {
      method: "POST",
      body: fd
    });
  };

  const saveDraft = async () => {
    setLoadingAI(true);

    // upload media first
    await uploadMedia();

    // save pitch text
    await fetch("http://localhost:5000/api/pitch/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startupId,
        form,
        refinedText: aiVersion
      })
    });

    setLoadingAI(false);
   // alert("Draft saved");
  };

  const publish = async () => {
    setLoadingAI(true);

    await fetch("http://localhost:5000/api/pitch/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startupId,
        chosenText: aiVersion
      })
    });

    setLoadingAI(false);
    alert("Posted to Explore!");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0b0b0c] text-zinc-100">

      {/* LEFT */}
      <div className="p-8 border-r border-[#1f1f22] flex flex-col gap-3 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">Create Your Pitch</h2>

        <input
          name="startupName"
          placeholder="Startup Name"
          value={form.startupName || ""}
          onChange={handleChange}
          className="p-3 rounded-lg bg-[#121214] border border-[#222]"
        />

        <input
          name="tagline"
          placeholder="One-line tagline"
          value={form.tagline || ""}
          onChange={handleChange}
          className="p-3 rounded-lg bg-[#121214] border border-[#222]"
        />

        <textarea
          name="problem"
          placeholder="What problem are you solving?"
          value={form.problem || ""}
          onChange={handleChange}
          className="min-h-[95px] p-3 rounded-lg bg-[#121214] border border-[#222]"
        />

        <textarea
          name="solution"
          placeholder="How does your startup solve it?"
          value={form.solution || ""}
          onChange={handleChange}
          className="min-h-[95px] p-3 rounded-lg bg-[#121214] border border-[#222]"
        />

        <textarea
          name="audience"
          placeholder="Who is this for?"
          value={form.audience || ""}
          onChange={handleChange}
          className="min-h-[95px] p-3 rounded-lg bg-[#121214] border border-[#222]"
        />

        <textarea
          name="uniqueness"
          placeholder="What makes you different?"
          value={form.uniqueness || ""}
          onChange={handleChange}
          className="min-h-[95px] p-3 rounded-lg bg-[#121214] border border-[#222]"
        />

        <select
          name="stage"
          value={form.stage || ""}
          onChange={handleChange}
          className="p-3 rounded-lg bg-[#121214] border border-[#222]"
        >
          <option value="">Current Stage</option>
          <option>Idea</option>
          <option>Prototype</option>
          <option>Early Users</option>
          <option>Revenue</option>
        </select>

        <textarea
          name="ask"
          placeholder="What are you looking for?"
          value={form.ask || ""}
          onChange={handleChange}
          className="min-h-[95px] p-3 rounded-lg bg-[#121214] border border-[#222]"
        />

        <label className="text-sm text-zinc-400">Cover Image</label>
       <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    console.log("IMAGE SELECTED:", e.target.files[0]);
    setImageFile(e.target.files[0]);
  }}
/>


        <label className="text-sm text-zinc-400">Demo Video</label>
        <input
          type="file"
          accept="video/*"
          className="text-zinc-400 text-sm"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />

        <button
          onClick={refineWithAI}
          className="mt-2 py-3 rounded-lg bg-violet-600 font-semibold"
        >
          {loadingAI ? "Refining…" : "Refine with AI"}
        </button>

        <button
          onClick={saveDraft}
          className="py-3 rounded-lg border border-[#333] bg-[#1f2937]"
        >
          Save Draft
        </button>

        <button
          onClick={publish}
          className="py-3 rounded-lg bg-emerald-500 text-black font-bold"
        >
          Post to Explore
        </button>
      </div>

      {/* RIGHT */}
      <div className="p-8 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-3">AI Refined Pitch</h2>

        {!aiVersion && (
          <p className="text-zinc-400">
            AI refined version will appear here.
          </p>
        )}

        {aiVersion && (
          <div className="mt-4 p-6 rounded-xl bg-[#121214] border border-[#222]">
            <pre className="whitespace-pre-wrap leading-relaxed text-sm">
              {aiVersion}
            </pre>

            <div className="flex gap-3 mt-6">
              <button
                onClick={publish}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold"
              >
                Use AI Version
              </button>

              <button
                onClick={saveDraft}
                className="px-4 py-2 rounded-lg border border-[#333]"
              >
                Keep Mine
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pitch;
