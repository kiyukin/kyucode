---
name: kyucode-game-qa
description: Analyzes Unity game QA screenshots, image metadata, bug reports, and logs. Use when classifying game bugs, judging severity, creating reproduction steps, suggesting Unity fix directions, or generating QA reports for kyucode.
compatibility: Designed for Pi and Agent Skills-compatible clients. Node.js 22+ recommended. Initial MVP uses mock mode and local files.
metadata:
  project: kyucode
  engine: Unity
  version: "0.1.0"
---

## When to Use This Skill
Use this skill when analyzing Unity QA reports and images for potential bugs.

## Input Data Format
- **Screenshots:** Image filenames and metadata.
- **Bug Report:** Plain text from a Unity bug report file.

## Analysis Procedure
1. Gather input data.
2. Classify detected bugs by type.
3. Assess severity and determine root causes.
4. Generate reproduction steps and suggestions for fixes.

## Agent Roles
- **QA Lead Agent:** Oversees workflow.
- **Visual Bug Detector Agent:** Identifies visual bugs from metadata.
- **Bug Classifier Agent:** Classifies bugs by specified categories.
- **Reproduction Agent:** Creates detailed reproduction steps.
- **Fix Advisor Agent:** Suggests possible fixes based on analysis.
- **Report Writer Agent:** Formats final reports.

## Bug Classification Criteria
Classify bugs into the following types:
- UI Errors
- Collision Detection
- Pathfinding
- Rendering Issues
- Minimap Discrepancies
- Object Overlapping
- Other

## Severity Judgement Criteria
Determine bug severity: Critical, Major, Minor, Info based on impact.

## Reproduction Steps Generation Rules
Provide clear, numbered steps based on bug specifics, ensuring testability.

## Unity Fix Suggestions Rules
Recommend checks for Unity components based on common issues.

## Output Rules
- **JSON:** Structure results in a defined format.
- **Markdown/HTML:** Format reports for readability.

## Mock Mode Limitations
Real code modifications and API calls are disabled in mock mode.

## Future Unity Integration Plans
Transition from imageInputAdapter to unityInputAdapter for direct interaction with Unity logs and assets.