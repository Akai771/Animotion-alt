import Routing from './routing/routing'
import { useEffect } from 'react';
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  useEffect(() => {
    // Check localStorage for user preference
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || !theme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark"); // Ensure dark mode is saved
    }
  }, []);
  return (
    <>
      <Router>
        <Routing/>
      </Router>
    </>
  )
}

export default App
