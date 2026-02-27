import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell/AppShell'
import styles from './ConfirmationPage.module.css'

export default function ConfirmationPage() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const booking = state?.booking
    const circleRef = useRef(null)

    // Redirect if no booking data
    useEffect(() => {
        if (!booking) navigate('/book', { replace: true })
    }, [booking, navigate])

    // Draw checkmark animation
    useEffect(() => {
        if (!circleRef.current) return
        const circle = circleRef.current
        circle.style.strokeDashoffset = circle.getTotalLength?.() || 283
        const raf = requestAnimationFrame(() => {
            circle.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)'
            circle.style.strokeDashoffset = 0
        })
        return () => cancelAnimationFrame(raf)
    }, [booking])

    if (!booking) return null

    const statusDetails = [
        { label: 'Booking ID', value: booking.id },
        { label: 'Sport', value: booking.sport },
        { label: 'Ground', value: booking.ground },
        { label: 'Date', value: booking.date },
        { label: 'Time Slot', value: booking.slot },
        { label: 'Status', value: 'Confirmed ✓', accent: true },
        { label: 'Booked On', value: booking.bookedOn },
    ]

    return (
        <AppShell>
            <div className={styles.page}>
                <div className={styles.card}>
                    {/* Animated check */}
                    <div className={styles.iconWrap}>
                        <svg className={styles.checkSvg} viewBox="0 0 100 100">
                            <circle
                                className={styles.checkCircle}
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke="#b5f000"
                                strokeWidth="4"
                                strokeDasharray="283"
                                ref={circleRef}
                            />
                            <polyline
                                className={styles.checkMark}
                                points="30,52 44,67 70,33"
                                fill="none"
                                stroke="#b5f000"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className={styles.pulseRing} />
                    </div>

                    <h1 className={styles.title}>Booking Confirmed!</h1>
                    <p className={styles.subtitle}>
                        Your ground has been reserved. See you on the field! 🏆
                    </p>

                    {/* Booking details */}
                    <div className={styles.details}>
                        {statusDetails.map(d => (
                            <div key={d.label} className={styles.detailRow}>
                                <span className={styles.detailLabel}>{d.label}</span>
                                <span className={`${styles.detailValue} ${d.accent ? styles.accentValue : ''}`}>
                                    {d.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className={styles.actions}>
                        <Link to="/book" className={styles.btnPrimary} id="book-another-btn">
                            + Book Another Slot
                        </Link>
                        <Link to="/history" className={styles.btnSecondary} id="view-history-btn">
                            View All Bookings
                        </Link>
                        <Link to="/dashboard" className={styles.btnGhost} id="back-dashboard-btn">
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </AppShell>
    )
}
