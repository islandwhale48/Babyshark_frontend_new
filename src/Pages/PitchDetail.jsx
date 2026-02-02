import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/* ---------- WhatsApp helper ---------- */
const openWhatsApp = (startupName) => {
  const phoneNumber = "919798596424"; // 🔁 replace with your number
  const message = `Hi! I came across your startup "${startupName}" on the Explore page and would love to connect.`;

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  window.open(url, "_blank");
};

const PitchDetail = () => {
  const { pitchId } = useParams();
  const [pitch, setPitch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/pitch/${pitchId}`)
      .then(res => res.json())
      .then(data => {
        setPitch(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pitchId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0c] text-zinc-400">
        Loading pitch…
      </div>
    );
  }

  if (!pitch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0c] text-zinc-400">
        Pitch not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-zinc-100 flex justify-center px-6 py-10">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ---------- LEFT PANEL ---------- */}
        <div className="space-y-6">

          {/* Media */}
          {pitch.videoUrl ? (
            <video
              src={pitch.videoUrl}
              controls
              className="w-full rounded-2xl border border-[#1f1f22]"
            />
          ) : pitch.imageUrl ? (
            <img
              src={pitch.imageUrl}
              alt="Startup cover"
              className="w-full rounded-2xl border border-[#1f1f22] object-cover"
            />
          ) : null}

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold">
              {pitch.form?.startupName || "Untitled Startup"}
            </h1>
            {pitch.form?.tagline && (
              <p className="text-zinc-400 mt-1">
                {pitch.form.tagline}
              </p>
            )}
          </div>

          {/* Quick info */}
          <div className="space-y-3 text-sm text-zinc-300">
            {pitch.form?.audience && (
              <p>
                <span className="text-zinc-400">Audience:</span>{" "}
                {pitch.form.audience}
              </p>
            )}
            {pitch.form?.stage && (
              <p>
                <span className="text-zinc-400">Stage:</span>{" "}
                {pitch.form.stage}
              </p>
            )}
          </div>
        </div>

        {/* ---------- RIGHT PANEL ---------- */}
        <div className="bg-[#111114] border border-[#1f1f22] rounded-2xl p-8 flex flex-col">

          <h2 className="text-xl font-semibold mb-4">
            Pitch Overview
          </h2>

          {/* Refined / chosen pitch text */}
          <div className="flex-1 overflow-y-auto pr-2">
            {pitch.chosenText || pitch.refinedText ? (
              <pre className="whitespace-pre-wrap leading-relaxed text-sm text-zinc-300">
                {pitch.chosenText || pitch.refinedText}
              </pre>
            ) : (
              <p className="text-zinc-400">
                Pitch content not available yet.
              </p>
            )}
          </div>

          {/* Contact CTA */}
          <div className="pt-6 mt-6 border-t border-[#1f1f22]">
            <button
              onClick={() =>
                openWhatsApp(pitch.form?.startupName)
              }
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 transition font-semibold"
            >
              Contact Founder on WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PitchDetail;
