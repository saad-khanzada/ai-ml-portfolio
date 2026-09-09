'use client'

import Link from 'next/link'
import {useRef} from 'react'
import {navigationItems} from '@/lib/navigation'

type NavbarProps = {
  name: string
  resumeUrl?: string | null
}

export function Navbar({name, resumeUrl}: NavbarProps) {
  const menuRef = useRef<HTMLDetailsElement>(null)

  function closeMenu() {
    if (menuRef.current) menuRef.current.open = false
  }

  function renderLinks() {
    return navigationItems.map((item) => (
      <li key={item.href}>
        {item.available ? (
          <Link href={item.href} onClick={closeMenu}>
            {item.label}
          </Link>
        ) : (
          <span aria-disabled="true" className="site-nav-unavailable">
            {item.label}
          </span>
        )}
      </li>
    ))
  }

  return (
    <header className="site-header">
      <div className="site-container site-header-inner">
        <Link href="/" className="site-brand" onClick={closeMenu}>
          {name}
        </Link>

        <nav className="site-desktop-nav" aria-label="Main navigation">
          <ul>{renderLinks()}</ul>
        </nav>

        <div className="site-header-actions">
          {resumeUrl && (
            <a
              href={resumeUrl}
              className="site-button site-button-secondary"
            >
              Resume
            </a>
          )}

          <details
            ref={menuRef}
            className="site-mobile-menu"
            onKeyDown={(event) => {
              if (event.key === 'Escape' && menuRef.current?.open) {
                event.preventDefault()
                closeMenu()
                menuRef.current.querySelector('summary')?.focus()
              }
            }}
          >
            <summary>Menu</summary>
            <nav aria-label="Mobile navigation">
              <ul>{renderLinks()}</ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
