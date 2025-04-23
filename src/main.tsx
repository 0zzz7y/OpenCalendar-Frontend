import { StrictMode } from "react"

import ReactDOM from "react-dom/client"

import Application from "@/Application"

const root = document.getElementById("root")!

ReactDOM.createRoot(root).render(
  <>
    <StrictMode>
      <Application />
    </StrictMode>
  </>
)
