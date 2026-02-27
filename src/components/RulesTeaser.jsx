import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './RulesTeaser.module.css'

const rules = [
    { icon: '⏱', title: 'Max 2 hrs', desc: 'Per booking per day per user' },
    { icon: '📵', title: 'No Show Policy', desc: '3 no-shows result in a 7-day ban' },
    { icon: '🧹', title: 'Leave it Clean', desc: 'Return equipment & clear the ground' },
    { icon: '🔔', title: 'Cancel Early', desc: 'Cancel 2+ hours before or lose your slot' },
]

export default function RulesTeaser() {
    const ref = useScrollReveal()

    return (
        <section className={styles.section} id="rules" ref={ref}>
            <div className={styles.inner}>
                <div className={`${styles.left} reveal`}>
                    <p className={styles.label}>— Community Standards</p>
                    <h2 className={styles.title}>
                        Play fair.<br /><em>Play together.</em>
                    </h2>
                    <p className={styles.text}>
                        Our community guidelines ensure every resident gets a fair chance
                        to enjoy the facilities. Bookings are time-limited, cancellations
                        must be made 2 hours in advance, and grounds must be left clean
                        for the next player.
                    </p>
                    <Link to="/rules" className={styles.cta} id="view-rules-btn">
                        View Full Rules →
                    </Link>
                </div>

                <div className={`${styles.right} reveal`}>
                    <div className={styles.card}>
                        {rules.map(rule => (
                            <div key={rule.title} className={styles.ruleItem}>
                                <span className={styles.ruleIcon}>{rule.icon}</span>
                                <div>
                                    <strong>{rule.title}</strong>
                                    <p>{rule.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
