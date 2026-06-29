# GB System Stress Watch

Interactive React prototype for explaining past Great Britain electricity-system stress episodes and watching future risk windows.

## Current prototype

- Past event explainer for selected constraint/stress events.
- Pattern-based agent explanation panel.
- Future watch cards for planning windows.
- User-selected analysis horizon.
- On-demand NESO Data Portal and Open-Meteo refresh scaffold.
- Richer stress signal stack covering cost, curtailment, wind, demand, reserve/stability and weather.
- First copilot-style "ask the data" panel grounded in the selected event and refreshed data.
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
