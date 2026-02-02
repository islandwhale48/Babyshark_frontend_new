import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// 🔹 Helper to remove ALL markdown
const stripMarkdown = (text = "") => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // **bold**
    .replace(/\*(.*?)\*/g, "$1")     // *italic / bullets*
    .replace(/#+\s?/g, "")           // headings like ##
    .replace(/`/g, "")               // inline code
    .trim();
};

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
  const [editableText, setEditableText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // 🔹 Load existing pitch (CLEAN IT HERE)
  useEffect(() => {
    fetch(`http://localhost:5000/api/pitch/${startupId}`)
      .then(res => res.json())
      .then(data => {
        if (!data) return;

        setForm(data.form || {});

        const baseText = data.chosenText || data.refinedText || "";
        const cleaned = stripMarkdown(baseText);

        setAiVersion(cleaned);
        setEditableText(cleaned);
      });
  }, [startupId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔹 AI refinement (CLEAN IMMEDIATELY)
  const refineWithAI = async () => {
    setLoadingAI(true);

    const res = await fetch("http://localhost:5000/api/pitch/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    const cleaned = stripMarkdown(data.refined);

    setAiVersion(cleaned);
    setEditableText(cleaned);
    setLoadingAI(false);
  };

  // 🔹 Upload image/video
  const uploadMedia = async () => {
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

  // 🔹 Save draft
  const saveDraft = async () => {
    setLoadingAI(true);

    await uploadMedia();

    await fetch("http://localhost:5000/api/pitch/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startupId,
        form,
        refinedText: editableText // already clean
      })
    });

    setLoadingAI(false);
    alert("Draft saved");
  };

  // 🔹 Publish to Explore (ALREADY CLEAN)
  const publish = async () => {
    setLoadingAI(true);

    await fetch("http://localhost:5000/api/pitch/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startupId,
        chosenText: editableText
      })
    });

    setLoadingAI(false);
    alert("Updated on Explore!");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0b0b0c] text-zinc-100">

      {/* LEFT — INPUT */}
      <div className="p-8 border-r border-[#1f1f22] flex flex-col gap-3 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">Create Your Pitch</h2>

        {Object.keys(form).map(key => (
          key !== "stage" ? (
            <textarea
              key={key}
              name={key}
              placeholder={key}
              value={form[key] || ""}
              onChange={handleChange}
              className="p-3 rounded-lg bg-[#121214] border border-[#222]"
            />
          ) : null
        ))}

        <label className="text-sm text-zinc-400">Cover Image</label>
        <input type="file" onChange={e => setImageFile(e.target.files[0])} />

        <label className="text-sm text-zinc-400">Demo Video</label>
        <input type="file" onChange={e => setVideoFile(e.target.files[0])} />

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
          Update Explore
        </button>
      </div>

      {/* RIGHT — EDITABLE TEXT (ALWAYS CLEAN) */}
      <div className="p-8 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">Edit Pitch for Explore</h2>
        <p className="text-sm text-zinc-400 mb-3">
          This text will appear on the Explore page
        </p>

        <textarea
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
          className="w-full min-h-[400px] p-4 rounded-xl
                     bg-[#121214] border border-[#222]
                     text-sm leading-relaxed resize-none"
        />
      </div>
    </div>
  );
};

export default Pitch;
