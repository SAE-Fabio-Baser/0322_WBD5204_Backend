import React from 'react'
import { createRoot } from 'react-dom/client'

import './main.sass'
import App from './App'

const root = createRoot(document.querySelector('#app') as Element)
root.render(<App />)
