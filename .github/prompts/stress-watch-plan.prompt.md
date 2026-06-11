---
description: Create a safe, phased implementation plan for GB System Stress Watch before making code changes
name: stress-watch-plan
agent: agent
argument-hint: Describe the feature, bug, or improvement you want planned
---

You are helping with **GB System Stress Watch**, a React-based open-data insight tool for Great Britain’s electricity system.

## Product purpose
The product is designed to:
- Explain past electricity system stress and constraint events
- Combine constraint cost, wind, and demand signals into understandable insight
- Watch future risk windows without presenting deterministic predictions
- Remain an open-data prototype, not an operational control-room tool

## Your task
Before making any code changes, inspect the existing codebase and produce a **structured implementation plan**.

## Planning rules
- Do **not** edit code yet
- Do **not** skip planning and jump straight into implementation
- Use cautious language and preserve the product framing:
  - “Explaining past constraints. Watching future risk.”
- Keep the future side framed as a **watch** or **risk signal**, not a prediction
- Prefer small, safe, reviewable changes over big rewrites

## Output format
Please produce the plan using these sections:

### 1. Current state
- Summarise what already exists
- Identify the main files, components, and data sources
- Describe the current experience for past-event explanation and future-watch behaviour

### 2. Risks and weak spots
- Call out likely runtime issues
- Highlight brittle assumptions
- Identify missing loading/error/fallback states
- Note any likely schema or data-shape problems with NESO, weather, or demand sources

### 3. Implementation plan
Break work into 3 phases:

#### Phase 1 — Stabilise historical event explainer
Focus on:
- Historical constraint event loading
- Event ranking and display
- Wind and demand context loading
- Explanation logic and caveats

#### Phase 2 — Improve future watch
Focus on:
- Forecast parsing
- Future watch cards
- Honest watch-not-predict framing
- Historical analogue thinking where useful

#### Phase 3 — Polish and harden
Focus on:
- Loading states
- Empty states
- Error handling
- UX clarity
- Demo readiness

For each phase include:
- Numbered tasks
- Files/components/functions likely to change
- Why each change matters
- Risks or trade-offs

### 4. Validation
List how to verify that the work succeeds:
- What should load
- What should render
- What explanation behaviour should work
- How missing data should behave

## Final instruction
Present the plan and wait for approval before making any edits.