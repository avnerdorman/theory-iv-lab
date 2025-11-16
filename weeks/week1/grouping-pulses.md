---
layout: week
title: "Grouping Pulses and Hemiola"
week: 1
---
<div class="lesson-content">

Once we establish an even pulse, the next step is to organize it into groups of pulses. This is the beginning of rhythm.

A key finding from music psychology helps explain why grouping is necessary:

> “When humans hear evenly spaced identical sounds, the mind automatically groups them —
> most often into pairs (‘tick–tock’).”<sup>1</sup>

Grouping is therefore not only a musical choice. It is a basic cognitive response to an even sequence of sounds.

This leads to an important distinction:

## Pulse
Evenly spaced temporal points without pattern.

## Grouping
The first level of structure we impose on pulses.

There is still no meter, no hierarchy, and no strong or weak elements.

We are simply placing pulses together in small units.

## Basic Group Sizes
Across many musical traditions, the simplest and most common groupings are:

- groups of 2 pulses
- groups of 3 pulses

These units form the basic building blocks for many rhythmic structures.<sup>2</sup>

## Hemiola (2s and 3s Together)
A hemiola occurs when 2-pulse groupings and 3-pulse groupings occur 
at the same time or in close succession over the same underlying pulse.

At this stage we are not discussing beat or meter.

Here, the term *hemiola* simply refers to the interaction of two different ways of grouping the same pulse.

This interaction creates the characteristic hemiola effect, even when all pulses are equally spaced and unaccented.

## Try It
Use the interactive tool below to:

- begin with a steady pulse
- add 2-pulse groupings
- add 3-pulse groupings
- layer or offset the groupings
- listen for the patterns that emerge

This provides an experiential foundation for rhythm built only from pulse and grouping.

It will prepare us for later topics such as Euclidean rhythms, bi-rhythms, timelines, and metric modulation.

</div>

<section class="course-panel lab-embed">
  <iframe 
      id="pulse-tool-frame"
      class="lab-frame"
      src="{{ '/pulse-grouping-lab.html?embed=1' | relative_url }}"
      title="Pulse Grouping Interactive Lab"
      loading="lazy"
      scrolling="no"
      aria-label="Interactive pulse grouping lab">
  </iframe>
</section>

<div class="lesson-content">

## Notes
<sup>1</sup> Bolton, Thaddeus L. “Rhythm.” *The American Journal of Psychology* 6, no. 2 (1894): 145–238. 
Quoted in Godfried T. Toussaint, *The Geometry of Musical Rhythm* (Boca Raton: CRC Press, 2013), 9.

<sup>2</sup> Godfried T. Toussaint, *The Geometry of Musical Rhythm* (Boca Raton: CRC Press, 2013), 11; 
Fred Lerdahl and Ray Jackendoff, *A Generative Theory of Tonal Music* (Cambridge: MIT Press, 1983), 13.

</div>

<script>
document.addEventListener("DOMContentLoaded", () => {
  const frame = document.getElementById("pulse-tool-frame");
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
