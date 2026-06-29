# GB System Stress Watch

Interactive React prototype for explaining past Great Britain electricity-system stress episodes and watching future risk windows.

The app is positioned as a NESO leadership demo: an AI-assisted open-data experience that turns system, market and weather signals into faster situational insight, executive briefings and forward-looking congestion watch indicators.

## Current prototype

- Past event explainer for selected constraint/stress events.
- Pattern-based agent explanation panel.
- Future watch cards for planning windows.
- User-selected analysis horizon.
- On-demand NESO Data Portal and Open-Meteo refresh scaffold.
- Richer stress signal stack covering cost, curtailment, wind, demand, reserve/stability and weather.
- First copilot-style "ask the data" panel grounded in the selected event and refreshed data.
- Executive landing view with stress status, composite score, primary driver and leadership confidence.
- Constraint geography view translating NESO constraint groups into leadership-friendly operating areas.
- Before/during/after episode timeline and recommended leadership readout.
- GitHub Pages deployment at `https://sammathewsdesk-ux.github.io/gb-system-stress-watch`.

## Direction

The next iteration should expand the NESO ingestion beyond thermal constraint costs into balancing mechanism actions, wind/demand, reserve and margin data, then use those feeds for episode detection, scoring, charts and conversational analysis.

## Scripts

```bash
npm start
npm test
npm run build
npm run deploy
```
