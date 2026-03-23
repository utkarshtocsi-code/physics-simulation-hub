# Physics Simulation Hub — Release Guide

## PART 1: EK BAAR KA SETUP

### Step 1 — GitHub Repository banao
1. github.com → "+" → New repository
2. Name: physics-simulation-hub  |  Public  |  Create

### Step 2 — package.json update karo
"owner": "YOUR_GITHUB_USERNAME"  ← apna username daalo

### Step 3 — GitHub Token banao
github.com → Settings → Developer Settings
→ Personal Access Tokens → Generate new token
→ "repo" permission check karo → Copy karo

Terminal mein:
  Windows:  setx GH_TOKEN "aapka_token"
  Mac:      export GH_TOKEN="aapka_token"

### Step 4 — Git setup
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin https://github.com/USERNAME/physics-simulation-hub.git
  git push -u origin main

### Step 5 — Pehli release
  npm install --legacy-peer-deps
  npm run version:patch

20 minute mein github.com/USERNAME/physics-simulation-hub/releases
par .exe aur .dmg ready milenge!

### Step 6 — Link share karo
  https://github.com/USERNAME/physics-simulation-hub/releases/latest


## PART 2: HAR UPDATE KE LIYE (sirf 3 steps)

  git add .
  git commit -m "20 nayi sims add ki"
  npm run version:minor    ← ya patch ya major

BAS! GitHub Actions khud .exe + .dmg banake release kar deta hai.


## VERSION GUIDE

  patch  1.0.0 → 1.0.1   bug fix, typo
  minor  1.0.0 → 1.1.0   nayi simulations, features
  major  1.0.0 → 2.0.0   bada UI/architecture change


## STUDENT KA EXPERIENCE

  App khule → 3 sec mein check → Blue banner aaye:
  "New Update Available v1.1.0  [Download Now] [Baad Mein]"

  Download Now click → Progress bar → Restart & Install → Done!
  Ya app band karo → Automatically install hoga


## SAB FREE HAI
  GitHub hosting, Actions (build server), auto-update, unlimited downloads
  Windows .exe ~ 80-120 MB  |  Mac .dmg ~ 90-130 MB


## TROUBLESHOOTING

  "GH_TOKEN not set"     → Token dobara set karo, VS Code restart karo
  "Repository not found" → package.json mein owner naam check karo
  Build fail             → GitHub → Actions tab → Error log dekho
  Auto-update nahi dikh  → Sirf installed app mein kaam karta hai, dev mein nahi
