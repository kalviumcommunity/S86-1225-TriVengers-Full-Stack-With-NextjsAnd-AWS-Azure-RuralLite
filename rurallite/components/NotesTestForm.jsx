import React, { useState } from "react";
export default function NotesTestForm() {
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [result, setResult] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, userId }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    }
  };
  return (
    <div
      style={{
        maxWidth: 500,
        margin: "2rem auto",
        padding: 20,
        border: "1px solid #ccc",
      }}
    >
      {" "}
      <h2>Test Note Input Sanitization</h2>{" "}
      <form onSubmit={handleSubmit}>
        {" "}
        <div>
          {" "}
          <label>
            User ID:{" "}
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </label>{" "}
        </div>{" "}
        <div>
          {" "}
          <label>
            Note Content:{" "}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
            />
          </label>{" "}
        </div>{" "}
        <button type="submit">Submit Note</button>{" "}
      </form>{" "}
      {result && (
        <div style={{ marginTop: 20 }}>
          {" "}
          <strong>API Response:</strong>{" "}
          <pre>{JSON.stringify(result, null, 2)}</pre>{" "}
        </div>
      )}{" "}
    </div>
  );
}
