import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppShell from '../components/AppShell/AppShell'
import { useAuth } from '../context/AuthContext'
import { useBooking, SPORTS, TIME_SLOTS, isSlotBooked } from '../context/BookingContext'
import styles from './BookingPage.module.css'

/* ── helpers ── */
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay()
}
function padDate(n) { return String(n).padStart(2, '0') }
function toDateStr(y, m, d) { return `${y}-${padDate(m + 1)}-${padDate(d)}` }

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function BookingPage() {
    const { user } = useAuth()
    const { addBooking } = useBooking()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const preselectedSport = searchParams.get('sport') || ''

    const today = new Date()
    const [calYear, setCalYear] = useState(today.getFullYear())
    const [calMonth, setCalMonth] = useState(today.getMonth())
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedSport, setSelectedSport] = useState(
        SPORTS.find(s => s.id === preselectedSport) || null
    )
    const [selectedGround, setSelectedGround] = useState(null)
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [step, setStep] = useState(1) // 1=sport, 2=date, 3=slot, 4=form, 5=confirm

    // If sport preselected via URL, auto-select first ground and jump to step 2
    useEffect(() => {
        const found = SPORTS.find(s => s.id === preselectedSport)
        if (found) {
            setSelectedSport(found)
            setSelectedGround(found.grounds[0]) // auto-pick first ground
            setStep(2)
        }
    }, [preselectedSport])

    const daysInMonth = getDaysInMonth(calYear, calMonth)
    const firstDay = getFirstDayOfMonth(calYear, calMonth)
    const dateStr = selectedDate ? toDateStr(calYear, calMonth, selectedDate) : null

    const prevMonth = () => {
        if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
        else setCalMonth(m => m - 1)
        setSelectedDate(null)
    }
    const nextMonth = () => {
        if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
        else setCalMonth(m => m + 1)
        setSelectedDate(null)
    }

    const isPastDay = (d) => {
        const dt = new Date(calYear, calMonth, d)
        const t = new Date(); t.setHours(0, 0, 0, 0)
        return dt < t
    }

    // Booking form state
    const [form, setForm] = useState({ name: user?.name || '', phone: '', notes: '' })
    const [submitting, setSubmitting] = useState(false)

    const handleBookingSubmit = (e) => {
        e.preventDefault()
        setSubmitting(true)
        setTimeout(() => {
            const booking = addBooking({
                sport: selectedSport.name,
                ground: selectedGround,
                date: dateStr,
                slot: selectedSlot,
            })
            navigate('/confirm', { state: { booking } })
        }, 1200)
    }

    /* ── STEP LABELS ── */
    const steps = ['Sport', 'Date', 'Slot', 'Details']
    const currentStepIdx = step - 1

    return (
        <AppShell>
            <div className={styles.page}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Book a Ground</h1>
                    <p className={styles.pageSub}>Select sport, date & time slot to reserve your spot.</p>
                </div>

                {/* Stepper */}
                <div className={styles.stepper}>
                    {steps.map((label, i) => (
                        <div
                            key={label}
                            className={`${styles.stepItem} ${i < currentStepIdx ? styles.stepDone : ''} ${i === currentStepIdx ? styles.stepActive : ''}`}
                        >
                            <div className={styles.stepCircle}>{i < currentStepIdx ? '✓' : i + 1}</div>
                            <span className={styles.stepLabel}>{label}</span>
                            {i < steps.length - 1 && <div className={styles.stepLine} />}
                        </div>
                    ))}
                </div>

                <div className={styles.content}>
                    {/* ── STEP 1: Sport Selection ── */}
                    {step === 1 && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Select Sport</h2>
                            <div className={styles.sportsGrid}>
                                {SPORTS.map(sport => (
                                    <button
                                        key={sport.id}
                                        className={`${styles.sportCard} ${selectedSport?.id === sport.id ? styles.sportSelected : ''}`}
                                        style={{ '--sc': sport.color }}
                                        onClick={() => { setSelectedSport(sport); setSelectedGround(null) }}
                                        id={`sport-card-${sport.id}`}
                                    >
                                        <span className={styles.sportEmoji}>{sport.icon}</span>
                                        <span className={styles.sportCardName}>{sport.name}</span>
                                        <span className={styles.groundCount}>{sport.grounds.length} grounds</span>
                                    </button>
                                ))}
                            </div>

                            {selectedSport && (
                                <>
                                    <h3 className={styles.subhead}>Select Ground</h3>
                                    <div className={styles.groundGrid}>
                                        {selectedSport.grounds.map(g => (
                                            <button
                                                key={g}
                                                className={`${styles.groundChip} ${selectedGround === g ? styles.groundSelected : ''}`}
                                                onClick={() => setSelectedGround(g)}
                                                id={`ground-${g.replace(/\s+/g, '-')}`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            <div className={styles.navRow}>
                                <span />
                                <button
                                    className={styles.nextBtn}
                                    disabled={!selectedSport || !selectedGround}
                                    onClick={() => setStep(2)}
                                    id="step1-next"
                                >
                                    Next: Pick Date →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 2: Calendar ── */}
                    {step === 2 && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Select Date</h2>
                            <div className={styles.calendarWrap}>
                                <div className={styles.calHeader}>
                                    <button className={styles.calNav} onClick={prevMonth} id="cal-prev">‹</button>
                                    <span className={styles.calMonth}>{MONTH_NAMES[calMonth]} {calYear}</span>
                                    <button className={styles.calNav} onClick={nextMonth} id="cal-next">›</button>
                                </div>
                                <div className={styles.calGrid}>
                                    {DAY_NAMES.map(d => (
                                        <div key={d} className={styles.calDayName}>{d}</div>
                                    ))}
                                    {Array.from({ length: firstDay }).map((_, i) => (
                                        <div key={`e${i}`} />
                                    ))}
                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const d = i + 1
                                        const past = isPastDay(d)
                                        const ds = toDateStr(calYear, calMonth, d)
                                        const hasBooking = Array.from({ length: TIME_SLOTS.length }, (_, si) => isSlotBooked(ds, si)).some(Boolean)
                                        return (
                                            <button
                                                key={d}
                                                disabled={past}
                                                className={`${styles.calDay}
                                                    ${past ? styles.calPast : ''}
                                                    ${selectedDate === d ? styles.calSelected : ''}
                                                    ${!past && hasBooking ? styles.calPartial : ''}
                                                `}
                                                onClick={() => !past && setSelectedDate(d)}
                                                id={`cal-day-${d}`}
                                            >
                                                {d}
                                                {!past && <span className={styles.calDot} />}
                                            </button>
                                        )
                                    })}
                                </div>
                                <div className={styles.calLegend}>
                                    <span><span className={`${styles.dot} ${styles.dotFree}`} /> Available</span>
                                    <span><span className={`${styles.dot} ${styles.dotPartial}`} /> Partially booked</span>
                                    <span><span className={`${styles.dot} ${styles.dotPast}`} /> Past</span>
                                </div>
                            </div>
                            <div className={styles.navRow}>
                                <button className={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
                                <button
                                    className={styles.nextBtn}
                                    disabled={!selectedDate}
                                    onClick={() => setStep(3)}
                                    id="step2-next"
                                >
                                    Next: Pick Slot →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Time Slots ── */}
                    {step === 3 && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Select Time Slot</h2>
                            <p className={styles.sectionSub}>
                                {selectedSport?.icon} {selectedSport?.name} · {selectedGround} ·{' '}
                                {MONTH_NAMES[calMonth]} {selectedDate}, {calYear}
                            </p>
                            <div className={styles.slotsGrid}>
                                {TIME_SLOTS.map((slot, i) => {
                                    const booked = isSlotBooked(dateStr, i)
                                    return (
                                        <button
                                            key={slot}
                                            disabled={booked}
                                            className={`${styles.slotChip}
                                                ${booked ? styles.slotBooked : ''}
                                                ${selectedSlot === slot ? styles.slotSelected : ''}
                                            `}
                                            onClick={() => !booked && setSelectedSlot(slot)}
                                            id={`slot-${i}`}
                                        >
                                            {slot}
                                            {booked && <span className={styles.slotBookedTag}>Booked</span>}
                                        </button>
                                    )
                                })}
                            </div>
                            <div className={styles.navRow}>
                                <button className={styles.backBtn} onClick={() => setStep(2)}>← Back</button>
                                <button
                                    className={styles.nextBtn}
                                    disabled={!selectedSlot}
                                    onClick={() => setStep(4)}
                                    id="step3-next"
                                >
                                    Next: Your Details →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 4: Booking Form ── */}
                    {step === 4 && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Booking Details</h2>

                            {/* Summary card */}
                            <div className={styles.summaryCard}>
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Sport</span>
                                    <span className={styles.summaryVal}>{selectedSport?.icon} {selectedSport?.name}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Ground</span>
                                    <span className={styles.summaryVal}>{selectedGround}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Date</span>
                                    <span className={styles.summaryVal}>{MONTH_NAMES[calMonth]} {selectedDate}, {calYear}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Slot</span>
                                    <span className={styles.summaryVal}>{selectedSlot}</span>
                                </div>
                            </div>

                            <form className={styles.form} onSubmit={handleBookingSubmit} noValidate>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel} htmlFor="book-name">Full Name</label>
                                    <input
                                        id="book-name"
                                        type="text"
                                        className={styles.formInput}
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        required
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel} htmlFor="book-phone">Phone Number</label>
                                    <input
                                        id="book-phone"
                                        type="tel"
                                        className={styles.formInput}
                                        value={form.phone}
                                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                        required
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel} htmlFor="book-notes">Special Requests <span className={styles.optTag}>(optional)</span></label>
                                    <textarea
                                        id="book-notes"
                                        className={`${styles.formInput} ${styles.textarea}`}
                                        value={form.notes}
                                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                        placeholder="Any equipment needs, accessibility requirements…"
                                        rows={3}
                                    />
                                </div>
                                <div className={styles.navRow}>
                                    <button type="button" className={styles.backBtn} onClick={() => setStep(3)}>← Back</button>
                                    <button
                                        type="submit"
                                        className={styles.nextBtn}
                                        disabled={submitting || !form.name || !form.phone}
                                        id="confirm-booking-btn"
                                    >
                                        {submitting ? 'Confirming…' : 'Confirm Booking ✓'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    )
}
