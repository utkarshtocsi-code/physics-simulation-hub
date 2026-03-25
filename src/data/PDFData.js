// src/data/PDFData.js
// Local (offline) PDF modules — app ke andar built-in

export const pdfModules = [

  // ── MECHANICS ────────────────────────────────────────────────────────────
  {
    id: 'pdf-mech-01',
    branch: 'mechanics',
    title: 'Kinematics — Complete Notes',
    description: 'Distance, displacement, velocity, acceleration — saare formulas',
    filename: 'mechanics/kinematics-notes.pdf',
    type: 'notes',       // notes | formula-sheet | question-bank | solution
    pages: 12,
    tags: ['kinematics', 'motion', 'formulas'],
  },
  {
    id: 'pdf-mech-02',
    branch: 'mechanics',
    title: 'Newton\'s Laws — Question Bank',
    description: '50 practice questions with difficulty levels',
    filename: 'mechanics/newtons-laws-qbank.pdf',
    type: 'question-bank',
    pages: 18,
    tags: ['newton', 'forces', 'practice'],
  },
  {
    id: 'pdf-mech-03',
    branch: 'mechanics',
    title: 'Mechanics Formula Sheet',
    description: 'Ek page mein saari mechanics formulas',
    filename: 'mechanics/mechanics-formula-sheet.pdf',
    type: 'formula-sheet',
    pages: 1,
    tags: ['formulas', 'quick reference'],
  },

  // ── THERMODYNAMICS ───────────────────────────────────────────────────────
  {
    id: 'pdf-thermo-01',
    branch: 'thermodynamics',
    title: 'Thermodynamics Notes',
    description: 'Laws of thermodynamics, PV diagrams, cycles',
    filename: 'thermodynamics/thermo-notes.pdf',
    type: 'notes',
    pages: 20,
    tags: ['PV diagram', 'laws', 'cycles'],
  },
  {
    id: 'pdf-thermo-02',
    branch: 'thermodynamics',
    title: 'Gas Laws Formula Sheet',
    description: 'Boyle, Charles, Gay-Lussac, Ideal Gas Law',
    filename: 'thermodynamics/gas-laws-formula.pdf',
    type: 'formula-sheet',
    pages: 1,
    tags: ['gas laws', 'formulas'],
  },

  // ── WAVES & OPTICS ───────────────────────────────────────────────────────
  {
    id: 'pdf-wave-01',
    branch: 'waves-optics',
    title: 'Wave Optics Notes',
    description: 'Interference, diffraction, polarization — detailed notes',
    filename: 'waves-optics/wave-optics-notes.pdf',
    type: 'notes',
    pages: 16,
    tags: ['interference', 'diffraction'],
  },
  {
    id: 'pdf-wave-02',
    branch: 'waves-optics',
    title: 'Ray Optics Question Bank',
    description: 'Lens, mirror, prism — 40 solved problems',
    filename: 'waves-optics/ray-optics-qbank.pdf',
    type: 'question-bank',
    pages: 22,
    tags: ['lenses', 'mirrors', 'practice'],
  },

  // ── ELECTRICITY & MAGNETISM ──────────────────────────────────────────────
  {
    id: 'pdf-em-01',
    branch: 'electricity-magnetism',
    title: 'Electrostatics Notes',
    description: 'Coulomb law, electric field, potential — complete chapter',
    filename: 'electricity-magnetism/electrostatics-notes.pdf',
    type: 'notes',
    pages: 24,
    tags: ['electrostatics', 'coulomb'],
  },
  {
    id: 'pdf-em-02',
    branch: 'electricity-magnetism',
    title: 'Circuit Formulas Cheatsheet',
    description: 'Ohm, Kirchhoff, RC, RL — quick reference',
    filename: 'electricity-magnetism/circuit-formulas.pdf',
    type: 'formula-sheet',
    pages: 2,
    tags: ['circuits', 'formulas'],
  },

  // ── MODERN PHYSICS ───────────────────────────────────────────────────────
  {
    id: 'pdf-modern-01',
    branch: 'modern-physics',
    title: 'Quantum Physics Notes',
    description: 'Photoelectric, de Broglie, Bohr model — JEE level',
    filename: 'modern-physics/quantum-notes.pdf',
    type: 'notes',
    pages: 18,
    tags: ['quantum', 'photon', 'JEE'],
  },
  {
    id: 'pdf-modern-02',
    branch: 'modern-physics',
    title: 'Nuclear Physics Formula Sheet',
    description: 'Decay, half-life, binding energy formulas',
    filename: 'modern-physics/nuclear-formulas.pdf',
    type: 'formula-sheet',
    pages: 1,
    tags: ['nuclear', 'radioactivity'],
  },
]

// ── Types for filtering ───────────────────────────────────────────────────────
export const pdfTypes = [
  { id: 'notes',          label: 'Notes',          icon: '📖', color: '#3b82f6' },
  { id: 'formula-sheet',  label: 'Formula Sheet',  icon: '📐', color: '#f59e0b' },
  { id: 'question-bank',  label: 'Question Bank',  icon: '❓', color: '#10b981' },
  { id: 'solution',       label: 'Solutions',      icon: '✅', color: '#8b5cf6' },
]

export const getPDFsByBranch = (branchId) =>
  pdfModules.filter(p => p.branch === branchId)

export const getPDFTypeInfo = (typeId) =>
  pdfTypes.find(t => t.id === typeId)

export default pdfModules
