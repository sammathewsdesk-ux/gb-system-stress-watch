import React, { useState } from "react";
import "./App.css";

function App() {
  const pastEvents = [
    {
      id: 1,
      date: "8 January 2025",
      title: "High thermal constraint episode",
      signal: "\u00a33.2m",
      pattern: "Renewable-rich constraint episode",
      summary:
        "Elevated constraint costs coincided with strong wind and relatively low demand.",
      why:
        "This may indicate renewable output was high while network transfer capability or system flexibility was under pressure.",
      confidence: "Medium-high",
    },
    {
      id: 2,
      date: "18 November 2025",
      title: "Peak-demand stress episode",
      signal: "\u00a32.6m",
      pattern: "Demand-led stress pattern",
      summary:
        "Constraint costs rose during higher demand conditions with less evidence of wind-led stress.",
      why:
        "This suggests a more demand-led system pressure event rather than a classic renewable-curtailment-led pattern.",
      confidence: "Medium",
    },
    {
      id: 3,
      date: "3 March 2025",
      title: "Multi-factor system stress",
      signal: "\u00a32.1m",
      pattern: "Mixed operational pressures",
      summary:
        "Constraint, voltage and stability-related signals appear to have all contributed.",
      why:
        "This type of event often needs more than one signal to explain it properly and should be treated with caution.",
      confidence: "Low-medium",
    },
  ];

  const futureWatch = [
    {
      id: 101,
      period: "October 2026",
      title: "North-South boundary watch",
      risk: "Moderate",
      signal: "Forecast risk window",
      summary:
        "Future period worth watching based on forecast cost signals and historical analogues.",
      why:
        "This resembles historical renewable-rich constraint conditions, but should be treated as a watch signal rather than a prediction.",
    },
    {
      id: 102,
      period: "December 2026",
      title: "Winter peak-demand watch",
      risk: "Moderate-high",
      signal: "Demand-led watch",
      summary:
        "Higher seasonal demand may increase the chance of system stress in certain periods.",
      why:
        "This is useful as a planning signal only. It does not predict a specific operational event.",
    },
  ];

  const [selectedEvent, setSelectedEvent] = useState(pastEvents[0]);

  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #081225 0%, #0b1730 100%)",
    color: "#e5eefc",
    fontFamily: "Arial, sans-serif",
    padding: "40px 20px 60px",
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const heroStyle = {
    textAlign: "center",
    marginBottom: "40px",
  };

  const subtitleStyle = {
    color: "#9fb3d9",
    fontSize: "18px",
    marginTop: "10px",
  };

  const summaryGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "30px",
  };

  const summaryCard = {
    background: "#132540",
    borderRadius: "16px",
    padding: "18px",
    border: "1px solid #23385c",
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
  };

  const mainGrid = {
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    gap: "24px",
    alignItems: "start",
  };

  const sectionCard = {
    background: "#132540",
    borderRadius: "18px",
    padding: "22px",
    border: "1px solid #23385c",
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
  };

  const eventCard = (active) => ({
    background: active ? "#1f365c" : "#0f2038",
    borderRadius: "14px",
    padding: "16px",
    border: active ? "1px solid #5aa2ff" : "1px solid #23385c",
    marginBottom: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  const chip = {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
    background: "#223b63",
    color: "#cfe0ff",
    marginTop: "8px",
  };

  const smallLabel = {
    color: "#9fb3d9",
    fontSize: "13px",
    marginBottom: "6px",
  };

  const bigNumber = {
    fontSize: "28px",
    fontWeight: "bold",
    margin: "6px 0 0",
  };

  const futureGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
    marginTop: "26px",
  };

  const futureCard = {
    background: "#0f2038",
    borderRadius: "14px",
    padding: "16px",
    border: "1px solid #23385c",
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={heroStyle}>
          <h1 style={{ fontSize: "54px", margin: 0 }}>GB System Stress Watch</h1>
          <p style={subtitleStyle}>
            <strong>Explaining past constraints. Watching future risk.</strong>
          </p>
        </div>

        <div style={summaryGrid}>
          <div style={summaryCard}>
            <div style={smallLabel}>Detected past stress events</div>
            <div style={bigNumber}>{pastEvents.length}</div>
          </div>

          <div style={summaryCard}>
            <div style={smallLabel}>Top historical signal</div>
            <div style={bigNumber}>{"\u00a33.2m"}</div>
          </div>

          <div style={summaryCard}>
            <div style={smallLabel}>Future watch windows</div>
            <div style={bigNumber}>{futureWatch.length}</div>
          </div>

          <div style={summaryCard}>
            <div style={smallLabel}>Prototype status</div>
            <div style={{ ...bigNumber, fontSize: "22px" }}>Live on GitHub Pages</div>
          </div>
        </div>

        <div style={mainGrid}>
          <div style={sectionCard}>
            <h2 style={{ marginTop: 0 }}>Past event explainer</h2>
            <p style={{ color: "#9fb3d9", marginTop: 0 }}>
              Select a system-stress event to view the explanation.
            </p>

            {pastEvents.map((event) => (
              <div
                key={event.id}
                style={eventCard(selectedEvent.id === event.id)}
                onClick={() => setSelectedEvent(event)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "#9fb3d9" }}>{event.date}</div>
                    <div style={{ fontSize: "20px", fontWeight: "bold", marginTop: "6px" }}>
                      {event.title}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "12px", color: "#9fb3d9" }}>Signal</div>
                    <div style={{ fontWeight: "bold", fontSize: "18px" }}>{event.signal}</div>
                  </div>
                </div>

                <div style={chip}>{event.pattern}</div>

                <p style={{ marginBottom: 0, marginTop: "12px", color: "#d5e2fb" }}>
                  {event.summary}
                </p>
              </div>
            ))}
          </div>

          <div style={sectionCard}>
            <h2 style={{ marginTop: 0 }}>Agent explanation</h2>
            <p style={{ color: "#9fb3d9", marginTop: 0 }}>
              Explanation generated from constraint-pattern logic.
            </p>

            <div
              style={{
                background: "#0f2038",
                borderRadius: "14px",
                padding: "18px",
                border: "1px solid #23385c",
              }}
            >
              <div style={{ fontSize: "13px", color: "#9fb3d9" }}>Selected event</div>
              <h3 style={{ marginTop: "8px", marginBottom: "8px", fontSize: "26px" }}>
                {selectedEvent.title}
              </h3>

              <div style={chip}>{selectedEvent.pattern}</div>

              <p style={{ marginTop: "16px", lineHeight: 1.6 }}>{selectedEvent.why}</p>

              <div
                style={{
                  marginTop: "18px",
                  padding: "14px",
                  borderRadius: "12px",
                  background: "#182f52",
                  color: "#dfe9ff",
                }}
              >
                <strong>Confidence:</strong> {selectedEvent.confidence}
              </div>

              <p style={{ marginTop: "18px", color: "#9fb3d9", fontSize: "14px", lineHeight: 1.5 }}>
                This is an open-data prototype. Explanations are correlation-based and intended as
                indicative insight, not confirmed operational causality.
              </p>
            </div>
          </div>
        </div>

        <div style={{ ...sectionCard, marginTop: "26px" }}>
          <h2 style={{ marginTop: 0 }}>Future watch</h2>
          <p style={{ color: "#9fb3d9", marginTop: 0 }}>
            Periods worth monitoring based on forecast signals and historical analogues.
          </p>

          <div style={futureGrid}>
            {futureWatch.map((item) => (
              <div key={item.id} style={futureCard}>
                <div style={{ fontSize: "13px", color: "#9fb3d9" }}>{item.period}</div>
                <h3 style={{ marginTop: "8px", marginBottom: "6px" }}>{item.title}</h3>

                <div style={chip}>Risk: {item.risk}</div>

                <p style={{ marginTop: "14px", marginBottom: "10px" }}>{item.summary}</p>
                <p style={{ color: "#9fb3d9", fontSize: "14px", lineHeight: 1.5 }}>{item.why}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
