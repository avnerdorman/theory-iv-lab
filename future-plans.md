## Future Enhancements

1. **Add Audio Samples**
   - Collect a small set of percussion one-shots (kick, clave, shaker, wood block) and place them under `assets/audio/`.
   - Preload the samples via `fetch`/`AudioContext.decodeAudioData` and trigger them per track instead of (or alongside) the current synthesized clicks.
   - Update the sound dropdowns so each option maps to a specific sample or synth voice, allowing richer timbres while keeping load times light.

2. **Preset Management**
   - Allow saving custom presets to `localStorage` and exporting/importing JSON bundles so students can bring custom patterns back later.

3. **Visual Enhancements**
   - Add a zoomable timeline or highlight groupings visually (e.g., color blocks for 2s vs. 3s) to help students see cross-rhythms at longer lengths.

4. **Accessibility**
   - Provide keyboard navigation for toggling cells and ARIA labels for controls to make the lab more accessible.

5. **Additional Track Features**
   - Optional third layer for ostinatos or bass drum pulses.
   - Per-track mute/solo buttons and gain sliders.
