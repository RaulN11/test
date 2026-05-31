import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/api.js'
import { useLanguage } from '../context/LanguageContext'
import ErrorMessage from '../components/ErrorMessage.jsx'

const CHASSIS = ['sedan','suv','hatchback','coupe','convertible','wagon','pickup','van']

export default function Sell() {
    const [form, setForm] = useState({ brand:'', model:'', chassis:'', year:'', price:'' })
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { t } = useLanguage()

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handlePublish = async () => {
        if (!form.brand || !form.model || !form.chassis || !form.year || !form.price) {
            setError(t('sell_error_fields')); return
        }
        setLoading(true); setError('')
        try {
            await api.publishAd({ ...form, year: parseInt(form.year), price: parseInt(form.price) }, image)
            navigate('/my-ads')
        } catch(e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    {t('sell_title')} <span className="gradient-text">{t('sell_title_accent')}</span>
                </h1>
                <p className="page-sub">Fill in your car's details and publish your listing.</p>
            </div>

            <div style={{ maxWidth: 640 }}>
                <div className="card" style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Car Details
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="label">{t('sell_brand')}</label>
                            <input className="input" type="text" name="brand" placeholder="BMW" onChange={handleChange} />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="label">{t('sell_model')}</label>
                            <input className="input" type="text" name="model" placeholder="M3" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '16px' }}>
                        <label className="label">{t('sell_chassis')}</label>
                        <select className="input" name="chassis" onChange={handleChange}>
                            <option value="">Select chassis type</option>
                            {CHASSIS.map(c => <option key={c} value={c}>{t(`chassis_${c}`)}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="label">{t('sell_year')}</label>
                            <input className="input" type="number" name="year" placeholder="2022" onChange={handleChange} />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="label">{t('sell_price')} ($)</label>
                            <input className="input" type="number" name="price" placeholder="24500" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '16px' }}>
                        <label className="label">{t('sell_image')}</label>
                        <div style={{
                            border: '2px dashed var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '24px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s',
                        }}
                             onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-light)'}
                             onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 28, color: 'var(--text-dim)', marginBottom: 8 }} />
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: 8 }}>
                                {image ? image.name : 'Click or drag to upload an image'}
                            </p>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }}
                                onChange={e => setImage(e.target.files[0])}
                            />
                        </div>
                    </div>

                    <ErrorMessage message={error} />

                    <button
                        className="btn btn-primary btn-full btn-lg"
                        onClick={handlePublish}
                        disabled={loading}
                        style={{ marginTop: '8px' }}
                    >
                        {loading
                            ? <><i className="fa-solid fa-circle-notch spinner" /> Publishing…</>
                            : <><i className="fa-solid fa-rocket" /> {t('sell_button')}</>
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}