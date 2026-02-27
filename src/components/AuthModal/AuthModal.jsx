import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './AuthModal.module.css'

/* ─── Login Form ─── */
function LoginForm({ onSwitch }) {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        const email = e.target['modal-email'].value
        setLoading(true)
        setTimeout(() => {
            login({ name: email.split('@')[0], email })
            navigate('/dashboard')
        }, 1200)
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={`${styles.group} ${styles.stagger1}`}>
                <label className={styles.label} htmlFor="modal-email">Email</label>
                <input className={styles.input} type="email" id="modal-email"
                    placeholder="you@community.com" autoComplete="email" required />
            </div>

            <div className={`${styles.group} ${styles.stagger2}`}>
                <label className={styles.label} htmlFor="modal-pass">Password</label>
                <input className={styles.input} type="password" id="modal-pass"
                    placeholder="••••••••" autoComplete="current-password" required />
            </div>

            <div className={`${styles.formRow} ${styles.stagger3}`}>
                <label className={styles.checkbox}>
                    <input type="checkbox" /> Remember me
                </label>
                <a href="#" className={styles.forgot}>Forgot password?</a>
            </div>

            <button
                type="submit"
                className={`${styles.submitBtn} ${styles.stagger4}`}
                id="modal-login-btn"
                disabled={loading}
            >
                {loading ? 'Logging in…' : 'Log In'}
            </button>

            <p className={`${styles.switchText} ${styles.stagger5}`}>
                No account? <button type="button" className={styles.switchLink} onClick={onSwitch}>Register here</button>
            </p>
        </form>
    )
}

/* ─── Register Form ─── */
function RegisterForm({ onSwitch }) {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [passError, setPassError] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        const pass = e.target.password.value
        const confirm = e.target.confirm.value
        if (pass !== confirm) { setPassError(true); return }
        setPassError(false)
        setLoading(true)
        const firstName = e.target.first_name.value
        const lastName = e.target.last_name.value
        const email = e.target.email.value
        setTimeout(() => {
            login({ name: `${firstName} ${lastName}`.trim(), email })
            navigate('/dashboard')
        }, 1400)
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.nameRow}>
                <div className={`${styles.group} ${styles.stagger1}`}>
                    <label className={styles.label} htmlFor="modal-fname">First Name</label>
                    <input className={styles.input} type="text" id="modal-fname"
                        name="first_name" placeholder="Alex" required />
                </div>
                <div className={`${styles.group} ${styles.stagger1}`}>
                    <label className={styles.label} htmlFor="modal-lname">Last Name</label>
                    <input className={styles.input} type="text" id="modal-lname"
                        name="last_name" placeholder="Johnson" required />
                </div>
            </div>

            <div className={`${styles.group} ${styles.stagger2}`}>
                <label className={styles.label} htmlFor="modal-reg-email">Email</label>
                <input className={styles.input} type="email" id="modal-reg-email"
                    name="email" placeholder="you@community.com" required />
            </div>

            <div className={`${styles.group} ${styles.stagger2}`}>
                <label className={styles.label} htmlFor="modal-phone">Phone</label>
                <input className={styles.input} type="tel" id="modal-phone"
                    name="phone" placeholder="+91 98765 43210" />
            </div>

            <div className={`${styles.group} ${styles.stagger3}`}>
                <label className={styles.label} htmlFor="modal-community">Resident ID</label>
                <input className={styles.input} type="text" id="modal-community"
                    name="community_id" placeholder="e.g. RES-2024-00123" />
            </div>

            <div className={styles.nameRow}>
                <div className={`${styles.group} ${styles.stagger4}`}>
                    <label className={styles.label} htmlFor="modal-reg-pass">Password</label>
                    <input className={styles.input} type="password" id="modal-reg-pass"
                        name="password" placeholder="Min. 8 characters" required />
                </div>
                <div className={`${styles.group} ${styles.stagger4}`}>
                    <label className={styles.label} htmlFor="modal-confirm">Confirm</label>
                    <input
                        className={`${styles.input} ${passError ? styles.inputError : ''}`}
                        type="password" id="modal-confirm" name="confirm"
                        placeholder="Re-enter" required
                    />
                </div>
            </div>
            {passError && <p className={styles.errorMsg}>Passwords don't match.</p>}

            <div className={`${styles.formRow} ${styles.stagger4}`}>
                <label className={styles.checkbox}>
                    <input type="checkbox" required /> I agree to the{' '}
                    <a href="/rules" className={styles.forgot}>Rules &amp; Terms</a>
                </label>
            </div>

            <button
                type="submit"
                className={`${styles.submitBtn} ${styles.stagger5}`}
                id="modal-register-btn"
                disabled={loading}
            >
                {loading ? 'Creating Account…' : 'Create Account'}
            </button>

            <p className={`${styles.switchText} ${styles.stagger5}`}>
                Have an account? <button type="button" className={styles.switchLink} onClick={onSwitch}>Log in</button>
            </p>
        </form>
    )
}

/* ─── Main Modal ─── */
export default function AuthModal() {
    const { isOpen, tab, close, switchTab } = useAuth()
    const [animating, setAnimating] = useState(false)
    const overlayRef = useRef(null)

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    // Trigger entry animation on open
    useEffect(() => {
        if (isOpen) {
            setAnimating(true)
            const t = setTimeout(() => setAnimating(false), 700)
            return () => clearTimeout(t)
        }
    }, [isOpen, tab])

    // Close on backdrop click
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) close()
    }

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') close() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [close])

    if (!isOpen) return null

    return (
        <div
            className={styles.overlay}
            ref={overlayRef}
            onClick={handleOverlayClick}
            id="auth-modal-overlay"
        >
            {/* Speed-lines flash element */}
            <div className={styles.speedFlash} />

            <div className={`${styles.modal} ${animating ? styles.kickIn : ''}`}>

                {/* ── Top stripe ── */}
                <div className={styles.topStripe}>
                    <div className={styles.stripeInner}>
                        <span className={styles.brandBadge}>⚽ TURFE</span>
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
                                onClick={() => switchTab('login')}
                                id="modal-tab-login"
                            >
                                Log In
                            </button>
                            <button
                                className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`}
                                onClick={() => switchTab('register')}
                                id="modal-tab-register"
                            >
                                Register
                            </button>
                        </div>
                        <button className={styles.closeBtn} onClick={close} aria-label="Close" id="modal-close-btn">
                            ✕
                        </button>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className={styles.body}>
                    {/* Left decorative panel */}
                    <div className={styles.leftDecor}>
                        <div className={styles.decorGlow} />
                        <div className={styles.decorText}>
                            {tab === 'login' ? (
                                <>
                                    <div className={styles.decorBig}>PLAY</div>
                                    <div className={styles.decorBig}>BOOK</div>
                                    <div className={styles.decorBig}>WIN</div>
                                </>
                            ) : (
                                <>
                                    <div className={styles.decorBig}>JOIN</div>
                                    <div className={styles.decorBig}>THE</div>
                                    <div className={styles.decorBig}>GAME</div>
                                </>
                            )}
                        </div>
                        <p className={styles.decorTagline}>
                            {tab === 'login' ? 'Your community.\nYour ground.' : 'Reserve now.\nPlay tonight.'}
                        </p>
                    </div>

                    {/* Right form panel */}
                    <div className={styles.formPanel}>
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>
                                {tab === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
                            </h2>
                            <p className={styles.formSub}>
                                {tab === 'login'
                                    ? 'Log in to your Turfe account to manage bookings.'
                                    : 'Join Turfe to book sports grounds in your community.'}
                            </p>
                        </div>

                        {tab === 'login'
                            ? <LoginForm onSwitch={() => switchTab('register')} />
                            : <RegisterForm onSwitch={() => switchTab('login')} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
