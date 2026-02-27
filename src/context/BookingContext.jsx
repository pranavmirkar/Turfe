import { createContext, useContext, useState } from 'react'

// ── Mock data ──────────────────────────────────────────────────
export const SPORTS = [
    { id: 'football', name: 'Football', icon: '⚽', grounds: ['Ground A', 'Ground B', 'Ground C'], color: '#b5f000' },
    { id: 'basketball', name: 'Basketball', icon: '🏀', grounds: ['Court 1', 'Court 2'], color: '#ff8c00' },
    { id: 'cricket', name: 'Cricket', icon: '🏏', grounds: ['Main Pitch'], color: '#00c4ff' },
    { id: 'tennis', name: 'Tennis', icon: '🎾', grounds: ['Court A', 'Court B', 'Court C', 'Court D'], color: '#ff4f6d' },
    { id: 'badminton', name: 'Badminton', icon: '🏸', grounds: ['Hall 1', 'Hall 2', 'Hall 3', 'Hall 4', 'Hall 5', 'Hall 6'], color: '#a855f7' },
]

export const TIME_SLOTS = [
    '06:00 – 07:00', '07:00 – 08:00', '08:00 – 09:00',
    '09:00 – 10:00', '10:00 – 11:00', '11:00 – 12:00',
    '14:00 – 15:00', '15:00 – 16:00', '16:00 – 17:00',
    '17:00 – 18:00', '18:00 – 19:00', '19:00 – 20:00',
    '20:00 – 21:00', '21:00 – 22:00',
]

// Deterministically mark some slots as booked based on date+slot index
export function isSlotBooked(dateStr, slotIndex) {
    const seed = dateStr.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return (seed + slotIndex * 7) % 5 === 0
}

const INITIAL_HISTORY = [
    { id: 'BK-001', sport: 'Football', ground: 'Ground A', date: '2026-02-15', slot: '18:00 – 19:00', status: 'completed', bookedOn: '2026-02-12' },
    { id: 'BK-002', sport: 'Basketball', ground: 'Court 1', date: '2026-02-20', slot: '07:00 – 08:00', status: 'completed', bookedOn: '2026-02-18' },
    { id: 'BK-003', sport: 'Tennis', ground: 'Court B', date: '2026-02-25', slot: '16:00 – 17:00', status: 'cancelled', bookedOn: '2026-02-22' },
    { id: 'BK-004', sport: 'Football', ground: 'Ground B', date: '2026-03-02', slot: '19:00 – 20:00', status: 'upcoming', bookedOn: '2026-02-26' },
]

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
    const [bookings, setBookings] = useState(INITIAL_HISTORY)
    const [lastBooking, setLastBooking] = useState(null) // for confirmation page

    const addBooking = (details) => {
        const id = `BK-${String(bookings.length + 1).padStart(3, '0')}`
        const booking = {
            id,
            sport: details.sport,
            ground: details.ground,
            date: details.date,
            slot: details.slot,
            status: 'upcoming',
            bookedOn: new Date().toISOString().split('T')[0],
        }
        setBookings(prev => [booking, ...prev])
        setLastBooking(booking)
        return booking
    }

    const cancelBooking = (id) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
    }

    return (
        <BookingContext.Provider value={{ bookings, lastBooking, addBooking, cancelBooking, SPORTS, TIME_SLOTS }}>
            {children}
        </BookingContext.Provider>
    )
}

export const useBooking = () => useContext(BookingContext)
