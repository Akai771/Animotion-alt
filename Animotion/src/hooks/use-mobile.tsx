import * as React from "react"

// Configure this breakpoint based on your design needs
// Set to 1025px so devices with 1024px width (tablets) show mobile view
const MOBILE_BREAKPOINT = 1025

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Function to set the mobile state based on current window width
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Check on first render
    checkIsMobile()

    // Use matchMedia for better performance when possible
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Modern browsers
    if (mql.addEventListener) {
      mql.addEventListener("change", checkIsMobile)
      return () => mql.removeEventListener("change", checkIsMobile)
    } 
    // Fallback for older browsers
    else if (mql.addListener) {
      mql.addListener(checkIsMobile)
      return () => mql.removeListener(checkIsMobile)
    } 
    // Last resort - use window resize
    else {
      window.addEventListener("resize", checkIsMobile)
      return () => window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  // Use double negation to coerce undefined to false during initial render
  return !!isMobile
}

// Additional hook for detecting touch devices
export function useTouchDevice() {
  const [isTouch, setIsTouch] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Various ways to detect touch devices
    const isTouchDevice = () => {
      return (
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        // @ts-ignore - navigator.msMaxTouchPoints is for IE
        (navigator.msMaxTouchPoints > 0)
      )
    }
    
    setIsTouch(isTouchDevice())
  }, [])

  return isTouch
}

// Combined hook for more precise mobile detection
export function useIsMobileDevice() {
  const isMobileWidth = useIsMobile()
  const isTouch = useTouchDevice()
  
  return {
    isMobile: isMobileWidth,
    isTouch,
    isMobileOrTouch: isMobileWidth || isTouch
  }
}