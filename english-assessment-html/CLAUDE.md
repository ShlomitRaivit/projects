# Project Instructions (english-assessment-html)

## Role and Goal
- **User role**: Product designer creating a visual, interactive prototype of an English assessment for middle-school students.
- **Goal**: Demonstrate and refine the user experience, not build production software.
- **Communication**: Plain language, short responses focused on visible results. No unsolicited implementation deep dives or large code dumps.

## Technical Scope
- Plain HTML, CSS, and vanilla JavaScript only.
- Opens directly from local files in the browser (`file://`).
- No installation, build steps, local servers, frameworks, or new dependencies.
- Use existing local Kaltura Design System (`ds/`) assets and documentation (`ds/DS-GUIDE.md`).
- No backend or real integrations; mock data and browser-only storage (`sessionStorage`).
- Listening audio files are not available yet: keep `audio.src` placeholders in `data.js`.
- Do not add generated audio, TTS, AI scoring, or external services unless explicitly requested.
- Prototype limitations are intentional, not issues to fix.

## Project Scope & Roadmap
- Planned areas: mobile and tablet support, final Speaking stage ("דיבור"), specific corrections to existing stages, completion-screen updates.
- This is context, not authorization to implement everything in advance.

## Working Approach
- Change only what is explicitly requested. Preserve everything else.
- Match effort to task: most requests are small UI, copy, layout, or interaction changes.
- Prefer the smallest sufficient change and reuse existing patterns.
- Do not refactor, redesign, or add features/infrastructure unless requested.
- Implement straightforward requests directly. Ask one concise question only when ambiguity materially affects the result.
- If a request requires changing something outside its scope, explain briefly before proceeding.

## Token Efficiency
- Read only relevant files and sections.
- Avoid repeated repository scans, unchanged documentation reads, lengthy plans, and repeated summaries.
- Use focused checks appropriate to the change. Avoid broad test runs for minor copy or styling edits.
- Report briefly: what changed, what was checked, and any blocker.

## Git & Boundaries
- Work only inside `english-assessment-html`.
- Use branch `Quiz-Oral-assessment`. If another branch is active, notify the user before making changes; do not switch automatically.
- Preserve unrelated work and never include other projects' files in commits.
- Before every commit: list exact files, briefly summarize changes and checks, and wait for explicit approval.
- Push and merge each require separate explicit approval.
- Never discard changes or run destructive Git commands without explicit approval.
