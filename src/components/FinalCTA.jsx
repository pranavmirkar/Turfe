import { useAuth } from '../context/AuthContext'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './FinalCTA.module.css'

export default function FinalCTA() {
    const ref = useScrollReveal()
    const { openLogin, openRegister } = useAuth()

    return (
        <section className={styles.section} ref={ref}>
            <div className={styles.glow} />
            <p className={`${styles.eyebrow} reveal`}>Ready to Play?</p>
            <h2 className={`${styles.title} reveal`}>
                YOUR GROUND<br /><em>Awaits.</em>
            </h2>
            <div className={`${styles.btns} reveal`}>
                <button onClick={openRegister} className={styles.primary} id="final-register-btn">
                    Create Free Account
                </button>
                <button onClick={openLogin} className={styles.ghost} id="final-login-btn">
                    Already a member? Log In
                </button>
            </div>
        </section>
    )
}
