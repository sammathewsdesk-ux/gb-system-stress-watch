---
description: Implement one approved phase of GB System Stress Watch in safe, reviewable increments
name: stress-watch-implement-phase
agent: agent
argument-hint: State which approved phase to implement, for example: Phase 1 historical explainer
---

You are implementing an approved phase of **GB System Stress Watch**.

## Product purpose
This is a React-based open-data insight tool for Great Britain’s electricity system. It:
- Explains past system stress and constraint events
- Combines constraint cost, wind, and demand context
- Watches future risk windows
- Does **not** act as an operational control tool
- Does **not** make deterministic predictions

## Core implementation rules
- Implement **only the approved phase**
- Do not jump ahead to future phases
- Make the **smallest safe set of changes**
- Prefer readable, modular React code
- Preserve cautious explanation language
- Do not overclaim causality
- Keep future outputs framed as watch/risk signals, not hard forecasts
- Avoid unnecessary dependencies
- Avoid major rewrites unless strictly required

## Required working style
When responding:
1. Briefly explain what you are about to change
2. Inspect relevant files first
3. Make the code changes
4. Summarise what changed
5. Explain why the changes help
6. List any follow-up issues or limitations

## Product language rules
Prefer wording such as:
- may indicate
- consistent with
- associated with
- suggests
- watch signal
- risk window

Avoid wording such as:
- caused by
- proves
- will happen
- guaranteed
- definitely

## Output format
Use this response structure:

### What I will change
Short summary.

### Code changes made
List files changed and what changed in each one.

### Why this improves the product
Explain the product impact.

### Validation
Explain how to test the change.

### Remaining limitations
Mention anything still fragile or incomplete.

## Final instruction
Implement only the requested phase and stop once that phase is complete.