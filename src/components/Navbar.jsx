import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const { openLogin, openRegister, user, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.navLeft}>
                <Link to="/rules" className={styles.navLink}>Rules & Guidelines</Link>
                {user && <Link to="/history" className={styles.navLink}>My Bookings</Link>}
            </div>

            <Link to="/" className={styles.navLogo}>
                <span className={styles.logoSans}>Turfe</span>
            </Link>

            <div className={styles.navRight}>
                {user ? (
                    <>
                        <Link to="/book" className={styles.btnSolid} id="book-now-nav-btn">
                            + Book Ground
                        </Link>
                        <div className={styles.userMenu}>
                            <div className={styles.avatar} id="user-avatar">{user.avatar}</div>
                            <div className={styles.dropdown}>
                                <span className={styles.dropdownName}>{user.name}</span>
                                <Link to="/dashboard" className={styles.dropdownItem}>Dashboard</Link>
                                <Link to="/history" className={styles.dropdownItem}>Booking History</Link>
                                <button className={styles.dropdownItem} onClick={handleLogout} id="logout-btn">
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <button className={styles.btnOutline} onClick={openLogin} id="login-btn">
                            Log In
                        </button>
                        <button className={styles.btnSolid} onClick={openRegister} id="register-btn">
                            Register
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}
