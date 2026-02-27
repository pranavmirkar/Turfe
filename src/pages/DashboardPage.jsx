import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell/AppShell'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import styles from './DashboardPage.module.css'

const QUICK_SPORTS = [
    { id: 'football', icon: '⚽', label: 'Football', color: '#b5f000' },
    { id: 'basketball', icon: '🏀', label: 'Basketball', color: '#ff8c00' },
    { id: 'cricket', icon: '🏏', label: 'Cricket', color: '#00c4ff' },
    { id: 'tennis', icon: '🎾', label: 'Tennis', color: '#ff4f6d' },
    { id: 'badminton', icon: '🏸', label: 'Badminton', color: '#a855f7' },
]

export default function DashboardPage() {
    const { user } = useAuth()
    const { bookings } = useBooking()

    const upcoming = bookings.filter(b => b.status === 'upcoming').slice(0, 3)
    const totalBookings = bookings.length
    const completedCount = bookings.filter(b => b.status === 'completed').length

    const greeting = () => {
        const h = new Date().getHours()
        if (h < 12) return 'Good Morning'
        if (h < 17) return 'Good Afternoon'
        return 'Good Evening'
    }

    return (
        <AppShell>
            <div className={styles.page}>
                {/* Hero greeting */}
                <section className={styles.hero}>
                    <div className={styles.heroInner}>
                        <p className={styles.greeting}>{greeting()},</p>
                        <h1 className={styles.name}>{user?.name} <span className={styles.wave}>👋</span></h1>
                        <p className={styles.sub}>Ready to hit the ground? Book your slot in seconds.</p>
                        <Link to="/book" className={styles.bookBtn} id="dashboard-book-btn">
                            + Book a Ground
                        </Link>
                    </div>
                    <div className={styles.heroDecor}>
                        <div className={styles.bigIcon}>🏟️</div>
                    </div>
                </section>

                {/* Stats row */}
                <section className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <span className={styles.statNum}>{totalBookings}</span>
                        <span className={styles.statLabel}>Total Bookings</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNum}>{completedCount}</span>
                        <span className={styles.statLabel}>Completed</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNum}>{upcoming.length}</span>
                        <span className={styles.statLabel}>Upcoming</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNum}>5</span>
                        <span className={styles.statLabel}>Sports Available</span>
                    </div>
                </section>

                <div className={styles.columns}>
                    {/* Quick Book */}
                    <section className={styles.card}>
                        <h2 className={styles.cardTitle}>Quick Book</h2>
                        <p className={styles.cardSub}>Pick a sport to start booking</p>
                        <div className={styles.sportsGrid}>
                            {QUICK_SPORTS.map(s => (
                                <Link
                                    key={s.id}
                                    to={`/book?sport=${s.id}`}
                                    className={styles.sportTile}
                                    style={{ '--sport-color': s.color }}
                                    id={`quick-book-${s.id}`}
                                >
                                    <span className={styles.sportIcon}>{s.icon}</span>
                                    <span className={styles.sportName}>{s.label}</span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Upcoming bookings */}
                    <section className={styles.card}>
                        <div className={styles.cardTitleRow}>
                            <h2 className={styles.cardTitle}>Upcoming</h2>
                            <Link to="/history" className={styles.viewAll}>View all →</Link>
                        </div>
                        {upcoming.length === 0 ? (
                            <div className={styles.empty}>
                                <span>📅</span>
                                <p>No upcoming bookings</p>
                                <Link to="/book" className={styles.emptyLink}>Book now</Link>
                            </div>
                        ) : (
                            <ul className={styles.upcomingList}>
                                {upcoming.map(b => (
                                    <li key={b.id} className={styles.upcomingItem}>
                                        <div className={styles.upcomingLeft}>
                                            <span className={styles.upcomingId}>{b.id}</span>
                                            <span className={styles.upcomingSport}>{b.sport} · {b.ground}</span>
                                            <span className={styles.upcomingSlot}>{b.date} · {b.slot}</span>
                                        </div>
                                        <span className={`${styles.badge} ${styles.upcoming}`}>Upcoming</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>

                {/* Quick links */}
                <section className={styles.linksRow}>
                    <Link to="/rules" className={styles.linkCard} id="dash-rules-link">
                        <span className={styles.linkIcon}>📋</span>
                        <span>Rules & Guidelines</span>
                    </Link>
                    <Link to="/history" className={styles.linkCard} id="dash-history-link">
                        <span className={styles.linkIcon}>🕐</span>
                        <span>Booking History</span>
                    </Link>
                    <Link to="/book" className={styles.linkCard} id="dash-book-link">
                        <span className={styles.linkIcon}>🗓️</span>
                        <span>Availability Calendar</span>
                    </Link>
                </section>
            </div>
        </AppShell>
    )
}
