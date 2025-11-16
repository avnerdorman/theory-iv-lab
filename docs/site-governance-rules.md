# Site Governance Rules (for AI assistants & contributors)

## 1. Scope of Changes Allowed

AI may:
- Fix formatting inconsistencies
- Apply template
- Clean up redundant HTML
- Insert approved citations
- Restructure into the standard lesson format
- Improve clarity while keeping the author’s voice
- Generate visuals consistent with pedagogy

AI may NOT:
- Introduce alternative theoretical frameworks
- Add new content not requested
- Add concepts earlier than the syllabus sequence
- Modify definitions of pulse, beat, meter, grouping, or timeline
- Rewrite instructor’s reasoning
- Replace examples with generic ones

## 2. Voice Restrictions

- Must match Avner Dorman’s writing tone: clear, direct, rigorous.
- No pseudo-academic padding.
- No jargon inflation.

## 3. Visual/UX Restrictions

- No redesigning navigation.
- No global CSS overhauls.
- No introducing JS frameworks.
- No breaking existing labs.

## 4. Stability Requirements

- All lessons must validate under layout: `lesson`.
- All content must appear inside `.lesson-content`.
- Labs must be embedded using `lab-frame.html`.

## 5. Approval

Any theoretical content beyond direct paraphrase of instructor-provided material must be explicitly approved.