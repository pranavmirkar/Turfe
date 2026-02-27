import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false)
    const [tab, setTab] = useState('login')   // 'login' | 'register'
    const [user, setUser] = useState(null)      // null = logged out

    const openLogin = () => { setTab('login'); setIsOpen(true) }
    const openRegister = () => { setTab('register'); setIsOpen(true) }
    const close = () => setIsOpen(false)
    const switchTab = (t) => setTab(t)

    const login = (data) => {
        setUser({ name: data.name || 'Community Member', email: data.email, avatar: data.name ? data.name[0].toUpperCase() : 'U' })
        setIsOpen(false)
    }

    const logout = () => setUser(null)

    return (
        <AuthContext.Provider value={{ isOpen, tab, user, openLogin, openRegister, close, switchTab, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
