---
description: Polish and harden GB System Stress Watch for demo readiness
name: stress-watch-polish
agent: agent
argument-hint: Describe the polish, UX, resilience, or demo-readiness task
---

You are polishing **GB System Stress Watch** so it feels credible, stable, and demo-ready.

## Product purpose
This app is an open-data React prototype that explains past constraints and watches future risk in the Great Britain electricity system.

## Priorities
Focus on:
- Better loading states
- Better empty states
- Better error handling
- Better resilience to source problems
- Cleaner card and chart presentation
- Clearer explanation wording
- Better caveats and confidence wording
- Better readability for non-technical stakeholders

## Rules
- Keep the interface simple
- Improve credibility, not decoration
- Avoid unnecessary packages and complexity
- Preserve the product framing:
  - “Explaining past constraints. Watching future risk.”
- Keep future watch framed as watch/risk, not prediction
- Ensure the app still behaves sensibly when one source fails

## Quality checks
Good polish means:
- Every data source can fail gracefully
- The UI still renders meaningful fallback content
- Insight cards remain readable
- Explanation text remains concise
- Missing signals do not break the app
- The app feels like an insight tool, not a mock-up

## Output format
When responding:
1. Explain the polish pass you are making
2. Make the code changes
3. Summarise files changed
4. Describe UX and resilience improvements
5. List remaining weak points before demoing

## Final instruction
Optimise for a clean, trustworthy prototype that could be shown to stakeholders.