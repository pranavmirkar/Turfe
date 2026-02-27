import { useAuth } from '../context/AuthContext'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './SportsShowcase.module.css'

const sports = [
    { num: '01', name: 'FOOTBALL', meta: '3 Grounds · Indoor & Outdoor' },
    { num: '02', name: 'BASKETBALL', meta: '2 Courts · Floodlit' },
    { num: '03', name: 'CRICKET', meta: '1 Ground · Full Pitch' },
    { num: '04', name: 'TENNIS', meta: '4 Courts · Hard & Clay' },
    { num: '05', name: 'BADMINTON', meta: '6 Courts · Indoor' },
]

export default function SportsShowcase() {
    const ref = useScrollReveal()
    const { openRegister } = useAuth()

    return (
        <section className={styles.section} id="sports" ref={ref}>
            <p className={`${styles.label} reveal`}>— Available Sports</p>

            <div className={styles.list}>
                {sports.map(sport => (
                    <div key={sport.num} className={`${styles.row} reveal`}>
                        <span className={styles.number}>{sport.num}</span>
                        <span className={styles.nameBig}>{sport.name}</span>
                        <span className={styles.meta}>{sport.meta}</span>
                        <button onClick={openRegister} className={styles.bookBtn}>Book →</button>
                    </div>
                ))}
            </div>
        </section>
    )
}
