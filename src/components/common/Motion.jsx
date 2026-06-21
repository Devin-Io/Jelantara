import { useEffect, useMemo, useRef, useState } from 'react'

export function useInView({ threshold = 0.15, rootMargin = '0px 0px -8% 0px', once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.unobserve(entry.target)
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once, rootMargin, threshold])

  return [ref, inView]
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 26,
  as: Tag = 'div',
  once = true,
}) {
  const [ref, inView] = useInView({ once })
  const transform = useMemo(() => {
    if (direction === 'left') return `translate3d(-${distance}px, 0, 0)`
    if (direction === 'right') return `translate3d(${distance}px, 0, 0)`
    if (direction === 'down') return `translate3d(0, -${distance}px, 0)`
    if (direction === 'scale') return 'scale(.96)'
    return `translate3d(0, ${distance}px, 0)`
  }, [direction, distance])

  return (
    <Tag
      ref={ref}
      className={`motion-reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{
        '--motion-delay': `${delay}ms`,
        '--motion-transform': transform,
      }}
    >
      {children}
    </Tag>
  )
}

export function CountUp({ end = 0, duration = 1400, decimals = 0, prefix = '', suffix = '', className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.45 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return undefined
    let frame
    const start = performance.now()
    const tick = (now) => {
      const elapsed = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - elapsed, 3)
      setValue(end * eased)
      if (elapsed < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [duration, end, inView])

  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)

  return <span ref={ref} className={className}>{prefix}{formatted}{suffix}</span>
}

export function AnimatedRange({ start, end, suffix = '', duration = 1400, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.45 })
  const [values, setValues] = useState([0, 0])

  useEffect(() => {
    if (!inView) return undefined
    let frame
    const started = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValues([Math.round(start * eased), Math.round(end * eased)])
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [duration, end, inView, start])

  return <span ref={ref} className={className}>{values[0].toLocaleString('id-ID')}–{values[1].toLocaleString('id-ID')}{suffix}</span>
}
