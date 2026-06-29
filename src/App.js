import React, { useMemo, useState } from "react";
import "./App.css";

const NESO_API_BASE = "https://api.neso.energy/api/3/action";

const horizons = [
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
  { id: "fy", label: "Current financial year", days: 455 },
];

const weatherLocations = {
  gb: { label: "GB representative", latitude: 54.5, longitude: -3.0 },
  scotland: { label: "Scotland boundary area", latitude: 56.6, longitude: -4.2 },
  englandWales: { label: "England and Wales boundary area", latitude: 52.6, longitude: -1.5 },
  southEast: { label: "South East constraint area", latitude: 51.5, longitude: 0.1 },
};

const pastEvents = [
  {
    id: 1,
    date: "8 January 2025",
    title: "High thermal constraint episode",
    signal: "\u00a33.2m",
    pattern: "Renewable-rich constraint episode",
    constraintArea: "Scotland to England boundary",
    weatherLocation: "scotland",
    summary:
      "Elevated constraint costs coincided with strong wind and relatively low demand.",
    why:
      "This may indicate renewable output was high while network transfer capability or system flexibility was under pressure.",
    confidence: "Medium-high",
    signals: [
      { name: "Constraint cost", value: "\u00a33.2m", level: "High", detail: "Thermal boundary cost signal" },
      { name: "Curtailing BMUs", value: "18", level: "High", detail: "Multiple units reducing output" },
      { name: "Wind output", value: "15.2 GW", level: "High", detail: "Renewable-rich operating state" },
      { name: "Demand", value: "21.9 GW", level: "Low", detail: "Low demand increased constraint pressure" },
      { name: "Reserve/stability", value: "Watch", level: "Medium", detail: "Needs cross-check with BM actions" },
      { name: "Weather", value: "Strong wind", level: "High", detail: "Area weather is material to the event" },
    ],
  },
  {
    id: 2,
    date: "18 November 2025",
    title: "Peak-demand stress episode",
    signal: "\u00a32.6m",
    pattern: "Demand-led stress pattern",
    constraintArea: "England and Wales demand centres",
    weatherLocation: "englandWales",
    summary:
      "Constraint costs rose during higher demand conditions with less evidence of wind-led stress.",
    why:
      "This suggests a more demand-led system pressure event rather than a classic renewable-curtailment-led pattern.",
    confidence: "Medium",
    signals: [
      { name: "Constraint cost", value: "\u00a32.6m", level: "High", detail: "Significant daily system cost" },
      { name: "Curtailing BMUs", value: "9", level: "Medium", detail: "Less curtailment-led than Episode 1" },
      { name: "Wind output", value: "7.4 GW", level: "Medium", detail: "Not the primary stress driver" },
      { name: "Demand", value: "42.1 GW", level: "High", detail: "Demand-led pressure" },
      { name: "Reserve/stability", value: "Tight", level: "High", detail: "Check reserve and margin data" },
      { name: "Weather", value: "Cold", level: "Medium", detail: "Temperature may explain demand" },
    ],
  },
  {
    id: 3,
    date: "3 March 2025",
    title: "Multi-factor system stress",
    signal: "\u00a32.1m",
    pattern: "Mixed operational pressures",
    constraintArea: "South East import and voltage area",
    weatherLocation: "southEast",
    summary:
      "Constraint, voltage and stability-related signals appear to have all contributed.",
    why:
      "This type of event often needs more than one signal to explain it properly and should be treated with caution.",
    confidence: "Low-medium",
    signals: [
      { name: "Constraint cost", value: "\u00a32.1m", level: "Medium", detail: "Material but not isolated" },
      { name: "Curtailing BMUs", value: "11", level: "Medium", detail: "Some renewable/network signal" },
      { name: "Wind output", value: "10.8 GW", level: "Medium", detail: "One of several factors" },
      { name: "Demand", value: "35.4 GW", level: "Medium", detail: "Not obviously peak-led" },
      { name: "Reserve/stability", value: "Watch", level: "High", detail: "Likely needs ancillary-service evidence" },
      { name: "Weather", value: "Mixed", level: "Medium", detail: "Weather signal is contextual" },
    ],
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

function formatCurrency(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDateTime(value) {
  if (!value) return "Not refreshed yet";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildSqlUrl(resourceId, selectedHorizon) {
  const horizon = horizons.find((item) => item.id === selectedHorizon) || horizons[1];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - horizon.days);
  const isoStart = startDate.toISOString().slice(0, 10);
  const sql = `
    SELECT *
    FROM "${resourceId}"
    WHERE "Settlement Date" >= '${isoStart}'
    ORDER BY "Settlement Date" DESC
    LIMIT 500
  `;
  return `${NESO_API_BASE}/datastore_search_sql?sql=${encodeURIComponent(sql)}`;
}

function summarizeConstraintRecords(records) {
  if (!records.length) {
    return {
      latestDate: "No records",
      latestTotalCost: 0,
      topConstraint: "No live records returned",
      topConstraintCost: 0,
      recordCount: 0,
    };
  }

  const latestDate = records
    .map((record) => record["Settlement Date"])
    .sort()
    .reverse()[0];

  const latestRecords = records.filter((record) => record["Settlement Date"] === latestDate);
  const latestTotalCost = latestRecords.reduce(
    (total, record) => total + Number(record["Daily Cost (GBP)"] || 0),
    0
  );
  const top = latestRecords.reduce(
    (currentTop, record) =>
      Number(record["Daily Cost (GBP)"] || 0) > Number(currentTop["Daily Cost (GBP)"] || 0)
        ? record
        : currentTop,
    latestRecords[0]
  );

  return {
    latestDate,
    latestTotalCost,
    topConstraint: top?.["Constraint Group"] || "Unknown",
    topConstraintCost: Number(top?.["Daily Cost (GBP)"] || 0),
    recordCount: records.length,
  };
}

function summarizeWeather(data) {
  const hourly = data?.hourly;
  if (!hourly?.time?.length) return null;

  const now = new Date();
  const index = hourly.time.reduce((bestIndex, time, currentIndex) => {
    const currentDistance = Math.abs(new Date(time).getTime() - now.getTime());
    const bestDistance = Math.abs(new Date(hourly.time[bestIndex]).getTime() - now.getTime());
    return currentDistance < bestDistance ? currentIndex : bestIndex;
  }, 0);

  return {
    time: hourly.time[index],
    temperature: hourly.temperature_2m?.[index],
    wind10m: hourly.wind_speed_10m?.[index],
    wind100m: hourly.wind_speed_100m?.[index],
  };
}

function answerQuestion(question, selectedEvent, liveSummary, weather, horizonLabel) {
  const normalized = question.toLowerCase();

  if (!question.trim()) {
    return "Ask about the selected event, constraint costs, weather, time horizon, confidence, or future watch signals.";
  }

  if (normalized.includes("weather") || normalized.includes("wind") || normalized.includes("temperature")) {
    if (!weather) {
      return `For ${selectedEvent.title}, weather is expected to be important because the relevant area is ${selectedEvent.constraintArea}. Refresh live data to pull UK and area weather context.`;
    }
    return `Weather context for ${selectedEvent.constraintArea}: around ${weather.wind100m} km/h wind at 100m, ${weather.wind10m} km/h wind at 10m, and ${weather.temperature} deg C near ${weather.time}. This helps test whether the event is renewable-led, demand-led, or mixed.`;
  }

  if (normalized.includes("cost") || normalized.includes("constraint")) {
    if (!liveSummary) {
      return `The selected event's historical signal is ${selectedEvent.signal}. Refresh live NESO data to compare it with the latest thermal constraint cost records.`;
    }
    return `Latest NESO thermal constraint sample in ${horizonLabel}: ${formatCurrency(
      liveSummary.latestTotalCost
    )} on ${liveSummary.latestDate}. The largest constraint group in that latest day is ${
      liveSummary.topConstraint
    } at ${formatCurrency(liveSummary.topConstraintCost)}.`;
  }

  if (normalized.includes("why") || normalized.includes("explain")) {
    return `${selectedEvent.title}: ${selectedEvent.why} Confidence is ${selectedEvent.confidence}. The richer signal view combines cost, curtailment, wind, demand, reserve/stability and weather rather than relying on one metric.`;
  }

  if (normalized.includes("future") || normalized.includes("watch") || normalized.includes("forecast")) {
    return "The future watch view should treat risk windows as planning signals, not predictions. The next build should combine NESO live data, weather forecasts, historical analogues, margin/reserve signals and boundary-specific congestion patterns.";
  }

  if (normalized.includes("horizon") || normalized.includes("period")) {
    return `The current analysis horizon is ${horizonLabel}. The refresh flow uses this horizon to query recent NESO records and should later drive charts, episode detection and watch-list scoring.`;
  }

  return `For ${selectedEvent.title}, the strongest current explanation is: ${selectedEvent.summary} Ask a more specific question about cost, weather, horizon, confidence, or future watch risk.`;
}

function App() {
  const [selectedEvent, setSelectedEvent] = useState(pastEvents[0]);
  const [selectedHorizon, setSelectedHorizon] = useState("30d");
  const [liveState, setLiveState] = useState({
    status: "idle",
    message: "Ready to refresh from NESO and weather APIs.",
    lastUpdated: null,
    datasetName: null,
    resourceName: null,
    liveSummary: null,
    weather: null,
  });
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const horizonLabel = useMemo(
    () => horizons.find((item) => item.id === selectedHorizon)?.label || "Selected horizon",
    [selectedHorizon]
  );

  const selectedWeatherLocation = weatherLocations[selectedEvent.weatherLocation] || weatherLocations.gb;

  async function refreshLiveData() {
    setLiveState((current) => ({
      ...current,
      status: "loading",
      message: "Refreshing NESO constraint resources and weather context...",
    }));

    try {
      const packageUrl = `${NESO_API_BASE}/package_search?q=${encodeURIComponent(
        "thermal constraint costs"
      )}&rows=1`;
      const packageResponse = await fetch(packageUrl);
      if (!packageResponse.ok) throw new Error(`NESO package search failed: ${packageResponse.status}`);
      const packageJson = await packageResponse.json();
      const dataset = packageJson.result?.results?.[0];
      const activeResources = (dataset?.resources || []).filter((resource) => resource.datastore_active);
      const latestResource = activeResources
        .slice()
        .sort((left, right) => new Date(right.metadata_modified || 0) - new Date(left.metadata_modified || 0))[0];

      if (!latestResource) throw new Error("No datastore-backed NESO constraint cost resource found.");

      const dataResponse = await fetch(buildSqlUrl(latestResource.id, selectedHorizon));
      if (!dataResponse.ok) throw new Error(`NESO datastore query failed: ${dataResponse.status}`);
      const dataJson = await dataResponse.json();
      const records = dataJson.result?.records || [];

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${selectedWeatherLocation.latitude}&longitude=${selectedWeatherLocation.longitude}&hourly=temperature_2m,wind_speed_10m,wind_speed_100m&forecast_days=1&timezone=Europe%2FLondon`;
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) throw new Error(`Weather refresh failed: ${weatherResponse.status}`);
      const weatherJson = await weatherResponse.json();

      setLiveState({
        status: "ready",
        message: `Loaded ${records.length} NESO thermal constraint records for ${horizonLabel}.`,
        lastUpdated: new Date().toISOString(),
        datasetName: dataset?.title || "Thermal Constraint Costs",
        resourceName: latestResource.name,
        liveSummary: summarizeConstraintRecords(records),
        weather: summarizeWeather(weatherJson),
      });
    } catch (error) {
      setLiveState((current) => ({
        ...current,
        status: "error",
        message: error.message,
        lastUpdated: new Date().toISOString(),
      }));
    }
  }

  function handleAsk(prompt) {
    const nextQuestion = prompt || question;
    setQuestion(nextQuestion);
    setAnswer(
      answerQuestion(
        nextQuestion,
        selectedEvent,
        liveState.liveSummary,
        liveState.weather,
        horizonLabel
      )
    );
  }

  return (
    <div className="app-shell">
      <main className="app-container">
        <section className="hero">
          <div className="eyebrow">GB electricity system analysis</div>
          <h1>GB System Stress Watch</h1>
          <p>
            Explaining past congestion episodes, refreshing NESO open data on demand, and building a forward-looking
            watch list for system stress.
          </p>
          <a href="https://sammathewsdesk-ux.github.io/gb-system-stress-watch/" className="live-link">
            Live app
          </a>
        </section>

        <section className="control-panel">
          <div>
            <label htmlFor="horizon">Time horizon</label>
            <select
              id="horizon"
              value={selectedHorizon}
              onChange={(event) => setSelectedHorizon(event.target.value)}
            >
              {horizons.map((horizon) => (
                <option key={horizon.id} value={horizon.id}>
                  {horizon.label}
                </option>
              ))}
            </select>
          </div>

          <button className="primary-button" onClick={refreshLiveData} disabled={liveState.status === "loading"}>
            {liveState.status === "loading" ? "Refreshing..." : "Refresh NESO + weather"}
          </button>
        </section>

        <section className="summary-grid">
          <article className="summary-card">
            <span>Detected past stress events</span>
            <strong>{pastEvents.length}</strong>
          </article>
          <article className="summary-card">
            <span>Top historical signal</span>
            <strong>{"\u00a33.2m"}</strong>
          </article>
          <article className="summary-card">
            <span>Selected horizon</span>
            <strong>{horizonLabel}</strong>
          </article>
          <article className={`summary-card status-${liveState.status}`}>
            <span>Live data status</span>
            <strong>{liveState.status === "ready" ? "Refreshed" : liveState.status}</strong>
          </article>
        </section>

        <section className="main-grid">
          <article className="panel">
            <h2>Past event explainer</h2>
            <p className="muted">Select an event to inspect the combined congestion and weather signals.</p>
            {pastEvents.map((event) => (
              <button
                className={`event-card ${selectedEvent.id === event.id ? "active" : ""}`}
                key={event.id}
                onClick={() => setSelectedEvent(event)}
              >
                <span>{event.date}</span>
                <div>
                  <h3>{event.title}</h3>
                  <strong>{event.signal}</strong>
                </div>
                <em>{event.pattern}</em>
                <p>{event.summary}</p>
              </button>
            ))}
          </article>

          <article className="panel">
            <h2>Agent explanation</h2>
            <p className="muted">Designed for both expert drill-down and executive narrative.</p>
            <div className="explanation-card">
              <span className="chip">{selectedEvent.pattern}</span>
              <h3>{selectedEvent.title}</h3>
              <p>{selectedEvent.why}</p>
              <div className="confidence">
                <strong>Confidence:</strong> {selectedEvent.confidence}
              </div>
              <div className="area-note">
                <strong>Area weather lens:</strong> {selectedEvent.constraintArea} using{" "}
                {selectedWeatherLocation.label}.
              </div>
            </div>
          </article>
        </section>

        <section className="panel">
          <h2>Richer stress signal stack</h2>
          <p className="muted">
            The episode definition now covers cost, curtailment, wind, demand, reserve/stability and weather signals.
          </p>
          <div className="signal-grid">
            {selectedEvent.signals.map((signal) => (
              <article className={`signal-card level-${signal.level.toLowerCase()}`} key={signal.name}>
                <span>{signal.name}</span>
                <strong>{signal.value}</strong>
                <em>{signal.level}</em>
                <p>{signal.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="two-column">
          <article className="panel">
            <h2>Live data refresh</h2>
            <p className="muted">{liveState.message}</p>
            <dl className="data-list">
              <div>
                <dt>NESO dataset</dt>
                <dd>{liveState.datasetName || "Thermal constraint costs search"}</dd>
              </div>
              <div>
                <dt>Resource</dt>
                <dd>{liveState.resourceName || "Latest datastore-backed resource selected on refresh"}</dd>
              </div>
              <div>
                <dt>Last refreshed</dt>
                <dd>{formatDateTime(liveState.lastUpdated)}</dd>
              </div>
              <div>
                <dt>Latest day cost</dt>
                <dd>
                  {liveState.liveSummary
                    ? `${formatCurrency(liveState.liveSummary.latestTotalCost)} on ${
                        liveState.liveSummary.latestDate
                      }`
                    : "Refresh to load"}
                </dd>
              </div>
              <div>
                <dt>Top constraint group</dt>
                <dd>
                  {liveState.liveSummary
                    ? `${liveState.liveSummary.topConstraint} (${formatCurrency(
                        liveState.liveSummary.topConstraintCost
                      )})`
                    : "Refresh to load"}
                </dd>
              </div>
              <div>
                <dt>Area weather</dt>
                <dd>
                  {liveState.weather
                    ? `${liveState.weather.wind100m} km/h at 100m, ${liveState.weather.temperature} deg C`
                    : "Refresh to load"}
                </dd>
              </div>
            </dl>
          </article>

          <article className="panel">
            <h2>Ask the data</h2>
            <p className="muted">First copilot-style layer: grounded answers from the selected event and refreshed data.</p>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask: what drove this event, what does weather show, or what is the latest cost?"
            />
            <button className="primary-button" onClick={() => handleAsk()}>
              Ask
            </button>
            <div className="prompt-row">
              {["Explain this event", "What is the latest cost?", "What does weather show?", "How does horizon matter?"].map(
                (prompt) => (
                  <button key={prompt} onClick={() => handleAsk(prompt)}>
                    {prompt}
                  </button>
                )
              )}
            </div>
            <div className="answer-box">{answer || "Answers will appear here."}</div>
          </article>
        </section>

        <section className="panel">
          <h2>Future watch</h2>
          <p className="muted">
            Periods worth monitoring based on forecast signals and historical analogues. These are planning signals,
            not operational predictions.
          </p>
          <div className="future-grid">
            {futureWatch.map((item) => (
              <article className="future-card" key={item.id}>
                <span>{item.period}</span>
                <h3>{item.title}</h3>
                <strong>Risk: {item.risk}</strong>
                <p>{item.summary}</p>
                <p className="muted">{item.why}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
