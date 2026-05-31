import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api/api.js'
import { useLanguage } from '../context/LanguageContext'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function Register() {
    const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'', role:'client' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { t } = useLanguage()

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleRegister = async () => {
        if (!form.firstName || !form.lastName || !form.email || !form.password) {
            setError(t('register_error_fields'))
            return
        }
        setLoading(true); setError('')
        try {
            await api.register(form)
            navigate('/login')
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
                        {t('register_welcome')}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        {t('register_have_account')}{' '}
                        <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
                            {t('register_login_link')}
                        </Link>
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="label">{t('register_firstname')}</label>
                        <input className="input" type="text" name="firstName"
                               placeholder={t('register_firstname_placeholder')} onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="label">{t('register_lastname')}</label>
                        <input className="input" type="text" name="lastName"
                               placeholder={t('register_lastname_placeholder')} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                    <label className="label">{t('register_email')}</label>
                    <input className="input" type="email" name="email"
                           placeholder={t('register_email_placeholder')} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label className="label">{t('register_role')}</label>
                    <select className="input" name="role" onChange={handleChange}>
                        <option value="client">{t('register_role_client')}</option>
                        <option value="admin">{t('register_role_admin')}</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="label">{t('register_password')}</label>
                    <input className="input" type="password" name="password"
                           placeholder={t('register_password_placeholder')} onChange={handleChange} />
                </div>

                <ErrorMessage message={error} />

                <button
                    className="btn btn-primary btn-full btn-lg"
                    onClick={handleRegister}
                    disabled={loading}
                >
                    {loading
                        ? <><i className="fa-solid fa-circle-notch spinner" /> {t('register_creating')}</>
                        : t('register_button')
                    }
                </button>
            </div>
        </div>
    )
}