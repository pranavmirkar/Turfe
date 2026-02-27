import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Footer.module.css'

export default function Footer() {
    const { openLogin, openRegister } = useAuth()
    return (
        <footer className={styles.footer} id="contact">
            <div className={styles.inner}>
                <div className={styles.brand}>
                    <Link to="/" className={styles.logo}>
                        <span className={styles.logoSans}>Turfe</span>
                    </Link>
                    <p>Empowering communities through sport.</p>
                </div>

                <nav className={styles.links}>
                    <a href="#how-it-works">How It Works</a>
                    <a href="#sports">Sports</a>
                    <a href="#rules">Rules</a>
                    <button onClick={openLogin}>Login</button>
                    <button onClick={openRegister}>Register</button>
                </nav>

                <p className={styles.copy}>© 2026 Turfe. All rights reserved.</p>
            </div>
        </footer>
    )
}
