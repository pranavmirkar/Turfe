import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './HowItWorks.module.css'

const steps = [
    { num: '01', icon: '🔐', name: 'Create Account', desc: 'Register with your community ID. Login securely to access all booking features.' },
    { num: '02', icon: '📅', name: 'Check Availability', desc: 'Browse the live calendar. See which grounds are free across all time slots.' },
    { num: '03', icon: '⚽', name: 'Pick Sport & Slot', desc: 'Choose your sport, select the ground, and pick your preferred time slot.' },
    { num: '04', icon: '✅', name: 'Get Confirmed', desc: 'Submit your booking request and receive instant confirmation on screen.' },
]

export default function HowItWorks() {
    const ref = useScrollReveal()

    return (
        <section className={styles.section} id="how-it-works" ref={ref}>
            <p className={`${styles.label} reveal`}>— The Process</p>
            <h2 className={`${styles.title} reveal`}>
                Four steps to<br /><em>your perfect match</em>
            </h2>

            <div className={styles.grid}>
                {steps.map(step => (
                    <div key={step.num} className={`${styles.card} reveal`} data-step={step.num}>
                        <div className={styles.stepNum}>{step.num}</div>
                        <div className={styles.icon}>{step.icon}</div>
                        <h3 className={styles.stepName}>{step.name}</h3>
                        <p className={styles.stepDesc}>{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
