---
layout: week
title: "Pulse Grouping Lab (interactive)"
week: 1
section: tools
---
<section class="course-panel lab-embed">
  <iframe 
      id="week-lab-frame"
      class="lab-frame"
      src="{{ '/pulse-grouping-lab.html?embed=1' | relative_url }}"
      title="Pulse Grouping Lab"
      loading="lazy"
      scrolling="no"
      aria-label="Pulse Grouping Lab">
  </iframe>
</section>

<script>
document.addEventListener("DOMContentLoaded", () => {
  const frame = document.getElementById("week-lab-frame");
  if (!frame) return;

  const MIN_HEIGHT = 760;

  window.addEventListener("message", event => {
    const data = event.data;
    if (!data || data.source !== "pulse-grouping-lab" || data.type !== "resize") return;
    if (typeof data.height !== "number" || data.height <= 0) return;
    const nextHeight = Math.max(MIN_HEIGHT, Math.round(data.height) + 20);
    frame.style.height = `${nextHeight}px`;
  });
});
</script>
