import React from "react";
import { useNavigate } from "react-router-dom";

/* -------- helper: extract Problem section -------- */

const extractProblem = (text = "") => {
  const match = text.match(
    /Problem:\s*([\s\S]*?)(?:\n[A-Z][a-zA-Z ]+:|$)/
  );
  return match ? match[1].trim() : "";
};

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  // ✅ ALWAYS read text this way
  const fullText = post.chosenText || post.refinedText || "";
  const problemText = extractProblem(fullText);

  return (
    <div
      onClick={() => navigate(`/pitch/${post._id}`)}
      className="cursor-pointer bg-black rounded-2xl overflow-hidden
                 border border-[#1f1f22] hover:border-violet-500/40 transition"
    >
      {/* IMAGE */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Startup cover"
          className="w-full h-52 object-cover pointer-events-none"
        />
      )}

      {/* CONTENT */}
      <div className="p-5 text-zinc-100 space-y-2 pointer-events-none">
        <h3 className="text-lg font-semibold leading-tight">
          {post.form?.startupName || "Untitled Startup"}
        </h3>

        {post.form?.tagline && (
          <p className="text-sm text-zinc-400">
            {post.form.tagline}
          </p>
        )}

        {/* ✅ PROBLEM FROM REFINED / CHOSEN TEXT */}
        {problemText ? (
          <p className="text-sm text-zinc-300 line-clamp-4">
            <span className="text-zinc-400 font-medium">Problem: </span>
            {problemText}
          </p>
        ) : (
          <p className="text-sm text-zinc-500 italic">
            Problem not described yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default PostCard;
