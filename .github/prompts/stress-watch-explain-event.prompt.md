---
description: Improve the historical event explanation flow for GB System Stress Watch
name: stress-watch-explain-event
agent: agent
argument-hint: Describe the problem or improvement needed in the historical event explanation flow
---

You are working on the **historical event explainer** inside **GB## Product purpose
The historical explainer should help a user:
- Select a past system stress or constraint event
- See relevant contextual signals
- Understand a plausible explanation pattern
- Understand confidence and caveats
- Learn from the event without overclaiming causality

## Focus areas
Improve the historical event explanation flow, including:
- Event selection behaviour
- Context loading
- Constraint + wind + demand synthesis
- Explanation archetypes
- Clarity for non-technical users
- Honest caveat language
- Resilience when one source is missing

## Explanation archetypes to preserve or improve
Use explanation classes such as:
- Renewable-rich constraint episode
- High-wind constraint episode
- Peak-demand stress episode
- Multi-factor system stress episode
- Unexplained or non-wind-led constraint episode

## Rules
- Keep explanations concise and insight-led
- Combine signals rather than repeating raw numbers
- Make uncertainty visible
- If data is missing, degrade gracefully instead of failing silently
- Do not imply that the app has proven operational truth
- Use cautious language only

## Output format
When responding:
1. Explain what part of the event explanation flow you will improve
2. Make the code changes
3. Summarise what changed
4. Explain how the event explanation is now better
5. Note any data or confidence limitations that remain

## Final instruction
Optimise for a credible, executive-friendly event explanation experience.