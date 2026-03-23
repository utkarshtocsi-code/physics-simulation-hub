# 📦 Physics Hub — Content Update Guide
# Nayi Simulations aur PDFs kaise add karein

---

## 🔧 Setup (Ek baar karna hai)

### 1. GitHub par do repositories banao (FREE):

```
Repository 1: physics-simulation-hub    ← App ka source code
Repository 2: physics-sim-content       ← Content updates (JSON + files)
```

### 2. `useContentUpdater.js` mein apna username daalein:
```js
const GITHUB_USER = 'aapka-github-username'   // ← yahan
const GITHUB_REPO = 'physics-sim-content'
```

### 3. `package.json` mein publish config daalein:
```json
"build": {
  "publish": {
    "provider": "github",
    "owner": "aapka-github-username",
    "repo": "physics-simulation-hub"
  }
}
```

---

## 📝 Update Type 1: App Update (.exe / .dmg release)

**Kab karein:** Jab nayi simulations ko app ke andar bundle karna ho (offline available)

### Steps:
```bash
# 1. SimulationData.js mein nayi sim add karein (id: 134, 135, ...)
# 2. HTML file public/simulations/[branch]/ mein rakhein
# 3. Version bump karein
npm version patch   # 1.0.0 → 1.0.1  (small fix)
npm version minor   # 1.0.0 → 1.1.0  (nayi sims)
npm version major   # 1.0.0 → 2.0.0  (bada change)

# 4. Build karein
npm run electron:win    # Windows ke liye
npm run electron:mac    # Mac ke liye

# 5. GitHub Release banao
# GitHub par jaao → Releases → New Release → Upload .exe aur .dmg
# Students ko automatic update notification milegi!
```

---

## 📝 Update Type 2: Online Content Update (Bina app rebuild kiye!)

**Kab karein:** Jab sirf data/PDF add karna ho, app rebuild nahi karna

### Step 1 — `physics-sim-content` repo mein `content.json` update karein:

```json
{
  "version": "1.2.0",
  "lastUpdated": "2026-04-01",
  "announcement": "20 nayi simulations add ki gayi hain! 🎉",

  "simulations": [
    {
      "id": 134,
      "branch": "mechanics",
      "title": "Rocket Propulsion",
      "description": "Newton's third law se rocket kaise chalti hai",
      "difficulty": "Advanced",
      "path": "https://raw.githubusercontent.com/YOUR_USER/physics-sim-content/main/simulations/rocket-propulsion.html",
      "tags": ["rocket", "newton", "propulsion"],
      "source": "online"
    }
  ],

  "pdfs": [
    {
      "id": "pdf-online-01",
      "branch": "mechanics",
      "title": "Advanced Mechanics Notes",
      "description": "Lagrangian mechanics aur advanced topics",
      "url": "https://raw.githubusercontent.com/YOUR_USER/physics-sim-content/main/pdfs/advanced-mechanics.pdf",
      "type": "notes",
      "pages": 30,
      "tags": ["advanced", "lagrangian"],
      "source": "online"
    }
  ],

  "branches": []
}
```

### Step 2 — Files GitHub par upload karein:
```
physics-sim-content/
  ├── content.json          ← Yeh update karo
  ├── simulations/
  │   └── rocket-propulsion.html   ← Nayi sim
  └── pdfs/
      └── advanced-mechanics.pdf   ← Nayi PDF
```

### Step 3 — Commit & Push:
```bash
git add .
git commit -m "Add rocket propulsion simulation"
git push
```

**Bas! Students ka app automatically next 6 hours mein update ho jaayega.** ✅

---

## 📝 Update Type 3: Sirf Announcement

```json
{
  "announcement": "Kal exam hai — Mechanics revision zaroor karein! 📚",
  "simulations": [],
  "pdfs": [],
  "branches": []
}
```

Commit karo → Push karo → Students ko banner dikhe ga!

---

## 📁 Local PDF Files Add Karna (Offline Bundle)

```
# PDF file yahan rakhein:
public/pdfs/[branch]/filename.pdf

# PDFData.js mein entry add karein:
{
  id: 'pdf-mech-04',
  branch: 'mechanics',
  title: 'Rotational Dynamics Notes',
  filename: 'mechanics/rotational-dynamics.pdf',
  type: 'notes',
  pages: 15,
  tags: ['rotation', 'torque'],
}

# Phir app rebuild karein:
npm run electron:win
```

---

## 🗂️ Quick Reference

| Kya add karna hai | Kaise | App rebuild? |
|---|---|---|
| Nayi offline simulation | `SimulationData.js` + HTML file | ✅ Haan |
| Nayi offline PDF | `PDFData.js` + PDF file | ✅ Haan |
| Nayi online simulation | `content.json` push | ❌ Nahi |
| Nayi online PDF | `content.json` push | ❌ Nahi |
| Announcement | `content.json` push | ❌ Nahi |
| Bug fix | Code fix + rebuild | ✅ Haan |
| Nayi branch | `SimulationData.js` branches[] | ✅ Haan |

---

## ⚡ Shortcut: Ek Script se Sab Karo

```bash
# add-content.bat (Windows) — nayi sim add karne ke baad run karo
npm version minor && npm run electron:win
```
