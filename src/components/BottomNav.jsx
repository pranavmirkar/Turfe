import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './BottomNav.module.css'

// Links shown when user is NOT logged in (landing page scroll links)
const GUEST_LINKS = [
    { label: 'Home', href: '#hero' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Sports', href: '#sports' },
    { label: 'Rules', href: '#rules' },
]

// Links shown when user IS logged in (app routes)
const AUTH_LINKS = [
    { label: '🏠 Home', to: '/dashboard' },
    { label: '📅 Book', to: '/book' },
    { label: '🕐 History', to: '/history' },
    { label: '📋 Rules', to: '/rules' },
]

export default function BottomNav() {
    const [active, setActive] = useState('#hero')
    const { openLogin, user } = useAuth()
    const location = useLocation()

    // Intersection observer for landing-page anchor links (guest only)
    useEffect(() => {
        if (user) return
        const sections = document.querySelectorAll('section[id], footer[id]')
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActive(`#${entry.target.id}`)
                })
            },
            { threshold: 0.4 }
        )
        sections.forEach(s => observer.observe(s))
        return () => observer.disconnect()
    }, [user])

    return (
        <nav className={styles.bottomNav}>
            {user ? (
                /* ── Logged-in nav ── */
                AUTH_LINKS.map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`${styles.link} ${location.pathname === link.to ? styles.active : ''}`}
                        id={`bottom-nav-${link.to.replace('/', '')}`}
                    >
                        {link.label}
                    </Link>
                ))
            ) : (
                /* ── Guest nav ── */
                <>
                    {GUEST_LINKS.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`${styles.link} ${active === link.href ? styles.active : ''}`}
                        >
                            {link.label}
                        </a>
                    ))}
                    <button className={styles.link} onClick={openLogin}>
                        My Bookings
                    </button>
                </>
            )}
        </nav>
    )
}
