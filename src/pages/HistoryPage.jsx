import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/AppShell/AppShell'
import { useBooking } from '../context/BookingContext'
import styles from './HistoryPage.module.css'

const STATUS_FILTERS = ['all', 'upcoming', 'completed', 'cancelled']

const STATUS_META = {
    upcoming: { label: 'Upcoming', color: '#b5f000', bg: 'rgba(181,240,0,0.1)', border: 'rgba(181,240,0,0.3)' },
    completed: { label: 'Completed', color: '#00c4ff', bg: 'rgba(0,196,255,0.1)', border: 'rgba(0,196,255,0.3)' },
    cancelled: { label: 'Cancelled', color: '#ff4f6d', bg: 'rgba(255,79,109,0.1)', border: 'rgba(255,79,109,0.3)' },
}

const SPORT_ICONS = {
    Football: '⚽', Basketball: '🏀', Cricket: '🏏', Tennis: '🎾', Badminton: '🏸',
}

export default function HistoryPage() {
    const { bookings, cancelBooking } = useBooking()
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [cancelTarget, setCancelTarget] = useState(null)

    const filtered = bookings.filter(b => {
        const matchFilter = filter === 'all' || b.status === filter
        const q = search.toLowerCase()
        const matchSearch = !q ||
            b.sport.toLowerCase().includes(q) ||
            b.ground.toLowerCase().includes(q) ||
            b.id.toLowerCase().includes(q) ||
            b.date.includes(q)
        return matchFilter && matchSearch
    })

    const handleCancel = (id) => {
        cancelBooking(id)
        setCancelTarget(null)
    }

    const stats = {
        total: bookings.length,
        upcoming: bookings.filter(b => b.status === 'upcoming').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
    }

    return (
        <AppShell>
            <div className={styles.page}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Booking History</h1>
                        <p className={styles.sub}>All your past and upcoming ground reservations.</p>
                    </div>
                    <Link to="/book" className={styles.newBookBtn} id="history-new-book-btn">
                        + New Booking
                    </Link>
                </div>

                {/* Mini stats */}
                <div className={styles.statsRow}>
                    {[
                        { label: 'Total', val: stats.total },
                        { label: 'Upcoming', val: stats.upcoming, color: '#b5f000' },
                        { label: 'Completed', val: stats.completed, color: '#00c4ff' },
                        { label: 'Cancelled', val: stats.cancelled, color: '#ff4f6d' },
                    ].map(s => (
                        <div key={s.label} className={styles.statPill}>
                            <span className={styles.statNum} style={s.color ? { color: s.color } : {}}>
                                {s.val}
                            </span>
                            <span className={styles.statLabel}>{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Toolbar */}
                <div className={styles.toolbar}>
                    {/* Search */}
                    <div className={styles.searchWrap}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            id="history-search"
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search sport, ground or booking ID…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className={styles.filterTabs}>
                        {STATUS_FILTERS.map(f => (
                            <button
                                key={f}
                                className={`${styles.filterTab} ${filter === f ? styles.filterActive : ''}`}
                                onClick={() => setFilter(f)}
                                id={`filter-${f}`}
                            >
                                {f === 'all' ? 'All' : STATUS_META[f].label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Booking list */}
                {filtered.length === 0 ? (
                    <div className={styles.empty}>
                        <span className={styles.emptyIcon}>📭</span>
                        <p className={styles.emptyTitle}>No bookings found</p>
                        <p className={styles.emptySub}>
                            {search ? 'Try a different search term.' : 'Make your first booking!'}
                        </p>
                        <Link to="/book" className={styles.emptyBtn}>Book a Ground →</Link>
                    </div>
                ) : (
                    <div className={styles.list}>
                        {filtered.map((b, idx) => {
                            const meta = STATUS_META[b.status]
                            return (
                                <div
                                    key={b.id}
                                    className={styles.card}
                                    style={{ animationDelay: `${idx * 0.04}s` }}
                                >
                                    {/* Left: sport icon */}
                                    <div className={styles.cardIcon}>
                                        {SPORT_ICONS[b.sport] || '🏅'}
                                    </div>

                                    {/* Middle: Details */}
                                    <div className={styles.cardBody}>
                                        <div className={styles.cardTop}>
                                            <span className={styles.bookingId}>{b.id}</span>
                                            <span
                                                className={styles.statusBadge}
                                                style={{
                                                    color: meta.color,
                                                    background: meta.bg,
                                                    border: `1px solid ${meta.border}`,
                                                }}
                                            >
                                                {meta.label}
                                            </span>
                                        </div>
                                        <div className={styles.cardMid}>
                                            <span className={styles.sportName}>{b.sport}</span>
                                            <span className={styles.dot}>·</span>
                                            <span className={styles.groundName}>{b.ground}</span>
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <span className={styles.infoChip}>📅 {b.date}</span>
                                            <span className={styles.infoChip}>🕐 {b.slot}</span>
                                            <span className={styles.infoChip}>Booked {b.bookedOn}</span>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className={styles.cardActions}>
                                        {b.status === 'upcoming' && (
                                            <>
                                                {cancelTarget === b.id ? (
                                                    <div className={styles.confirmCancel}>
                                                        <span className={styles.confirmText}>Cancel?</span>
                                                        <button
                                                            className={styles.btnYes}
                                                            onClick={() => handleCancel(b.id)}
                                                            id={`cancel-confirm-${b.id}`}
                                                        >Yes</button>
                                                        <button
                                                            className={styles.btnNo}
                                                            onClick={() => setCancelTarget(null)}
                                                        >No</button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className={styles.cancelBtn}
                                                        onClick={() => setCancelTarget(b.id)}
                                                        id={`cancel-${b.id}`}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </AppShell>
    )
}
