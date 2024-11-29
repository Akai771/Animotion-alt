import React from "react"
import Routing from "./Components/Router/Routing"
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

function App() {
  inject()
  injectSpeedInsights()
  return (
    <>
      <Routing/>
    </>
  )
}

export default App
