// assets/js/pulse-grouping.js
import {
  getQueryParams,
  encodeTrackToBits,
  decodeBitsToTrack,
  clamp,
  downloadTextFile
} from "./shared.js";

let schedulerId = null;
let toneStarted = false;
const tonePlayers = {};

// Sample sources pulled from Drumhaus (CC BY-NC 4.0 by Max Fung).
const SOUND_LIBRARY = {
  pulse: {
    url: "assets/drumhaus-main/public/samples/3/dk_stick_click.wav",
    volume: -10
  },
  "hat-bright": {
    url: "assets/drumhaus-main/public/samples/9/hat_crisp.wav",
    volume: -4
  },
  clave: {
    url: "assets/drumhaus-main/public/samples/3/dk_sidestick.wav",
    volume: -6
  },
  shaker: {
    url: "assets/drumhaus-main/public/samples/3/dk_shaker.wav",
    volume: -8
  },
  wood: {
    url: "assets/drumhaus-main/public/samples/0/tom2.wav",
    volume: -6
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // --- Constants & state ---
  const pulsesPerRow = 16;
  const initialParams = getQueryParams();
  const embedMode = initialParams.embed === "1";
  if (embedMode && document.body) {
    document.body.classList.add("embedded");
  }

  let patternLength = 16;
  let repeats = 8;
  let tempo = 90;
  let pulseOn = true;

  let trackA = [];
  let trackB = [];
  let trackASound = "hat-bright";
  let trackBSound = "clave";

  let isPlaying = false;
  let currentStep = 0;
  let maxSteps = patternLength * repeats;
  let infiniteRepeats = false;

  function getStepDurationMs() {
    return (60 / tempo / 4) * 1000;
  }

  const gridContainer = document.getElementById("grid-container");

  // DOM elements
  const playBtn = document.getElementById("play-btn");
  const stopBtn = document.getElementById("stop-btn");
  const tempoSlider = document.getElementById("tempo-slider");
  const tempoLabel = document.getElementById("tempo-label");
  const lengthSelect = document.getElementById("length-select");
  const lengthCustomInput = document.getElementById("length-custom");
  const repeatsInput = document.getElementById("repeats-input");
  const repeatInfiniteToggle = document.getElementById("repeat-infinite");
  const soundASelect = document.getElementById("sound-a-select");
  const soundBSelect = document.getElementById("sound-b-select");
  soundASelect.value = trackASound;
  soundBSelect.value = trackBSound;

  function updateLengthControls(len) {
    const clamped = clamp(len, 1, 36);
    lengthCustomInput.value = clamped;
    let match = false;
    for (const opt of lengthSelect.options) {
      if (opt.value !== "custom" && parseInt(opt.value, 10) === clamped) {
        lengthSelect.value = opt.value;
        match = true;
        break;
      }
    }
    if (match) {
      lengthCustomInput.classList.add("hidden");
    } else {
      lengthSelect.value = "custom";
      lengthCustomInput.classList.remove("hidden");
    }
  }

  function updateRepeatControls() {
    repeatInfiniteToggle.checked = infiniteRepeats;
    if (infiniteRepeats) {
      repeatsInput.type = "text";
      repeatsInput.readOnly = true;
      repeatsInput.value = "∞";
      repeatsInput.classList.add("infinite-indicator");
    } else {
      repeatsInput.type = "number";
      repeatsInput.readOnly = false;
      repeatsInput.value = repeats;
      repeatsInput.classList.remove("infinite-indicator");
      repeatsInput.min = "1";
      repeatsInput.max = "32";
      repeatsInput.step = "1";
    }
  }
  const pulseToggle = document.getElementById("pulse-toggle");
  const exportBtn = document.getElementById("export-btn");
  const exportArea = document.getElementById("export-area");
  const downloadTxtBtn = document.getElementById("download-txt-btn");
  const downloadJsonBtn = document.getElementById("download-json-btn");
  const shareLinkBtn = document.getElementById("share-link-btn");
  const presetSelect = document.getElementById("preset-select");
  const loadPresetBtn = document.getElementById("load-preset-btn");

  // --- Presets ---
  const PRESETS = {
    empty: () => ({
      patternLength: 16,
      tempo: 90,
      repeats: 8,
      trackA: new Array(16).fill(false),
      trackB: new Array(16).fill(false)
    }),
    "two-three-alt": () => {
      const len = 16;
      const a = new Array(len).fill(false);
      // Simple 2-3-2-3 feel (events marking starts of groups)
      // pulses: 1,3,6,8,11,13
      [0, 2, 5, 7, 10, 12].forEach(i => { if (i < len) a[i] = true; });
      const b = new Array(len).fill(false);
      return { patternLength: len, tempo: 96, repeats: 8, trackA: a, trackB: b };
    },
    "cross-23": () => {
      const len = 12;
      const a = new Array(len).fill(false);
      const b = new Array(len).fill(false);
      // A marks group-of-2 starts: 1,3,5,7,9,11
      [0, 2, 4, 6, 8, 10].forEach(i => { a[i] = true; });
      // B marks group-of-3 starts: 1,4,7,10
      [0, 3, 6, 9].forEach(i => { if (i < len) b[i] = true; });
      return { patternLength: len, tempo: 84, repeats: 12, trackA: a, trackB: b };
    },
    "offset-23": () => {
      const len = 16;
      const a = new Array(len).fill(false);
      const b = new Array(len).fill(false);
      // A: 2-3 repeating (mark group starts)
      [0, 2, 5, 7, 10, 12, 15].forEach(i => { if (i < len) a[i] = true; });
      // B: same but offset by 1 pulse
      [1, 3, 6, 8, 11, 13].forEach(i => { if (i < len) b[i] = true; });
      return { patternLength: len, tempo: 96, repeats: 8, trackA: a, trackB: b };
    },
    "random-23": () => {
      // Random 2/3 grouping pattern across track A, B initially empty.
      const len = 16;
      const a = new Array(len).fill(false);
      let i = 0;
      while (i < len) {
        const span = Math.random() < 0.5 ? 2 : 3;
        a[i] = true;
        // We could optionally fill span or just mark starts; keeping simple.
        i += span;
      }
      const b = new Array(len).fill(false);
      return { patternLength: len, tempo: 90, repeats: 8, trackA: a, trackB: b };
    }
  };

  function applyPreset(presetName) {
    const fn = PRESETS[presetName];
    if (!fn) return;
    const p = fn();
    patternLength = p.patternLength;
    tempo = p.tempo;
    repeats = p.repeats;
    infiniteRepeats = false;
    trackA = p.trackA.slice();
    trackB = p.trackB.slice();

    // Update UI
    tempoSlider.value = tempo;
    tempoLabel.textContent = `${tempo} BPM`;

    updateLengthControls(patternLength);
    updateRepeatControls();
    maxSteps = patternLength * repeats;

    if (isPlaying) {
      stopPlayback();
    }

    buildGrid();
  }

  // --- Pattern init ---
  function initPattern(len) {
    patternLength = clamp(len, 1, 36);
    trackA = new Array(patternLength).fill(false);
    trackB = new Array(patternLength).fill(false);
    currentStep = 0;
    maxSteps = infiniteRepeats ? Infinity : patternLength * repeats;
  }

  // --- Grid building ---
  function buildGrid() {
  gridContainer.innerHTML = "";

  const rowBlock = document.createElement("div");
  rowBlock.className = "row-block";

  const label = document.createElement("div");
  label.className = "row-label";
  label.textContent = `Pulses 1–${patternLength}`;
  rowBlock.appendChild(label);

  // ----- Pulse Row -----
  const pulseRow = document.createElement("div");
  pulseRow.className = "pulse-row";

  const pulseLabel = document.createElement("div");
  pulseLabel.className = "pulse-label";
  pulseLabel.textContent = "Pulse";
  pulseRow.appendChild(pulseLabel);

  for (let i = 0; i < patternLength; i++) {
    const dot = document.createElement("div");
    dot.className = "pulse-dot";
    dot.dataset.index = i.toString();
    pulseRow.appendChild(dot);
  }

  rowBlock.appendChild(pulseRow);

  // ----- Track A -----
  const trackRowA = document.createElement("div");
  trackRowA.className = "track-row";

  const trackLabelA = createTrackLabel("Track A", () => {
    trackA = new Array(patternLength).fill(false);
    buildGrid();
  });
  trackRowA.appendChild(trackLabelA);

  for (let i = 0; i < patternLength; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i.toString();
    cell.dataset.track = "A";
    if (trackA[i]) cell.classList.add("track-a-on");

    cell.addEventListener("click", onCellClick);
    cell.addEventListener("mouseenter", onCellHoverEnter);
    cell.addEventListener("mouseleave", onCellHoverLeave);

    trackRowA.appendChild(cell);
  }

  rowBlock.appendChild(trackRowA);

  // ----- Track B -----
  const trackRowB = document.createElement("div");
  trackRowB.className = "track-row";

  const trackLabelB = createTrackLabel("Track B", () => {
    trackB = new Array(patternLength).fill(false);
    buildGrid();
  });
  trackRowB.appendChild(trackLabelB);

  for (let i = 0; i < patternLength; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i.toString();
    cell.dataset.track = "B";
    if (trackB[i]) cell.classList.add("track-b-on");

    cell.addEventListener("click", onCellClick);
    cell.addEventListener("mouseenter", onCellHoverEnter);
    cell.addEventListener("mouseleave", onCellHoverLeave);

    trackRowB.appendChild(cell);
  }

  rowBlock.appendChild(trackRowB);

  gridContainer.appendChild(rowBlock);

  updateCurrentPulseHighlight(-1);
  requestEmbedResize();
}

function createTrackLabel(labelText, clearHandler) {
  const label = document.createElement("div");
  label.className = "track-label";

  const textSpan = document.createElement("span");
  textSpan.textContent = labelText;
  label.appendChild(textSpan);

  const clearBtn = document.createElement("button");
  clearBtn.className = "btn tiny";
  clearBtn.type = "button";
  clearBtn.textContent = "Clear";
  clearBtn.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    clearHandler();
  });
  label.appendChild(clearBtn);

  return label;
}


  // --- Cell interaction ---

  function onCellClick(e) {
    const cell = e.currentTarget;
    const index = parseInt(cell.dataset.index, 10);
    const track = cell.dataset.track;
    if (isNaN(index)) return;

    if (track === "A") {
      applyClickToTrack(trackA, index);
    } else if (track === "B") {
      applyClickToTrack(trackB, index);
    }
    buildGrid();
  }

function applyClickToTrack(trackArr, index) {
  trackArr[index] = !trackArr[index];
}

  // --- Hover guides ---

  function onCellHoverEnter(e) {
    const cell = e.currentTarget;
    const index = parseInt(cell.dataset.index, 10);
    if (isNaN(index)) return;

    // Highlight column across pulse & both tracks
    highlightColumn(index, true);
  }

  function onCellHoverLeave(e) {
    const cell = e.currentTarget;
    const index = parseInt(cell.dataset.index, 10);
    if (isNaN(index)) return;

    highlightColumn(index, false);
  }

  function highlightColumn(index, on) {
    const dots = gridContainer.querySelectorAll(`.pulse-dot[data-index="${index}"]`);
    const cells = gridContainer.querySelectorAll(`.cell[data-index="${index}"]`);

    dots.forEach(d => {
      if (on) d.classList.add("col-highlight");
      else d.classList.remove("col-highlight");
    });
    cells.forEach(c => {
      if (on) c.classList.add("col-highlight");
      else c.classList.remove("col-highlight");
    });
  }

  // --- Playback ---

  const stepCallback = () => {
    const patternIndex = currentStep % patternLength;

    if (pulseOn) {
      triggerPulseSound();
    }
    if (trackA[patternIndex]) {
      triggerTrackSound(trackASound);
    }
    if (trackB[patternIndex]) {
      triggerTrackSound(trackBSound);
    }

    updateCurrentPulseHighlight(currentStep);

    currentStep++;
    if (!infiniteRepeats && currentStep >= maxSteps) {
      stopPlayback();
    }
  };

  async function startPlayback() {
    if (isPlaying) return;
    const toneReady = await ensureToneReady();
    if (!toneReady) {
      console.warn("Tone.js not available; playback will be silent.");
    }
    currentStep = 0;
    maxSteps = infiniteRepeats ? Infinity : patternLength * repeats;
    isPlaying = true;
    updatePlayButtonState();
    const delay = 120;
    const interval = getStepDurationMs();
    setTimeout(() => {
      if (!isPlaying) return;
      stepCallback();
      schedulerId = window.setInterval(stepCallback, interval);
    }, delay);
  }

  function stopPlayback() {
    if (!isPlaying) return;
    if (schedulerId !== null) {
      clearInterval(schedulerId);
      schedulerId = null;
    }
    isPlaying = false;
    currentStep = 0;
    updateCurrentPulseHighlight(-1);
    updatePlayButtonState();
  }

  function togglePlayPause() {
    if (!isPlaying) {
      startPlayback().catch(err => {
        console.error("Unable to start audio", err);
      });
    } else {
      pausePlayback();
    }
  }

  function pausePlayback() {
    if (!isPlaying) return;
    if (schedulerId !== null) {
      clearInterval(schedulerId);
      schedulerId = null;
    }
    isPlaying = false;
    updatePlayButtonState();
  }

  function updateCurrentPulseHighlight(stepIndex) {
    // clear current
    const allDots = gridContainer.querySelectorAll(".pulse-dot");
    allDots.forEach(dot => dot.classList.remove("current"));

    if (stepIndex < 0) return;

    const patternIndex = stepIndex % patternLength;
    const currentDot = gridContainer.querySelector(
      `.pulse-dot[data-index="${patternIndex}"]`
    );
    if (currentDot) {
      currentDot.classList.add("current");
      const block = currentDot.closest(".row-block");
      if (block) {
        const blockRect = block.getBoundingClientRect();
        const containerRect = gridContainer.getBoundingClientRect();
        if (blockRect.top < containerRect.top || blockRect.bottom > containerRect.bottom) {
          block.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }

  function updatePlayButtonState() {
    playBtn.textContent = isPlaying ? "Pause" : "Play";
  }

  // --- Export / Save / Share ---

  function buildExportText() {
    const lines = [];
    lines.push(`Tempo: ${tempo} BPM`);
    lines.push(`Pattern length: ${patternLength} pulses`);
    lines.push(`Repeats: ${infiniteRepeats ? "∞ (loop)" : repeats}`);
    lines.push("");

    const LABEL_WIDTH = 10;
    const padLabel = label => label.padEnd(LABEL_WIDTH, " ");

    const pulseRow =
      padLabel("Pulses:") +
      Array.from({ length: patternLength }, () => "● ").join("").trimEnd();
    const trackARow =
      padLabel("Track A:") +
      trackA.map(v => (v ? "X " : ". ")).join("").trimEnd();
    const trackBRow =
      padLabel("Track B:") +
      trackB.map(v => (v ? "X " : ". ")).join("").trimEnd();

    lines.push(pulseRow);
    lines.push(trackARow);
    lines.push(trackBRow);

    return lines.join("\n");
  }

  function exportPattern() {
    exportArea.value = buildExportText();
  }

  function downloadTxt() {
    const text = exportArea.value || buildExportText();
    downloadTextFile("pulse-grouping-pattern.txt", text);
  }

  function downloadJson() {
    const data = {
      tempo,
      patternLength,
      repeats,
      infiniteRepeats,
      trackA: trackA.slice(),
      trackB: trackB.slice()
    };
    const json = JSON.stringify(data, null, 2);
    downloadTextFile("pulse-grouping-pattern.json", json);
  }

  function buildShareLink() {
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set("len", patternLength.toString());
    params.set("rep", infiniteRepeats ? "inf" : repeats.toString());
    params.set("tempo", tempo.toString());
    params.set("a", encodeTrackToBits(trackA));
    params.set("b", encodeTrackToBits(trackB));
    return `${base}?${params.toString()}`;
  }

  async function copyShareLink() {
    const link = buildShareLink();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(link);
        alert("Shareable link copied to clipboard.");
      } catch (e) {
        console.error(e);
        alert("Unable to copy to clipboard. Here is your link:\n" + link);
      }
    } else {
      // Fallback
      alert("Here is your shareable link:\n" + link);
    }
  }

  // --- URL param loading ---

  function loadFromQueryParams(params = initialParams) {
    if (!params || Object.keys(params).length === 0) return;

    if (params.len) {
      const len = clamp(parseInt(params.len, 10) || 16, 1, 36);
      patternLength = len;
    }
    if (params.rep) {
      if (params.rep === "inf") {
        infiniteRepeats = true;
      } else {
        repeats = clamp(parseInt(params.rep, 10) || 8, 1, 32);
        infiniteRepeats = false;
      }
    }
    if (params.tempo) {
      tempo = clamp(parseInt(params.tempo, 10) || 90, 40, 200);
    }

    trackA = new Array(patternLength).fill(false);
    trackB = new Array(patternLength).fill(false);

    if (params.a) {
      trackA = decodeBitsToTrack(params.a, patternLength);
    }
    if (params.b) {
      trackB = decodeBitsToTrack(params.b, patternLength);
    }

    // Update UI to reflect loaded values
    tempoSlider.value = tempo;
    tempoLabel.textContent = `${tempo} BPM`;

    updateLengthControls(patternLength);
    updateRepeatControls();
    maxSteps = infiniteRepeats ? Infinity : patternLength * repeats;
  }

  // --- Wiring up controls ---

  playBtn.addEventListener("click", togglePlayPause);
  stopBtn.addEventListener("click", () => {
    stopPlayback();
  });

  tempoSlider.addEventListener("input", e => {
    tempo = parseInt(e.target.value, 10);
    tempoLabel.textContent = `${tempo} BPM`;
    if (isPlaying && schedulerId !== null) {
      clearInterval(schedulerId);
      schedulerId = window.setInterval(stepCallback, getStepDurationMs());
    }
  });

  lengthSelect.addEventListener("change", e => {
    if (e.target.value === "custom") {
      lengthCustomInput.classList.remove("hidden");
      lengthCustomInput.focus();
      lengthCustomInput.value = patternLength;
      return;
    }
    lengthCustomInput.classList.add("hidden");
    const len = parseInt(e.target.value, 10);
    initPattern(len);
    updateLengthControls(patternLength);
    buildGrid();
  });

  lengthCustomInput.addEventListener("change", e => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = patternLength;
    val = clamp(val, 1, 36);
    e.target.value = val;
    initPattern(val);
    updateLengthControls(patternLength);
    buildGrid();
  });

  repeatsInput.addEventListener("change", e => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 1;
    val = clamp(val, 1, 32);
    repeats = val;
    e.target.value = val;
    maxSteps = infiniteRepeats ? Infinity : patternLength * repeats;
    updateRepeatControls();
  });

  repeatInfiniteToggle.addEventListener("change", e => {
    infiniteRepeats = e.target.checked;
    maxSteps = infiniteRepeats ? Infinity : patternLength * repeats;
    updateRepeatControls();
  });

  soundASelect.addEventListener("change", e => {
    trackASound = e.target.value;
  });

  soundBSelect.addEventListener("change", e => {
    trackBSound = e.target.value;
  });

  pulseToggle.addEventListener("change", e => {
    pulseOn = e.target.checked;
  });

  exportBtn.addEventListener("click", exportPattern);
  downloadTxtBtn.addEventListener("click", downloadTxt);
  downloadJsonBtn.addEventListener("click", downloadJson);
  shareLinkBtn.addEventListener("click", copyShareLink);

  loadPresetBtn.addEventListener("click", () => {
    const presetName = presetSelect.value;
    applyPreset(presetName);
  });

  // --- Initial setup ---

  // Either load from URL or start with empty
  initPattern(patternLength);
  loadFromQueryParams();
  updateLengthControls(patternLength);
  updateRepeatControls();
  buildGrid();

  if (embedMode) {
    window.addEventListener("resize", requestEmbedResize);
  }
});

function getTone() {
  if (typeof window === "undefined") return null;
  return window.Tone || null;
}

async function ensureToneReady() {
  const ToneLib = getTone();
  if (!ToneLib) return false;
  if (!toneStarted) {
    try {
      await ToneLib.start();
      toneStarted = true;
    } catch (err) {
      console.error("Unable to start Tone.js", err);
      return false;
    }
  }
  const ctx = ToneLib.getContext();
  if (ctx && ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch (err) {
      console.error("Unable to resume Tone.js audio context", err);
      return false;
    }
  }
  return true;
}

function getPlayer(soundId) {
  const ToneLib = getTone();
  if (!ToneLib) return null;
  const sound = SOUND_LIBRARY[soundId];
  if (!sound) return null;
  if (!tonePlayers[soundId]) {
    const player = new ToneLib.Player({
      url: sound.url,
      fadeIn: sound.fadeIn ?? 0.001,
      fadeOut: sound.fadeOut ?? 0.08,
      autostart: false
    }).toDestination();
    if (typeof sound.volume === "number") {
      player.volume.value = sound.volume;
    }
    tonePlayers[soundId] = player;
  }
  return tonePlayers[soundId];
}

function triggerPulseSound() {
  triggerSample("pulse");
}

function triggerTrackSound(soundId = "clave") {
  triggerSample(soundId);
}

function triggerSample(soundId) {
  const ToneLib = getTone();
  if (!ToneLib) return;
  const player = getPlayer(soundId);
  if (!player) return;
  player.start(ToneLib.now());
}

let embedResizeScheduled = false;
function requestEmbedResize() {
  if (!document.body || !document.body.classList.contains("embedded")) return;
  if (embedResizeScheduled) return;
  embedResizeScheduled = true;
  window.setTimeout(() => {
    embedResizeScheduled = false;
    sendEmbedResize();
  }, 100);
}

function sendEmbedResize() {
  if (!document.body || !document.body.classList.contains("embedded")) return;
  if (!window.parent || window.parent === window) return;
  const height =
    document.documentElement?.scrollHeight ||
    document.body?.scrollHeight ||
    document.body?.offsetHeight ||
    0;
  if (!height) return;
  window.parent.postMessage(
    {
      source: "pulse-grouping-lab",
      type: "resize",
      height
    },
    "*"
  );
}
