import React, { useEffect, useState } from "react";

export default function SubscribeForm() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("⏳ Submitting...");

    try {
      const res = await fetch("http://localhost:5000/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ You have been subscribed!");
        setFormData({ email: "", fullName: "" }); // reset form
      } else {
        setMessage("❌ Error: " + JSON.stringify(data.error));
      }
    } catch (err) {
      setMessage("❌ Failed: " + err.message);
    }
  };

  // clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "400px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        background: "#fff"
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>Subscribe</h2>

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          fontSize: "14px"
        }}
      />

      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          fontSize: "14px"
        }}
      />

      <button
        type="submit"
        style={{
          padding: "10px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "bold"
        }}
      >
        Subscribe
      </button>

      {message && (
        <p
          style={{
            textAlign: "center",
            marginTop: "10px",
            color: message.includes("✅")
              ? "green"
              : message.includes("⏳")
              ? "orange"
              : "red",
            fontWeight: "500"
          }}
        >
          {message}
        </p>
      )}
    </form>
    
  );
}
