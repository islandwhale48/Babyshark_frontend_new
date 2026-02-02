import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/pitch/${post.startupId}`)}
    >
      {/* IMAGE */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.form?.startupName}
          style={styles.image}
        />
      )}

      {/* TEXT */}
      <h3 style={styles.cardTitle}>
        {post.form?.startupName || "Untitled Startup"}
      </h3>

      <p style={styles.tagline}>
        {post.form?.tagline}
      </p>

      <div style={styles.pitchText}>
        {post.chosenText?.slice(0, 120)}…
      </div>

      {/* ACTIONS */}
      <div
        style={styles.cardFooter}
        onClick={(e) => e.stopPropagation()} // prevent card click
      >
        <button
          style={styles.actionBtn}
          onClick={() => setLiked(!liked)}
        >
          {liked ? "♥ Liked" : "♡ Like"}
        </button>

        <button style={styles.actionBtn}>
          Save
        </button>
      </div>
    </div>
  );
};

export default PostCard;

const styles = {

  page: {
    minHeight: "100vh",
    background: "#0b0b0c",
    display: "flex",
    justifyContent: "center",
    paddingTop: 60
  },

  container: {
    width: "100%",
    maxWidth: 1200,
    padding: "0 24px",
    color: "#f5f5f5"
  },

  title: {
    fontSize: 32,
    fontWeight: 700
  },

  subtitle: {
    color: "#9ca3af",
    marginBottom: 28
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 24
  },

  card: {
    background: "#121214",
    border: "1px solid #222",
    borderRadius: 14,
    padding: 22,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    transition: "0.2s"
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 600
  },

  tagline: {
    color: "#a1a1aa",
    fontSize: 14
  },

  pitchText: {
    color: "#d4d4d8",
    fontSize: 14,
    lineHeight: 1.6
  },

  cardFooter: {
    display: "flex",
    gap: 10,
    marginTop: 10
  },

  actionBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #2a2a2a",
    background: "transparent",
    color: "#ddd",
    cursor: "pointer"
  },

  primaryBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    background: "#7c3aed",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer"
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#ddd"
  },
  image: {
  width: "100%",
  height: 170,
  objectFit: "cover",
  borderRadius: 10,
  marginBottom: 12
}

};
