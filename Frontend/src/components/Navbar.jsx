import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../api/api.js'
import { useLanguage } from '../context/LanguageContext'

export default function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [loggedIn, setLoggedIn] = useState(api.isLoggedIn())
    const { currentLang, changeLanguage, t } = useLanguage()

    useEffect(() => {
        const interval = setInterval(() => setLoggedIn(api.isLoggedIn()), 500)
        return () => clearInterval(interval)
    }, [])

    const handleLogout = () => {
        api.logout()
        setLoggedIn(false)
        navigate('/login')
    }

    const active = (path) =>
        location.pathname === path || location.pathname.startsWith(path + '/')
            ? 'active' : ''

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/search" className="nav-logo">
                    <span style={{ color: 'var(--accent)' }}>Car</span>
                    <span className="gradient-text">Ket</span>
                </Link>

                <div className="nav-actions">
                    <Link to="/search">
                        <button className={`nav-icon-btn ${active('/search')}`} title="Search">
                            <i className="fa-solid fa-magnifying-glass" />
                        </button>
                    </Link>

                    {loggedIn && <>
                        <Link to="/sell">
                            <button className={`nav-icon-btn ${active('/sell')}`} title="Sell a car">
                                <i className="fa-solid fa-tag" />
                            </button>
                        </Link>
                        <Link to="/my-ads">
                            <button className={`nav-icon-btn ${active('/my-ads')}`} title="My listings">
                                <i className="fa-solid fa-rectangle-list" />
                            </button>
                        </Link>
                        <Link to="/chat">
                            <button className={`nav-icon-btn ${active('/chat')}`} title="Messages">
                                <i className="fa-solid fa-comment-dots" />
                            </button>
                        </Link>
                    </>}

                    <div className="nav-divider" />

                    <div style={{ display: 'flex', gap: '4px' }}>
                        {[['en','gb'],['ro','ro'],['zh','cn']].map(([code, flag]) => (
                            <button
                                key={code}
                                className={`lang-btn ${currentLang === code ? 'active' : ''}`}
                                onClick={() => changeLanguage(code)}
                            >
                                <img src={`https://flagcdn.com/${flag}.svg`} alt={code} />
                            </button>
                        ))}
                    </div>

                    <div className="nav-divider" />

                    {loggedIn
                        ? <button onClick={handleLogout} className="btn btn-outline btn-sm">
                            {t('nav_logout')}
                        </button>
                        : <Link to="/login">
                            <button className="btn btn-primary btn-sm">Sign in</button>
                        </Link>
                    }
                </div>
            </div>
        </nav>
    )
}