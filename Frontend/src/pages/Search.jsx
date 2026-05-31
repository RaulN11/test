import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const CHASSIS = ['sedan','suv','hatchback','coupe','convertible','wagon','pickup','van']

export default function Search() {
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [chassis, setChassis] = useState('')
    const navigate = useNavigate()
    const { t } = useLanguage()

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (brand)   params.append('brand', brand)
        if (model)   params.append('model', model)
        if (chassis) params.append('chassis', chassis)
        navigate(`/results?${params}`)
    }

    return (
        <div style={{ flex: 1 }}>
            {/* Hero */}
            <div className="hero">
                <div className="hero-eyebrow">
                    <i className="fa-solid fa-car" />
                    Romania's car marketplace
                </div>
                <h1 className="hero-title">
                    Find your{' '}
                    <span className="gradient-text">perfect car</span>
                </h1>
                <p className="hero-sub">
                    Browse thousands of listings from verified sellers across the country.
                </p>

                {/* Search box */}
                <div className="search-box fade-in">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                        <div>
                            <label className="label">{t('search_brand')}</label>
                            <input
                                className="input"
                                type="text"
                                placeholder="e.g. BMW"
                                value={brand}
                                onChange={e => setBrand(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <div>
                            <label className="label">{t('search_model')}</label>
                            <input
                                className="input"
                                type="text"
                                placeholder="e.g. M3"
                                value={model}
                                onChange={e => setModel(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <div>
                            <label className="label">{t('search_chassis')}</label>
                            <select className="input" value={chassis} onChange={e => setChassis(e.target.value)}>
                                <option value="">Any type</option>
                                {CHASSIS.map(c => <option key={c} value={c}>{t(`chassis_${c}`)}</option>)}
                            </select>
                        </div>
                    </div>
                    <button
                        className="btn btn-primary btn-full btn-lg"
                        onClick={handleSearch}
                    >
                        <i className="fa-solid fa-magnifying-glass" />
                        {t('search_button')}
                    </button>
                </div>
            </div>

            {/* Stats strip */}
            <div style={{
                maxWidth: 560, margin: '0 auto 40px', padding: '0 24px',
                display: 'flex', justifyContent: 'space-around'
            }}>
                {[['10k+','Listings'],['5k+','Sellers'],['99%','Satisfaction']].map(([num, label]) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent)' }}>{num}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}