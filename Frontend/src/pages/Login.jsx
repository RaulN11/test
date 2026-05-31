import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api/api.js'
import { useLanguage } from '../context/LanguageContext'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { t } = useLanguage()

    const handleLogin = async () => {
        setLoading(true); setError('')
        try {
            await api.login(email, password)
            navigate('/search')
        } catch(e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-wrap">
            <div className="auth-card fade-in">
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div className="nav-logo" style={{ fontSize: '30px', marginBottom: '16px', display: 'block' }}>
                        <span style={{ color: 'var(--accent)' }}>Car</span>
                        <span className="gradient-text">Ket</span>
                    </div>
                    <h1 style={{ fontSize: '21px', fontWeight: 700, marginBottom: '6px' }}>
                        {t('login_welcome')}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        {t('login_new')}{' '}
                        <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
                            {t('login_create')}
                        </Link>
                    </p>
                </div>

                <div className="form-group">
                    <label className="label">{t('login_email')}</label>
                    <input
                        className="input"
                        type="email"
                        placeholder={t('login_email_placeholder')}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    />
                </div>

                <div className="form-group">
                    <label className="label">{t('login_password')}</label>
                    <input
                        className="input"
                        type="password"
                        placeholder={t('login_password_placeholder')}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    />
                </div>

                <ErrorMessage message={error} />

                <button
                    className="btn btn-primary btn-full btn-lg"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading
                        ? <><i className="fa-solid fa-circle-notch spinner" /> {t('login_signing_in')}</>
                        : t('login_button')
                    }
                </button>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-dim)' }}>
                    {t('login_guest')}{' '}
                    <Link to="/search" style={{ color: 'var(--text-muted)' }}>{t('login_guest_link')}</Link>
                </p>
            </div>
        </div>
    )
}