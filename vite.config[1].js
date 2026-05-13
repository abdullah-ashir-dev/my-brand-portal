// ============================================================
// FILE: vite.config.js  (project ROOT)
// PURPOSE: Configuration for Vite (our build tool / dev server)
// ============================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
