---
layout: default
title: "Music Theory IV — MUS_CLAS 242"
---
<section class="course-panel">
  <h1>Music Theory IV — MUS_CLAS 242</h1>
  <p>
    Welcome to the hub for course materials, labs, and interactive tools for the Spring 2026
    semester. Start with Week 1 to explore pulse, grouping, and rhythmic intuition; additional
    weeks will unlock progressively as the semester moves forward.
  </p>
</section>

<section class="course-panel">
  <h2>Course Overview</h2>
  <p>
    In this course we will explore rhythm, meter, pulse, grouping, Euclidean structures, 
    contour, post-tonal materials, and compositional techniques in contemporary and 
    world musical traditions. You will analyze, compose, perform, and listen critically 
    using both traditional notation and alternative rhythmic representations.
  </p>
  <p>
    This site includes interactive tools (pulse visualizer, grouping lab, rhythmic sequencers), 
    readings, listening, and assignments designed to build intuition and technical skill in 
    temporal structures.
  </p>
</section>

<section class="course-panel">
  <h2>Week Modules</h2>
  <p>Select a week to open readings, listening lists, and interactive tools. Locked weeks will unlock as we progress.</p>
  <div class="week-grid">
    <div class="week-card">
      <h3>Week 1</h3>
      <span class="badge-open">Open</span>
      <ul>
        <li><a href="{{ '/weeks/week1/pulse.html' | relative_url }}">Music in Time — Pulse</a></li>
        <li><a href="{{ '/weeks/week1/grouping-pulses.html' | relative_url }}">Grouping Pulses</a></li>
        <li><a href="{{ '/weeks/week1/pulse-grouping-lab.html' | relative_url }}">Pulse Grouping Lab (interactive)</a></li>
      </ul>
    </div>
    {% for w in (2..14) %}
    <div class="week-card locked">
      <h3>Week {{ w }}</h3>
      <span class="badge-locked">Locked</span>
    </div>
    {% endfor %}
  </div>
</section>

<section class="course-panel">
  <h2>Tools & Resources</h2>
  <ul>
    <li><a href="{{ '/weeks/week1/pulse.html' | relative_url }}">Pulse Visualizer</a></li>
    <li><a href="{{ '/weeks/week1/grouping-pulses.html' | relative_url }}">Grouping Explorer</a></li>
    <li><a href="{{ '/weeks/week1/pulse-grouping-lab.html' | relative_url }}">Pulse Grouping Lab (interactive)</a></li>
    <li><a href="{{ '/future-plans.md' | relative_url }}">Future plans & syllabus notes</a></li>
  </ul>
</section>
