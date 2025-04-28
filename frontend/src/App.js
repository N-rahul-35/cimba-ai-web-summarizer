import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Home/Summarizer Page Component
const Summarizer = () => {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8080/api/summarize?url=${encodeURIComponent(url)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to get summary. Please check the URL and try again.");
      setSummary("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Website Summarizer</h1>

      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            required
            className="url-input"
          />
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </form>

      {summary && (
        <div className="summary-container">
          <h2 className="summary-title">Summary</h2>
          <p className="summary-content">{summary}</p>
        </div>
      )}

      <style jsx>{`
        .container {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        .title {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          font-weight: 600;
          font-size: 2rem;
        }
        .form {
          margin-bottom: 1.5rem;
        }
        .input-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .url-input {
          flex: 1;
          padding: 0.75rem;
          border-radius: 6px;
          border: 1px solid #ddd;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        .url-input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }
        .submit-button {
          background-color: #3498db;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: background-color 0.3s;
        }
        .submit-button:hover {
          background-color: #2980b9;
        }
        .submit-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        .error-message {
          color: #e74c3c;
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }
        .summary-container {
          padding: 1.5rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          margin-top: 1.5rem;
          border: 1px solid #eaecef;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .summary-title {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          font-weight: 500;
        }
        .summary-content {
          line-height: 1.7;
          color: #34495e;
          font-size: 1.05rem;
        }
      `}</style>
    </div>
  );
};

// History Page Component
const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/api/history", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
        setError("Failed to load history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Summary History</h1>

      {loading && <div className="loading">Loading history...</div>}

      {error && <div className="error-message">{error}</div>}

      {!loading && !error && history.length === 0 && (
        <div className="empty-state">
          No summary history found. Try summarizing some websites first!
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-item">
              <h3 className="history-url">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.url}
                </a>
              </h3>
              <p className="history-summary">{item.summary}</p>
              <div className="history-timestamp">
                {new Date(item.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .container {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        .title {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          font-weight: 600;
          font-size: 2rem;
        }
        .loading {
          text-align: center;
          padding: 2rem;
          color: #7f8c8d;
          font-size: 1.1rem;
        }
        .error-message {
          color: #e74c3c;
          padding: 1rem;
          background-color: #fadbd8;
          border-radius: 6px;
          margin-bottom: 1rem;
        }
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px dashed #cbd5e0;
          color: #7f8c8d;
          font-size: 1.1rem;
        }
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .history-item {
          padding: 1.25rem;
          background-color: #ffffff;
          border-radius: 8px;
          border: 1px solid #eaecef;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .history-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .history-url {
          margin: 0 0 0.75rem 0;
          font-size: 1.2rem;
        }
        .history-url a {
          color: #3498db;
          text-decoration: none;
          word-break: break-all;
        }
        .history-url a:hover {
          text-decoration: underline;
        }
        .history-summary {
          margin: 0.75rem 0;
          line-height: 1.7;
          color: #34495e;
          font-size: 1rem;
        }
        .history-timestamp {
          color: #95a5a6;
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
};

// Navigation Component
const Navigation = () => {
  const [active, setActive] = useState(window.location.pathname);

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="logo">WebSum</div>
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${active === "/" ? "active" : ""}`}
            onClick={() => setActive("/")}
          >
            Summarizer
          </Link>
          <Link
            to="/history"
            className={`nav-link ${active === "/history" ? "active" : ""}`}
            onClick={() => setActive("/history")}
          >
            History
          </Link>
        </div>
      </div>

      <style jsx>{`
        .navigation {
          background-color: #ffffff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          padding: 1rem 2rem;
          margin-bottom: 2rem;
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1000px;
          margin: 0 auto;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: #3498db;
        }
        .nav-links {
          display: flex;
          gap: 1.5rem;
        }
        .nav-link {
          color: #7f8c8d;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.5rem 0;
          position: relative;
          transition: color 0.3s;
        }
        .nav-link:hover {
          color: #3498db;
        }
        .nav-link.active {
          color: #3498db;
        }
        .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #3498db;
        }
      `}</style>
    </nav>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <div className="app">
        <Navigation />

        <Routes>
          <Route path="/" element={<Summarizer />} />
          <Route path="/history" element={<History />} />
        </Routes>

        <style jsx>{`
          .app {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9fafb;
            min-height: 100vh;
          }
        `}</style>
      </div>
    </Router>
  );
};

export default App;
