'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Videos de fondo para el hero.
 *
 * Descarga los 4 vídeos de Pexels (licencia gratuita) y colócalos en public/videos/:
 *   - https://www.pexels.com/es-es/video/montanas-naturaleza-cielo-nubes-8233032/   → public/videos/hero-mountains.mp4
 *   - https://www.pexels.com/es-es/video/35289457/                                  → public/videos/hero-lake-cabin.mp4
 *   - https://www.pexels.com/es-es/video/cielo-edificio-jardin-arboles-8440738/     → public/videos/hero-villa-garden.mp4
 *   - https://www.pexels.com/es-es/video/casa-mesa-ventanas-apartamento-7578554/    → public/videos/hero-apartment.mp4
 *
 * Recomendación: exporta en HD 1080p / H.264 para compatibilidad máxima.
 * Mientras no tengas los archivos, el poster (imagen de fallback) se mostrará.
 */
const HERO_VIDEOS = [
  {
    src: '/videos/hero-mountains.mp4',
    poster: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=70',
    label: 'Paisaje de montañas naturales',
  },
  {
    src: '/videos/hero-lake-cabin.mp4',
    poster: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=70',
    label: 'Cabaña junto al lago en el bosque',
  },
  {
    src: '/videos/hero-villa-garden.mp4',
    poster: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=70',
    label: 'Villa con jardín y vistas al cielo',
  },
  {
    src: '/videos/hero-apartment.mp4',
    poster: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=70',
    label: 'Apartamento de lujo con luz natural',
  },
]

const TRANSITION_DURATION = 1000 // ms — debe coincidir con la clase CSS duration-1000

export default function HeroVideoSlider() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const videoRefs = useRef([])
  const transitionTimerRef = useRef(null)
  const prefersReducedMotionRef = useRef(false)

  // Inicializar: detectar preferencia de movimiento reducido y arrancar el primer vídeo
  useEffect(() => {
    prefersReducedMotionRef.current =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!prefersReducedMotionRef.current) {
      videoRefs.current[0]?.play().catch(() => {
        // Autoplay bloqueado por el navegador — el poster se muestra como fallback
      })
    }
  }, [])

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => clearTimeout(transitionTimerRef.current)
  }, [])

  /**
   * Navega a un vídeo específico por índice.
   * Se usa tanto para la transición automática (ended) como para los dots manuales.
   */
  const goToVideo = useCallback(
    (nextIdx) => {
      if (nextIdx === currentIdx) return

      clearTimeout(transitionTimerRef.current)
      const outgoing = currentIdx

      setCurrentIdx(nextIdx)

      // Arrancar el vídeo entrante desde el principio
      const nextVideo = videoRefs.current[nextIdx]
      if (nextVideo) {
        nextVideo.currentTime = 0
        nextVideo.play().catch(() => {})
      }

      // Tras la transición CSS (1s), pausar y rebobinar el vídeo saliente
      transitionTimerRef.current = setTimeout(() => {
        const outgoingVideo = videoRefs.current[outgoing]
        if (outgoingVideo) {
          outgoingVideo.pause()
          outgoingVideo.currentTime = 0
        }
      }, TRANSITION_DURATION)
    },
    [currentIdx]
  )

  // Avanzar automáticamente al siguiente vídeo cuando el actual termina
  const advanceVideo = useCallback(() => {
    goToVideo((currentIdx + 1) % HERO_VIDEOS.length)
  }, [currentIdx, goToVideo])

  // Registrar el listener 'ended' en el vídeo activo
  useEffect(() => {
    if (prefersReducedMotionRef.current) return

    const video = videoRefs.current[currentIdx]
    if (!video) return

    video.addEventListener('ended', advanceVideo)
    return () => video.removeEventListener('ended', advanceVideo)
  }, [currentIdx, advanceVideo])

  return (
    <div className="absolute inset-0" aria-hidden="true">

      {/* ── Capas de vídeo ───────────────────────────────────── */}
      {HERO_VIDEOS.map((video, idx) => (
        <video
          key={video.src}
          ref={el => { videoRefs.current[idx] = el }}
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-opacity duration-1000 ease-in-out
            ${idx === currentIdx ? 'opacity-100' : 'opacity-0'}
          `}
          src={video.src}
          poster={video.poster}
          muted
          playsInline
          // Precargar sólo el primero por defecto; el resto bajo demanda
          preload={idx === 0 ? 'auto' : 'metadata'}
          aria-label={video.label}
        />
      ))}

      {/* ── Filtro de superposición ───────────────────────────
            Garantiza contraste mínimo WCAG AA (4.5:1) entre el texto
            blanco y cualquier fondo de vídeo claro u oscuro.          */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,62,60,0.62) 0%, rgba(0,62,60,0.38) 45%, rgba(0,62,60,0.78) 100%)',
        }}
      />

      {/* ── Indicador de progreso (dots) ─────────────────────── */}
      <div
        className="absolute bottom-8 right-6 z-10 flex items-center gap-2"
        role="tablist"
        aria-label="Vídeos del hero"
      >
        {HERO_VIDEOS.map((v, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={idx === currentIdx}
            aria-label={`Reproducir: ${v.label}`}
            onClick={() => goToVideo(idx)}
            className={`
              h-1.5 rounded-full transition-all duration-300 ease-in-out
              ${idx === currentIdx
                ? 'w-6 bg-white'
                : 'w-1.5 bg-white/40 hover:bg-white/70'}
            `}
          />
        ))}
      </div>
    </div>
  )
}
