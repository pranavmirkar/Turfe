import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './HeroSection.module.css'

export default function HeroSection() {
    const { openRegister } = useAuth()

    // ── Cursor glow ──────────────────────────────────────────
    useEffect(() => {
        const glow = document.createElement('div')
        glow.style.cssText = `
            pointer-events:none; position:fixed;
            width:300px; height:300px; border-radius:50%;
            background:radial-gradient(circle,rgba(181,240,0,0.06) 0%,transparent 70%);
            transform:translate(-50%,-50%); z-index:9999; top:0; left:0;
            transition:opacity 0.3s;
        `
        document.body.appendChild(glow)
        let gx = 0, gy = 0, tx = 0, ty = 0
        const onMove = (e) => { tx = e.clientX; ty = e.clientY }
        const animate = () => {
            gx += (tx - gx) * 0.1
            gy += (ty - gy) * 0.1
            glow.style.left = `${gx}px`
            glow.style.top = `${gy}px`
            requestAnimationFrame(animate)
        }
        document.addEventListener('mousemove', onMove)
        const raf = requestAnimationFrame(animate)
        return () => {
            document.removeEventListener('mousemove', onMove)
            cancelAnimationFrame(raf)
            document.body.removeChild(glow)
        }
    }, [])

    return (
        <section className={styles.hero} id="hero">

            {/* ── Grain overlay ── */}
            <div className={styles.grain} />

            {/* ── Dark vignette ── */}
            <div className={styles.vignette} />

            {/* ── Hero Content ── */}
            <div className={styles.content}>
                <p className={styles.eyebrow}>Community Sports Platform</p>

                <h1 className={styles.title}>
                    <span className={styles.line1}>BOOK</span>
                    <span className={styles.line2}><em>Your</em></span>
                    <span className={styles.line3}>GROUND</span>
                </h1>

                <div className={styles.sportsList}>
                    {['Football', 'Basketball', 'Cricket', 'Tennis', 'Badminton'].map((s, i, arr) => (
                        <span key={s}>
                            <span className={styles.sportItem}>{s}</span>
                            {i < arr.length - 1 && <span className={styles.sportSep}>·</span>}
                        </span>
                    ))}
                </div>

                <p className={styles.sub}>
                    Reserve community sports facilities — no conflicts, no hassle.
                </p>

                <div className={styles.ctaGroup}>
                    <button onClick={openRegister} className={styles.ctaPrimary} id="cta-register">
                        Book a Ground
                    </button>
                    <a href="#how-it-works" className={styles.ctaGhost}>
                        How it works ↓
                    </a>
                </div>
            </div>

            {/* ── Scroll indicator ── */}
            <div className={styles.scrollIndicator}>
                <div className={styles.scrollLine} />
                <span>Scroll</span>
            </div>
        </section>
    )
}
