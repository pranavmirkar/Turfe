import styles from './MarqueeStrip.module.css'

const items = ['Book Now', 'Football', 'Basketball', 'Cricket', 'Tennis', 'Reserve Your Slot', 'Badminton', 'Community Play']

export default function MarqueeStrip() {
    return (
        <div className={styles.strip}>
            <div className={styles.track}>
                {[...items, ...items].map((item, i) => (
                    <span key={i} className={i % 2 === 0 ? styles.text : styles.dot}>
                        {i % 2 === 0 ? item : '★'}
                    </span>
                ))}
            </div>
        </div>
    )
}
