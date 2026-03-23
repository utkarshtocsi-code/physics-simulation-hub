# ⚛️ Physics Simulation Hub — Desktop App Setup

## 🚀 Step 1: New Dependencies Install Karein

```bash
npm install --legacy-peer-deps
```

---

## 🖥️ Step 2: Development mein Electron Test Karein

```bash
npm run electron:dev
```

Yeh command:
1. Vite dev server start karega (port 5173)
2. Automatically Electron window open karega
3. Aap real-time changes dekh sakte hain

---

## 📦 Step 3: App Build Karein

### Windows ke liye (.exe installer):
```bash
npm run electron:win
```

### Mac ke liye (.dmg):
```bash
npm run electron:mac
```

### Dono ke liye:
```bash
npm run electron:build
```

---

## 📁 Output Files

Build hone ke baad `release/` folder mein milega:

```
release/
  ├── Physics Simulation Hub Setup 1.0.0.exe   ← Windows installer
  ├── Physics Simulation Hub-1.0.0.dmg         ← Mac installer
  └── win-unpacked/                             ← Portable Windows version
```

---

## ✅ Windows par Install Karna

1. `release/` folder mein jaayein
2. `Physics Simulation Hub Setup 1.0.0.exe` par double-click karein
3. Install karein
4. Desktop par shortcut ban jaayega!

---

## ⚠️ Common Issues

### "electron not found" error:
```bash
npm install --legacy-peer-deps
```

### Build fail ho rahi hai:
```bash
npm run build
# Pehle check karo build sahi ban rahi hai
# Phir:
npm run electron:win
```

### Icon nahi dikh raha:
- `electron/icons/icon.ico` (Windows)
- `electron/icons/icon.icns` (Mac)
- `electron/icons/icon.png` (Linux/fallback)
- Apna custom 256x256 icon yahan rakhein

---

## 📝 Notes

- `npm run dev` — Sirf browser mein test karna ho toh
- `npm run electron:dev` — Desktop app test karna ho toh
- `npm run electron:win` — Final Windows .exe banana ho toh
