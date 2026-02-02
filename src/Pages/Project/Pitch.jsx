import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// 🔹 Remove markdown completely
const stripMarkdown = (text = "") => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#+\s?/g, "")
    .replace(/`/g, "")
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
  const [loadingAI, setLoadingAI] = useState(false);

  // media
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // 🔹 Load existing pitch
  useEffect(() => {
    fetch(`http://localhost:5000/api/pitch/${startupId}`)
      .then(r => r.json())
      .then(data => {
        if (!data) return;

        setForm(data.form || {});
        const baseText = data.chosenText || data.refinedText || "";
        setAiVersion(stripMarkdown(baseText));
        setImageUrl(data.imageUrl || "");
      });
  }, [startupId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔹 AI refinement
  const refineWithAI = async () => {
    setLoadingAI(true);

    const res = await fetch("http://localhost:5000/api/pitch/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setAiVersion(stripMarkdown(data.refined));
    setLoadingAI(false);
  };

  // 🔹 Upload image + video
  const uploadMedia = async () => {
    if (!imageFile && !videoFile) return;

    const fd = new FormData();
    fd.append("startupId", startupId);
    if (imageFile) fd.append("image", imageFile);
    if (videoFile) fd.append("video", videoFile);

    const res = await fetch("http://localhost:5000/api/pitch/media", {
      method: "POST",
      body: fd
    });

    const data = await res.json();
    if (data.imageUrl) setImageUrl(data.imageUrl);
  };

  const saveDraft = async () => {
    setLoadingAI(true);
    await uploadMedia();

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
    alert("Draft saved");
  };

  const publish = async () => {
    setLoadingAI(true);
    await uploadMedia();

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
      <div className="p-8 border-r border-[#1f1f22] flex flex-col gap-4 overflow-y-auto">
        <h2 className="text-xl font-semibold">Create Your Pitch</h2>

        <input
          name="startupName"
          placeholder="Startup Name"
          value={form.startupName}
          onChange={handleChange}
          className="p-3 rounded-lg bg-[#121214] border border-[#222]"
        />

        <input
          name="tagline"
          placeholder="One-line tagline"
          value={form.tagline}
          onChange={handleChange}
          className="p-3 rounded-lg bg-[#121214] border border-[#222]"
        />

        {["problem", "solution", "audience", "uniqueness", "ask"].map(k => (
          <textarea
            key={k}
            name={k}
            placeholder={k}
            value={form[k]}
            onChange={handleChange}
            className="min-h-[90px] p-3 rounded-lg bg-[#121214] border border-[#222]"
          />
        ))}

        <select
          name="stage"
          value={form.stage}
          onChange={handleChange}
          className="p-3 rounded-lg bg-[#121214] border border-[#222]"
        >
          <option value="">Current Stage</option>
          <option>Idea</option>
          <option>Prototype</option>
          <option>Early Users</option>
          <option>Revenue</option>
        </select>

        {/* 📸 IMAGE BOX */}
        <div className="border border-dashed border-[#333] rounded-xl p-4 bg-[#0f0f11]">
          <p className="text-sm mb-2 text-zinc-400">Cover Image</p>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="cover"
              className="mb-3 rounded-lg w-full object-cover"
            />
          )}

          <input
  id="cover-image"
  type="file"
  accept="image/*"
  hidden
  onChange={(e) => setImageFile(e.target.files[0])}
/>

<label
  htmlFor="cover-image"
  className="inline-flex items-center justify-center
             px-4 py-2 rounded-lg
             bg-[#1f1f22] border border-[#333]
             text-sm font-medium text-white
             cursor-pointer hover:bg-[#26262a]
             transition"
>
  Select Cover Image
</label>

        </div>

        {/* 🎥 VIDEO BOX */}
        <div className="border border-dashed border-[#333] rounded-xl p-4 bg-[#0f0f11]">
          <p className="text-sm mb-2 text-zinc-400">Demo Video</p>

          {videoFile && (
            <p className="text-xs text-zinc-300 mb-2">
              Selected: {videoFile.name}
            </p>
          )}

          <input
  id="demo-video"
  type="file"
  accept="video/*"
  hidden
  onChange={(e) => setVideoFile(e.target.files[0])}
/>

<label
  htmlFor="demo-video"
  className="inline-flex items-center justify-center
             px-4 py-2 rounded-lg
             bg-[#1f1f22] border border-[#333]
             text-sm font-medium text-white
             cursor-pointer hover:bg-[#26262a]
             transition"
>
  Select Demo Video
</label>

        </div>

        <button
          onClick={refineWithAI}
          className="mt-2 py-3 rounded-lg bg-violet-600 font-semibold"
        >
          {loadingAI ? "Refining…" : "Refine with AI"}
        </button>

        <button
          onClick={saveDraft}
          className="py-3 rounded-lg border border-[#333]"
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
        <h2 className="text-xl font-semibold mb-3">Pitch Preview</h2>

        {!aiVersion && (
          <p className="text-zinc-400">
            AI refined version will appear here.
          </p>
        )}

        {aiVersion && (
          <div className="p-6 rounded-xl bg-[#121214] border border-[#222]">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">
              {aiVersion}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pitch;
