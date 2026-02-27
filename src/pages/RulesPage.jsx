import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import styles from './RulesPage.module.css'

const RULES_DATA = [
    {
        id: 'booking',
        icon: '📋',
        title: 'Booking Policy',
        color: '#b5f000',
        rules: [
            'Bookings must be made at least 2 hours before the desired slot.',
            'Each resident may hold a maximum of 2 active bookings at any time.',
            'Slots are reserved for 15 minutes after booking; payment (if applicable) must be completed within that window.',
            'Bookings are non-transferable and linked to the registered resident ID.',
            'A valid resident ID is required to complete any booking.',
        ],
    },
    {
        id: 'cancellation',
        icon: '🚫',
        title: 'Cancellation & Rescheduling',
        color: '#ff4f6d',
        rules: [
            'Cancellations made 24+ hours before the slot are fully refundable (where applicable).',
            'Cancellations within 2–24 hours of the slot forfeit 50% of the booking fee.',
            'No-shows and cancellations within 2 hours are non-refundable.',
            'Rescheduling is allowed up to 4 hours before the original slot, once per booking.',
            'Repeated no-shows (3+) may result in a temporary booking suspension.',
        ],
    },
    {
        id: 'conduct',
        icon: '🤝',
        title: 'Code of Conduct',
        color: '#00c4ff',
        rules: [
            'Treat all players, staff, and facilities with respect.',
            'Abusive language, aggressive behaviour, or intimidation will result in immediate removal and a ban.',
            'Maintain fair play; disputes should be resolved calmly or escalated to facility management.',
            'Players must be ready to vacate the ground when their slot ends, even if a game is in progress.',
            'Children under 12 must be supervised by an adult at all times.',
        ],
    },
    {
        id: 'facilities',
        icon: '🏟️',
        title: 'Facility Use',
        color: '#ff8c00',
        rules: [
            'Appropriate sports footwear is mandatory on all courts and grounds (no street shoes).',
            'Food and drinks (except water) are not permitted on the playing surfaces.',
            'Equipment borrowed from the facility must be returned in good condition within the same session.',
            'Damage to equipment or facilities will be charged to the booking resident.',
            'Littering is strictly prohibited; use the waste bins provided.',
        ],
    },
    {
        id: 'safety',
        icon: '⛑️',
        title: 'Safety & Emergencies',
        color: '#a855f7',
        rules: [
            'First-aid kits are located at the main entrance of each ground.',
            'In case of a medical emergency, call 112 immediately and notify facility staff.',
            'Report any unsafe conditions (broken equipment, wet floors) to staff before playing.',
            'CCTV monitoring is active across all grounds for your safety.',
            'The facility reserves the right to stop play and clear grounds in unsafe weather conditions.',
        ],
    },
    {
        id: 'guests',
        icon: '👥',
        title: 'Guests & Visitors',
        color: '#00c4ff',
        rules: [
            'Each booking permits up to 2 non-resident guests per session.',
            'Guests must be accompanied by the booking resident at all times.',
            'The resident is fully responsible for the conduct of their guests.',
            'Guest passes must be obtained at the reception before entering the playing area.',
            'Guests under 18 require written parental consent for participation.',
        ],
    },
]

export default function RulesPage() {
    const [activeId, setActiveId] = useState(null)

    const toggle = (id) => setActiveId(prev => prev === id ? null : id)

    return (
        <>
            <Navbar />
            <div className={styles.page}>
                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <div className={styles.badge}>📋 Community Sports Facility</div>
                        <h1 className={styles.heroTitle}>Rules &amp; Guidelines</h1>
                        <p className={styles.heroSub}>
                            To ensure a safe, fair, and enjoyable experience for all community members,
                            please read and follow these guidelines carefully before booking or using our facilities.
                        </p>
                        <Link to="/book" className={styles.heroCta} id="rules-book-btn">
                            Book a Ground →
                        </Link>
                    </div>
                    <div className={styles.heroDecor}>📜</div>
                </section>

                {/* Quick nav pills */}
                <nav className={styles.quickNav}>
                    {RULES_DATA.map(r => (
                        <a key={r.id} href={`#rule-${r.id}`} className={styles.navPill}
                            style={{ '--rc': r.color }}>
                            {r.icon} {r.title}
                        </a>
                    ))}
                </nav>

                {/* Accordion sections */}
                <div className={styles.sections}>
                    {RULES_DATA.map((section) => {
                        const isOpen = activeId === section.id
                        return (
                            <div
                                key={section.id}
                                id={`rule-${section.id}`}
                                className={`${styles.section} ${isOpen ? styles.sectionOpen : ''}`}
                                style={{ '--rc': section.color }}
                            >
                                <button
                                    className={styles.sectionHeader}
                                    onClick={() => toggle(section.id)}
                                    id={`rule-toggle-${section.id}`}
                                    aria-expanded={isOpen}
                                >
                                    <div className={styles.sectionLeft}>
                                        <span className={styles.sectionIconWrap}>{section.icon}</span>
                                        <span className={styles.sectionTitle}>{section.title}</span>
                                    </div>
                                    <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
                                        ›
                                    </span>
                                </button>

                                {isOpen && (
                                    <ul className={styles.ruleList}>
                                        {section.rules.map((rule, i) => (
                                            <li key={i} className={styles.ruleItem}>
                                                <span className={styles.ruleNum}>{String(i + 1).padStart(2, '0')}</span>
                                                <span className={styles.ruleText}>{rule}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Footer note */}
                <div className={styles.note}>
                    <span className={styles.noteIcon}>ℹ️</span>
                    <p>
                        These rules are subject to change. The facility management
                        reserves the right to update guidelines at any time.
                        Last updated: <strong>February 2026</strong>.
                        Questions? Contact us at{' '}
                        <a href="mailto:support@turfe.community" className={styles.email}>
                            support@turfe.community
                        </a>
                    </p>
                </div>
            </div>
            <BottomNav />
        </>
    )
}
