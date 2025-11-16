// assets/js/shared.js

/**
 * Parse URL query parameters into an object.
 */
function getQueryParams() {
  const params = {};
  const search = window.location.search;
  if (!search || search.length <= 1) return params;

  const pairs = search.substring(1).split("&");
  for (const pair of pairs) {
    const [rawKey, rawValue] = pair.split("=");
    if (!rawKey) continue;
    const key = decodeURIComponent(rawKey);
    const value = rawValue ? decodeURIComponent(rawValue) : "";
    params[key] = value;
  }
  return params;
}

/**
 * Encode a boolean track array as a simple "1010..." bit string.
 */
function encodeTrackToBits(trackArr) {
  return trackArr.map(v => (v ? "1" : "0")).join("");
}

/**
 * Decode a bit string ("1010...") into a boolean track array.
 */
function decodeBitsToTrack(bits, length) {
  const result = new Array(length).fill(false);
  for (let i = 0; i < length && i < bits.length; i++) {
    result[i] = bits[i] === "1";
  }
  return result;
}

/**
 * Clamp a number between min and max.
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Download a text file with given filename and content.
 */
function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}