'use client'

import { useEffect } from 'react'

export default function GoogleTagManagerLoader() {
  useEffect(() => {
    let hasLoaded = false

    const loadGTM = () => {
      if (hasLoaded) return
      hasLoaded = true

      const script = document.createElement('script')
      script.async = true
      script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MJSH3MM5'
      document.head.appendChild(script)

      // Also add the noscript iframe (for browsers with JS disabled)
      const noscript = document.createElement('noscript')
      noscript.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MJSH3MM5"
                height="0" width="0"
                style="display:none;visibility:hidden"></iframe>
      `
      document.body.appendChild(noscript)
    }

    const handler = () => {
      loadGTM()
      // Remove all listeners after first trigger
      window.removeEventListener('click', handler)
      window.removeEventListener('scroll', handler)
      window.removeEventListener('keydown', handler)
      window.removeEventListener('touchstart', handler)
    }

    // Listen for various interaction types
    window.addEventListener('click', handler)
    window.addEventListener('scroll', handler)
    window.addEventListener('keydown', handler)
    window.addEventListener('touchstart', handler)

    // Fallback: load after 5 seconds anyway
    const fallbackTimer = setTimeout(loadGTM, 5000)

    return () => {
      window.removeEventListener('click', handler)
      window.removeEventListener('scroll', handler)
      window.removeEventListener('keydown', handler)
      window.removeEventListener('touchstart', handler)
      clearTimeout(fallbackTimer)
    }
  }, [])

  return null
}
