import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../Navbar'
import BottomNav from '../BottomNav'
import styles from './AppShell.module.css'

/**
 * AppShell wraps every protected page.
 * Redirects to "/" if the user is not logged in.
 */
export default function AppShell({ children }) {
    const { user, openLogin } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/', { replace: true })
            // Show login modal after redirecting
            setTimeout(openLogin, 200)
        }
    }, [user, navigate, openLogin])

    if (!user) return null

    return (
        <div className={styles.shell}>
            <Navbar />
            <main className={styles.main}>{children}</main>
            <BottomNav />
        </div>
    )
}
