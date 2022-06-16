import React from "react"
import { createRoot } from "react-dom/client"

import favicon from "../static/assets/favicon.png"

import "./main.sass"
import App from './App'

const root = createRoot(document.querySelector("#app"))
root.render(<App/>)