import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import Brand from './Brand'
import { navLinks } from '../../data/content'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#beranda')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = navLinks
      .map(([, href]) => document.querySelector(href))
      .filter(Boolean)

    if (!sections.length || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(`#${visible.target.id}`)
    }, { rootMargin: '-22% 0px -64% 0px', threshold: [0.02, 0.15, 0.4] })

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-500 ${scrolled ? 'border-border/90 bg-white/92 py-2 shadow-[0_10px_35px_rgba(23,53,46,.07)] backdrop-blur-xl' : 'border-transparent bg-soft/70 py-3 backdrop-blur-md'}`}>
      <div className="container-page flex items-center justify-between">
        <Brand compact={scrolled} />
        <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-white/75 p-1 shadow-sm backdrop-blur lg:flex" aria-label="Navigasi utama">
          {navLinks.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${active === href ? 'bg-brand-100 text-brand-700' : 'text-muted hover:bg-soft hover:text-brand-700'}`}
            >
              {label}
              {active === href && <span className="absolute inset-x-5 -bottom-[5px] h-0.5 rounded-full bg-brand-500" />}
            </a>
          ))}
        </nav>
        <div className="hidden lg:block">
          <Link to="/login" className="btn-primary !rounded-full !px-5 !py-2.5">Masuk</Link>
        </div>
        <button className="rounded-xl border border-border bg-white p-2.5 text-ink shadow-sm lg:hidden" aria-label={open ? 'Tutup menu' : 'Buka menu'} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div className={`grid transition-[grid-template-rows] duration-300 lg:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <nav className="container-page mt-3 grid gap-1 border-t border-border py-3" aria-label="Navigasi mobile">
            {navLinks.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)} className={`rounded-xl px-3 py-3 text-sm font-semibold ${active === href ? 'bg-brand-100 text-brand-700' : 'text-muted hover:bg-brand-50 hover:text-brand-700'}`}>{label}</a>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="btn-primary mt-2">Masuk ke Prototype</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
