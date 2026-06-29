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

const constraintAreas = [
  {
    code: "SCOTEX",
    name: "Scotland to England export boundary",
    region: "North-South transfer",
    focus: "Renewable export congestion and boundary transfer capability",
    watchSignal: "High wind plus lower GB demand",
  },
  {
    code: "SSE-SP",
    name: "Scottish transmission interface",
    region: "Scotland",
    focus: "Internal Scottish constraints and renewable concentration",
    watchSignal: "Strong area wind and high curtailment actions",
  },
  {
    code: "SEIMP",
    name: "South East import area",
    region: "South East England",
    focus: "Import limitations, voltage and demand-centre stress",
    watchSignal: "High demand, low local flexibility or voltage support needs",
  },
  {
    code: "ESTEX",
    name: "East Anglia / East transfer interface",
    region: "East England",
    focus: "Network transfer and offshore/onshore generation interaction",
    watchSignal: "Wind output plus boundary loading",
  },
  {
    code: "SSHARN",
    name: "Southern / sharnbrook-related constraint group",
    region: "Central / South",
    focus: "Transfer pressure into southern demand areas",
    watchSignal: "Demand-led stress and constrained import patterns",
  },
];

const pastEvents = [
  {
    id: 1,
    date: "8 January 2025",
    title: "High renewable export constraint",
    signal: "\u00a33.2m",
    pattern: "Renewable-rich constraint episode",
    constraintArea: "Scotland to England boundary",
    weatherLocation: "scotland",
    executiveImplication:
      "Useful analogue for leadership briefings on how high renewable output can translate into material constraint cost when transfer capability and flexible demand are limited.",
    summary:
      "Elevated constraint costs coincided with strong wind and relatively low demand, creating a credible renewable-rich congestion pattern.",
    why:
      "The most likely story is high northern renewable output meeting limited north-south transfer headroom, with lower demand reducing the system's ability to absorb generation locally.",
    confidence: "Medium-high",
    confidenceNote: "Supported by aligned cost, wind and demand indicators; BM action and boundary-flow detail would raise confidence further.",
    stressScore: 82,
    primaryDriver: "High wind plus network transfer pressure",
    recommendedAction: "Prioritise boundary-specific evidence, curtailment actions and flexibility options.",
    signals: [
      { name: "Constraint cost", value: "\u00a33.2m", level: "High", detail: "Material thermal boundary cost signal" },
      { name: "Curtailing BMUs", value: "18", level: "High", detail: "Multiple units reducing output" },
      { name: "Wind output", value: "15.2 GW", level: "High", detail: "Renewable-rich operating state" },
      { name: "Demand", value: "21.9 GW", level: "Low", detail: "Low demand increased absorption challenge" },
      { name: "Reserve/stability", value: "Watch", level: "Medium", detail: "Needs cross-check with BM actions" },
      { name: "Weather", value: "Strong wind", level: "High", detail: "Area weather is material to the event" },
    ],
    timeline: [
      { stage: "Before", label: "Renewable build-up", detail: "Area wind conditions strengthened while demand remained comparatively soft." },
      { stage: "During", label: "Constraint pressure", detail: "Thermal constraint cost and curtailment indicators rose together." },
      { stage: "After", label: "Operational learning", detail: "Best explained through boundary headroom, flexibility availability and BM action evidence." },
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
    executiveImplication:
      "Demonstrates how the same watch framework can distinguish demand-led stress from renewable-curtailment-led congestion.",
    summary:
      "Constraint costs rose during higher demand conditions with less evidence of a purely wind-led stress pattern.",
    why:
      "The event appears more demand-led, with colder weather and tighter reserve or network conditions likely more important than renewable export congestion alone.",
    confidence: "Medium",
    confidenceNote: "Cost and demand indicators align; reserve, margin and interconnector data would improve attribution.",
    stressScore: 74,
    primaryDriver: "Demand pressure and operational tightness",
    recommendedAction: "Compare demand, reserve margin, interconnector flows and balancing actions in the selected window.",
    signals: [
      { name: "Constraint cost", value: "\u00a32.6m", level: "High", detail: "Significant daily system cost" },
      { name: "Curtailing BMUs", value: "9", level: "Medium", detail: "Less curtailment-led than Episode 1" },
      { name: "Wind output", value: "7.4 GW", level: "Medium", detail: "Not the primary stress driver" },
      { name: "Demand", value: "42.1 GW", level: "High", detail: "Demand-led pressure" },
      { name: "Reserve/stability", value: "Tight", level: "High", detail: "Check reserve and margin data" },
      { name: "Weather", value: "Cold", level: "Medium", detail: "Temperature may explain demand" },
    ],
    timeline: [
      { stage: "Before", label: "Demand ramp", detail: "Demand increased as weather conditions supported higher consumption." },
      { stage: "During", label: "System tightness", detail: "Constraint cost rose in a pattern less dominated by renewable curtailment." },
      { stage: "After", label: "Operational learning", detail: "Best investigated through reserve, margin, interconnector and demand-response signals." },
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
    executiveImplication:
      "Shows why leadership reporting needs a multi-signal view rather than a single metric or one-cause explanation.",
    summary:
      "Constraint, voltage and stability-related signals appear to have contributed to a mixed stress episode.",
    why:
      "No single driver dominates. The likely explanation combines network transfer pressure, local system needs and operational balancing actions.",
    confidence: "Low-medium",
    confidenceNote: "The app should present this as a hypothesis until voltage, stability and BM evidence are joined.",
    stressScore: 66,
    primaryDriver: "Mixed network and stability pressure",
    recommendedAction: "Flag as multi-factor and avoid over-attribution until supporting operational datasets are joined.",
    signals: [
      { name: "Constraint cost", value: "\u00a32.1m", level: "Medium", detail: "Material but not isolated" },
      { name: "Curtailing BMUs", value: "11", level: "Medium", detail: "Some renewable/network signal" },
      { name: "Wind output", value: "10.8 GW", level: "Medium", detail: "One of several factors" },
      { name: "Demand", value: "35.4 GW", level: "Medium", detail: "Not obviously peak-led" },
      { name: "Reserve/stability", value: "Watch", level: "High", detail: "Likely needs ancillary-service evidence" },
      { name: "Weather", value: "Mixed", level: "Medium", detail: "Weather signal is contextual" },
    ],
    timeline: [
      { stage: "Before", label: "Mixed conditions", detail: "Demand, weather and network indicators pointed in different directions." },
      { stage: "During", label: "Multi-signal stress", detail: "Cost, stability and balancing indicators likely overlapped." },
      { stage: "After", label: "Operational learning", detail: "Best handled as a case for root-cause classification and confidence scoring." },
    ],
  },
];

const futureWatch = [
  {
    id: 101,
    period: "October 2026",
    title: "North-South boundary watch",
    risk: "Elevated",
    signal: "Renewable-rich analogue",
    summary:
      "Period worth monitoring when high wind, lower demand and north-south transfer pressure align.",
    why:
      "Treat as a planning signal: it resembles historic renewable-rich constraint conditions but is not an operational prediction.",
  },
  {
    id: 102,
    period: "December 2026",
    title: "Winter peak-demand watch",
    risk: "Watch",
    signal: "Demand-led analogue",
    summary:
      "Higher seasonal demand may increase the chance of stress in certain periods, especially if reserve or interconnector signals tighten.",
    why:
      "Useful for leadership situational awareness and pre-briefing; needs forecast margin and weather context before escalation.",
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

function getStatus(score) {
  if (score >= 80) return { label: "Elevated", tone: "elevated", message: "Leadership attention recommended" };
  if (score >= 65) return { label: "Watch", tone: "watch", message: "Monitor signals and prepare narrative" };
  return { label: "Normal", tone: "normal", message: "No major stress signal indicated" };
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

function answerQuestion(question, selectedEvent, liveSummary, weather, horizonLabel, status) {
  const normalized = question.toLowerCase();

  if (!question.trim()) {
    return "Ask for a leadership summary, evidence, cost, weather, confidence, geography or recommended next action.";
  }

  if (normalized.includes("leadership") || normalized.includes("brief") || normalized.includes("summary")) {
    return `Leadership brief: ${selectedEvent.title} is a ${status.label.toLowerCase()} stress case with a ${selectedEvent.stressScore}/100 score. The primary driver is ${selectedEvent.primaryDriver}. The executive implication is: ${selectedEvent.executiveImplication}`;
  }

  if (normalized.includes("action") || normalized.includes("recommend")) {
    return `Recommended next action: ${selectedEvent.recommendedAction} For NESO leadership, position this as a confidence-scored explanation, not a definitive operational root cause until the remaining evidence is joined.`;
  }

  if (normalized.includes("evidence") || normalized.includes("confidence")) {
    return `Evidence confidence is ${selectedEvent.confidence}. ${selectedEvent.confidenceNote} The app is intentionally transparent: it separates observed indicators from interpretation and shows what evidence is still needed.`;
  }

  if (normalized.includes("weather") || normalized.includes("wind") || normalized.includes("temperature")) {
    if (!weather) {
      return `Weather is important for ${selectedEvent.constraintArea}. Refresh live data to pull current area-specific wind and temperature context alongside the NESO cost signal.`;
    }
    return `Weather context for ${selectedEvent.constraintArea}: ${weather.wind100m} km/h wind at 100m, ${weather.wind10m} km/h at 10m and ${weather.temperature} deg C near ${weather.time}. This helps distinguish renewable-led, demand-led and mixed episodes.`;
  }

  if (normalized.includes("cost") || normalized.includes("constraint")) {
    if (!liveSummary) {
      return `The selected historical event signal is ${selectedEvent.signal}. Refresh live NESO data to compare it with the latest thermal constraint cost records and top constraint group.`;
    }
    return `Latest NESO thermal constraint sample in ${horizonLabel}: ${formatCurrency(
      liveSummary.latestTotalCost
    )} on ${liveSummary.latestDate}. The largest latest-day constraint group is ${
      liveSummary.topConstraint
    } at ${formatCurrency(liveSummary.topConstraintCost)}.`;
  }

  if (normalized.includes("map") || normalized.includes("area") || normalized.includes("where")) {
    return `The selected case is anchored on ${selectedEvent.constraintArea}. The geography panel translates constraint groups into leadership-friendly operating areas so the story is not just a chart or acronym.`;
  }

  if (normalized.includes("future") || normalized.includes("watch") || normalized.includes("forecast")) {
    return "Future watch should be positioned as early situational awareness: combine NESO cost history, weather forecasts, demand, reserve/margin, BM actions and historical analogues to rank watch windows before they become leadership issues.";
  }

  return `Executive readout: ${selectedEvent.summary} Primary driver: ${selectedEvent.primaryDriver}. Confidence: ${selectedEvent.confidence}. Suggested next action: ${selectedEvent.recommendedAction}`;
}

function App() {
  const [selectedEvent, setSelectedEvent] = useState(pastEvents[0]);
  const [selectedHorizon, setSelectedHorizon] = useState("30d");
  const [activeView, setActiveView] = useState("brief");
  const [copyState, setCopyState] = useState("idle");
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
  const status = getStatus(selectedEvent.stressScore);
  const briefingText = `GB System Stress Watch briefing: ${selectedEvent.title}. Status: ${status.label}. Stress score: ${selectedEvent.stressScore}/100. Primary driver: ${selectedEvent.primaryDriver}. Executive implication: ${selectedEvent.executiveImplication} Recommended action: ${selectedEvent.recommendedAction} Confidence: ${selectedEvent.confidence}.`;

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
        horizonLabel,
        status
      )
    );
  }

  async function copyBriefing() {
    if (!navigator.clipboard) {
      setAnswer(briefingText);
      setCopyState("copied");
      return;
    }

    try {
      await navigator.clipboard.writeText(briefingText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch (error) {
      setAnswer(`Copy failed: ${error.message}. ${briefingText}`);
    }
  }

  return (
    <div className="app-shell">
      <main className="app-container">
        <section className="hero executive-hero calm-hero">
          <div>
            <div className="eyebrow">NESO leadership prototype</div>
            <h1>GB System Stress Watch</h1>
            <p>
              A leadership briefing view for turning NESO open data, market signals and weather context into concise
              congestion insight and forward-looking watch indicators.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={refreshLiveData} disabled={liveState.status === "loading"}>
                {liveState.status === "loading" ? "Refreshing..." : "Refresh NESO + weather"}
              </button>
              <button className="secondary-button" onClick={copyBriefing}>
                {copyState === "copied" ? "Brief copied" : "Copy leadership brief"}
              </button>
            </div>
          </div>
          <aside className={`status-card status-tone-${status.tone}`}>
            <span>Current selected case</span>
            <strong>{status.label}</strong>
            <p>{status.message}</p>
            <div className="score-ring" aria-label={`Stress score ${selectedEvent.stressScore} out of 100`}>
              {selectedEvent.stressScore}
              <small>/100</small>
            </div>
          </aside>
        </section>

        <section className="exec-toolbar">
          <div>
            <label htmlFor="horizon">Analysis horizon</label>
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

          <div className="source-strip">
            <span>Source posture</span>
            <strong>{liveState.status === "ready" ? "Live data refreshed" : "Open-data scaffold"}</strong>
            <small>{liveState.message}</small>
          </div>
        </section>

        <nav className="view-tabs" aria-label="Executive views">
          {[
            ["brief", "Board brief"],
            ["evidence", "Evidence"],
            ["geography", "Geography"],
            ["copilot", "Copilot"],
          ].map(([id, label]) => (
            <button
              className={activeView === id ? "active" : ""}
              key={id}
              onClick={() => setActiveView(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <section className="summary-grid executive-summary executive-scoreboard">
          <article className="summary-card">
            <span>Primary driver</span>
            <strong>{selectedEvent.primaryDriver}</strong>
          </article>
          <article className="summary-card">
            <span>Top historical signal</span>
            <strong>{selectedEvent.signal}</strong>
          </article>
          <article className="summary-card">
            <span>Leadership confidence</span>
            <strong>{selectedEvent.confidence}</strong>
          </article>
          <article className={`summary-card status-${liveState.status}`}>
            <span>Latest NESO refresh</span>
            <strong>{formatDateTime(liveState.lastUpdated)}</strong>
          </article>
        </section>

        {activeView === "brief" && (
          <section className="exec-stack">
            <section className="two-column top-story">
              <article className="panel narrative-panel hero-panel">
                <span className="section-kicker">Board brief</span>
                <h2>{selectedEvent.title}</h2>
                <p className="lead-copy">{selectedEvent.summary}</p>
                <div className="briefing-box">
                  <h3>Why this matters</h3>
                  <p>{selectedEvent.executiveImplication}</p>
                </div>
                <div className="briefing-box subtle-box">
                  <h3>Recommended leadership readout</h3>
                  <p>{selectedEvent.recommendedAction}</p>
                </div>
              </article>

              <article className="panel compact-panel">
                <span className="section-kicker">Selected case</span>
                <h2>Choose stress case</h2>
                <p className="muted">Use these to show that the framework distinguishes different stress patterns.</p>
                {pastEvents.map((event) => (
                  <button
                    className={`event-card compact-event ${selectedEvent.id === event.id ? "active" : ""}`}
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <span>{event.date}</span>
                    <div>
                      <h3>{event.title}</h3>
                      <strong>{event.signal}</strong>
                    </div>
                  </button>
                ))}
              </article>
            </section>

            <section className="panel forward-panel">
              <span className="section-kicker">Forward watch</span>
              <h2>From explanation to anticipation</h2>
              <div className="future-grid">
                {futureWatch.map((item) => (
                  <article className="future-card" key={item.id}>
                    <span>{item.period}</span>
                    <h3>{item.title}</h3>
                    <strong>{item.risk}</strong>
                    <p>{item.summary}</p>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}

        {activeView === "evidence" && (
          <section className="exec-stack">
            <section className="two-column">
              <article className="panel evidence-panel">
                <span className="section-kicker">Trust and provenance</span>
                <h2>Evidence posture</h2>
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
                        : `${selectedWeatherLocation.label}; refresh to load current context`}
                    </dd>
                  </div>
                </dl>
              </article>

              <article className="panel">
                <span className="section-kicker">AI explanation</span>
                <h2>What the assistant would brief</h2>
                <div className="explanation-card">
                  <span className="chip">{selectedEvent.pattern}</span>
                  <h3>{selectedEvent.primaryDriver}</h3>
                  <p>{selectedEvent.why}</p>
                  <div className="confidence">
                    <strong>Confidence:</strong> {selectedEvent.confidence}. {selectedEvent.confidenceNote}
                  </div>
                </div>
              </article>
            </section>

            <section className="panel">
              <span className="section-kicker">Signal model</span>
              <h2>Composite stress signal stack</h2>
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
          </section>
        )}

        {activeView === "geography" && (
          <section className="two-column">
            <article className="panel">
              <span className="section-kicker">Constraint geography</span>
              <h2>Where the story happens</h2>
              <p className="muted">
                Converts NESO constraint groups into leadership-friendly areas, while retaining the codes analysts expect.
              </p>
              <div className="constraint-map">
                {constraintAreas.map((area) => (
                  <article className="constraint-card" key={area.code}>
                    <strong>{area.code}</strong>
                    <h3>{area.name}</h3>
                    <span>{area.region}</span>
                    <p>{area.focus}</p>
                    <small>Watch for: {area.watchSignal}</small>
                  </article>
                ))}
              </div>
            </article>

            <article className="panel">
              <span className="section-kicker">Episode timeline</span>
              <h2>Before, during, after</h2>
              <div className="timeline">
                {selectedEvent.timeline.map((item) => (
                  <article className="timeline-item" key={item.stage}>
                    <span>{item.stage}</span>
                    <h3>{item.label}</h3>
                    <p>{item.detail}</p>
                  </article>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeView === "copilot" && (
          <section className="two-column">
            <article className="panel copilot-panel">
              <span className="section-kicker">Leadership copilot</span>
              <h2>Ask the data</h2>
              <p className="muted">
                A briefing assistant pattern for questions NESO leaders are likely to ask in a review or steering meeting.
              </p>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask for a leadership summary, evidence, cost, weather, geography or next action..."
              />
              <button className="primary-button" onClick={() => handleAsk()}>
                Generate briefing answer
              </button>
              <div className="prompt-row">
                {[
                  "Give me the leadership summary",
                  "What evidence supports this?",
                  "What is the latest cost?",
                  "What should NESO do next?",
                ].map((prompt) => (
                  <button key={prompt} onClick={() => handleAsk(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
              <div className="answer-box">{answer || "Briefing-ready answers will appear here."}</div>
            </article>

            <article className="panel">
              <span className="section-kicker">Copy-ready briefing</span>
              <h2>One-minute readout</h2>
              <div className="answer-box">{briefingText}</div>
              <button className="primary-button copy-action" onClick={copyBriefing}>
                {copyState === "copied" ? "Copied" : "Copy briefing text"}
              </button>
            </article>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
