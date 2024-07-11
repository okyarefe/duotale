"use client";
import React from "react";

const ErrorPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.header}>Oops!</h1>
        <p style={styles.message}>The story could not be found.</p>
        <p style={styles.subMessage}>
          It might have been removed or you may not have permission to view it.
        </p>
        <button style={styles.button} onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    color: "#343a40",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  content: {
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  header: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#dc3545",
  },
  message: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
  },
  subMessage: {
    fontSize: "1rem",
    marginBottom: "1.5rem",
    color: "#6c757d",
  },
  button: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default ErrorPage;
