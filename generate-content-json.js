#!/usr/bin/env node
// Run: node generate-content-json.js
// Yeh automatically content.json generate karega current SimulationData se

import { readFileSync, writeFileSync } from 'fs'
import { branches, simulations } from './src/data/SimulationData.js'
import pdfModules from './src/data/PDFData.js'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))

const content = {
  version:     pkg.version,
  lastUpdated: new Date().toISOString().split('T')[0],
  announcement: '',
  simulations: [],   // Online-only extra sims (local ones are bundled)
  pdfs:        [],   // Online-only extra PDFs
  branches:    [],   // Extra branches
}

writeFileSync('./public/content.json', JSON.stringify(content, null, 2))
console.log(`✅ content.json generated for v${pkg.version}`)
console.log('   Ise physics-sim-content repo mein push karein')
