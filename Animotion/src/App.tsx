import Routing from './routing/routing'
import { useEffect } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { ScrollArea, ScrollBar } from './components/ui/scroll-area';

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
    <ScrollArea className='absolute h-screen w-screen z-30'>
      <Router>
        <Routing/>
      </Router>
      <ScrollBar />
    </ScrollArea>
    </>
  )
}

export default App
