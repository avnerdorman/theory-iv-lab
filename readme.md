# Theory IV Interactive Lab

Browser-based tools for **MUS_CLAS 242 – Post-Tonal Theory**  
Gettysburg College — Avner Dorman

This repository hosts interactive demonstrations and compositional tools that support instruction in
temporal organization, grouping, post-tonal structures, and analytical techniques.

These tools run entirely client-side (HTML/JS/CSS), require **no installation**, and load directly in any modern browser.

---

## Live Site (GitHub Pages)

Once published, this repo will be available at:
https://avnerdorman.github.io/theory-iv-lab/

## Tools Included

### **Pulse & Groupings Lab**  
`pulse-grouping-lab.html`  
Interactive sequencer for exploring:

- a steady pulse   
- grouping pulses into 2s and 3s  
- layered grouping lines (two independent tracks)  
- hemiola-like textures without needing notation  
- saving patterns, exporting text/JSON, and sharing via URL parameters  

Designed to support early-semester lessons on pulse → groupings → rhythmic reasoning, before introducing notation, hierarchy, or meter.

---

## 🗂 File Structure
theory-iv-lab/
│
├── index.html               # landing page for GitHub Pages
├── pulse-grouping-lab.html  # main interactive tool
│
├── assets/
│   ├── css/
│   │   └── main.css         # shared styling
│   └── js/
│       ├── shared.js        # URL parsing, exports, helpers
│       └── pulse-grouping.js # sequencer + Tone.js logic
│
└── README.md


---

## 🛠 Local Use

Clone the repo:

```bash
git clone https://github.com/avnerdorman/theory-iv-lab.git

Open any .html file directly in a browser (double-click from Finder/Explorer).

The tools do not require a server.

⸻

🌱 Future Tools (planned)

This repo is structured to accommodate additional interactive demos, such as:
	•	Euclidean rhythm generator
	•	Hocket pattern builder
	•	Set-class / interval vector visualizers
	•	Post-tonal voice-leading paths
	•	Algorithmic rhythm generators (maximally even, R–operations, etc.)

⸻

📬 Contact

Avner Dorman
Gettysburg College
Sunderman Conservatory of Music

⸻

© 2025 Avner Dorman – All rights reserved