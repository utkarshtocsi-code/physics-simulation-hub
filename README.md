# ⚛️ Physics Simulation Hub

A modern, professional dashboard for **66 interactive Physics simulations** across 8 branches — built with React + Vite.

---

## 🚀 Quick Start

```bash
# 1. Is folder mein terminal open karein
cd science-sim-hub

# 2. Dependencies install karein
npm install

# 3. Dev server start karein
npm run dev

# 4. Browser mein open karein
# http://localhost:5173
```

---

## 📁 Project Structure

```
science-sim-hub/
├── public/
│   └── simulations/              ← Apni HTML files yahan rakhein
│       ├── mechanics/            (12 simulations)
│       ├── thermodynamics/       (8 simulations)
│       ├── waves-optics/         (10 simulations)
│       ├── electricity-magnetism/ (12 simulations)
│       ├── modern-physics/       (8 simulations)
│       ├── fluid-mechanics/      (6 simulations)
│       ├── gravitation/          (5 simulations)
│       └── oscillations/         (5 simulations)
│
├── src/
│   ├── data/
│   │   └── SimulationData.js    ← Saari 66 sims ka data
│   ├── components/
│   │   ├── Sidebar.jsx          ← Collapsible navigation
│   │   ├── SimCard.jsx          ← Simulation cards
│   │   └── TopBar.jsx           ← Page header
│   ├── pages/
│   │   ├── Dashboard.jsx        ← Home — branch overview
│   │   ├── BranchPage.jsx       ← Branch ki saari sims
│   │   └── SimulationPage.jsx   ← iFrame viewer
│   ├── hooks/
│   │   └── useSearch.js         ← Search logic
│   └── styles/
│       └── index.css            ← Global styles
│
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔬 8 Physics Branches — 66 Simulations

| Branch | Icon | Sims | Topics |
|---|---|---|---|
| Mechanics | ⚙️ | 12 | Motion, forces, collisions, rotation |
| Thermodynamics | 🌡️ | 8 | Heat, gases, engines, entropy |
| Waves & Optics | 🌊 | 10 | Sound, light, lenses, diffraction |
| Electricity & Magnetism | ⚡ | 12 | Circuits, fields, induction |
| Modern Physics | ⚛️ | 8 | Quantum, relativity, nuclear |
| Fluid Mechanics | 💧 | 6 | Pressure, flow, buoyancy |
| Gravitation | 🪐 | 5 | Orbits, Kepler, tides |
| Oscillations & SHM | 〰️ | 5 | Pendulum, springs, resonance |

---

## 📝 Apni HTML Files Kaise Replace Karein

Har placeholder file ka path `SimulationData.js` mein diya hua hai. Bas us path par apni actual simulation file rakh dein:

```
# Example:
public/simulations/mechanics/projectile-motion.html
   ↑ Is file ko apni actual PhET simulation se replace karein
```

**SimulationData.js mein path dekhen:**
```js
{ id: 1, path: "/simulations/mechanics/projectile-motion.html", ... }
```

---

## ✨ Features

- **Branch-wise navigation** — 8 folders, collapsible sidebar
- **Search** — Title, description aur tags se search
- **Difficulty filter** — Beginner / Intermediate / Advanced
- **iFrame viewer** — Simulations same tab mein open
- **Prev/Next navigation** — Branch ke andar sim-to-sim
- **Fullscreen** — Browser fullscreen support
- **Sidebar toggle** — More space for simulation
- **Loading indicator** — Shimmer bar while loading

---

## 🛠 Tech Stack

- **React 18** + **Vite 5**
- **React Router v6** — Client-side routing
- **CSS Variables** — Deep navy dark theme
- **Google Fonts** — Syne + DM Sans

---

## 📦 Production Build

```bash
npm run build
# Output: dist/ folder — deploy anywhere (Netlify, Vercel, GitHub Pages)
```
