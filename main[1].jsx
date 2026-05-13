// ============================================================
// FILE: src/main.jsx
// PURPOSE: Entry point — mounts our React app into index.html
// You usually don't need to edit this file
// ============================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'        // ← Global styles + Tailwind
import App from './App.jsx' // ← Our entire app lives here

// Mount React into the <div id="root"> in index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
