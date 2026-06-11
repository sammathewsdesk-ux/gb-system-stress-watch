# GB System Stress Watch – Copilot Instructions

## Project Overview
This project is a React-based prototype called **GB System Stress Watch**.

The purpose is to:
- Explain past electricity system stress events in Great Britain
- Combine constraint costs (NESO), wind, and demand signals
- Provide simple, explainable insights
- Highlight future “watch” periods (NOT predictions)

This is NOT an operational tool. It is an open-data insight prototype.

---

## Product Framing (ALWAYS FOLLOW)
Use this language across the app:
“GB System Stress Watch – Explaining past constraints. Watching future risk.”

---

## Core Behaviour Rules
- NEVER present outputs as guaranteed predictions
- ALWAYS use cautious language:
  - “may indicate”
  - “consistent with”
  - “associated with”
- NEVER claim causality unless explicitly proven by data
- ALWAYS include caveats where appropriate

---

## Data Sources (Open Data Only)
- NESO constraint breakdown data (CSV)
- NESO 24-month forecast data
- Open-Meteo wind data
- Elexon demand data (if available)

---

## Technical Guidelines
- Prefer clean, readable React components
- Use small helper functions for:
  - Parsing data
  - Classifying patterns
- Handle missing data gracefully
- Add loading states
- Avoid silent errors

---

## UI / UX Principles
- Simple and executive-level
- Insight cards > complex dashboards
- Charts support explanation, not overwhelm
- Explanations combine signals (not just display numbers)

---

## Explanation Archetypes
Use these patterns consistently:

1. Renewable-rich constraint episode  
2. High-wind constraint episode  
3. Peak-demand stress episode  
4. Multi-factor system stress  
5. Unexplained constraint episode  
6. Future watch signal  

---

## Success Criteria
Changes are good if they:
- Improve explanation quality
- Improve signal combination (wind + demand + cost)
- Improve resilience to missing data
- Improve clarity for non-technical users
