import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { api } from '../api/api.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function Results() {
    const [searchParams] = useSearchParams()
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showExport, setShowExport] = useState(false)
    const [format, setFormat] = useState('')
    const { t } = useLanguage()

    const brand   = searchParams.get('brand')   || ''
    const model   = searchParams.get('model')   || ''
    const chassis = searchParams.get('chassis') || ''

    useEffect(() => {
        api.searchAds(brand, model, chassis)
            .then(setAds)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [brand, model, chassis])

    const handleExport = () => {
        if (!format) return
        api.exportAds(brand, model, chassis, format)
        setShowExport(false)
    }

    const subtitle = [brand, model, chassis].filter(Boolean).join(' · ') || 'All cars'

    return (
        <div className="page fade-in">
            <div className="results-bar">
                <div>
                    <h1 className="page-title">{t('results_title')} <span className="gradient-text">{t('results_title_accent')}</span></h1>
                    <p className="page-sub">{subtitle} · {loading ? '…' : `${ads.length} listings`}</p>
                </div>
                <button className="btn btn-outline" onClick={() => setShowExport(true)}>
                    <i className="fa-solid fa-download" />
                    {t('results_export')}
                </button>
            </div>

            <ErrorMessage message={error} />

            {loading && (
                <div className="empty-state">
                    <i className="fa-solid fa-circle-notch spinner" style={{ fontSize: 36 }} />
                    <p>{t('results_loading')}</p>
                </div>
            )}

            {!loading && ads.length === 0 && !error && (
                <div className="empty-state">
                    <i className="fa-solid fa-car-burst" />
                    <p>{t('results_none')}</p>
                    <Link to="/search">
                        <button className="btn btn-outline">Modify search</button>
                    </Link>
                </div>
            )}

            <div className="ad-grid">
                {ads.map(ad => (
                    <Link key={ad.id} to={`/ad/${ad.id}`}>
                        <div className="ad-card">
                            {ad.images?.length > 0
                                ? <img className="ad-img" src={`http://localhost:8082${ad.images[0]}`} alt="Car" />
                                : <div className="ad-img-placeholder"><i className="fa-solid fa-car" /></div>
                            }
                            <div className="ad-body">
                                <p className="ad-title">{ad.car?.brand} {ad.car?.model}</p>
                                <p className="ad-seller">{ad.firstName} {ad.lastName}</p>
                                <p className="ad-price">${ad.price?.toLocaleString()}</p>
                                <div className="ad-tags">
                                    <span className="badge badge-surface">{ad.year}</span>
                                    <span className="badge badge-primary">{ad.car?.chassis}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Export modal */}
            {showExport && (
                <div className="modal-overlay" onClick={() => setShowExport(false)}>
                    <div className="modal fade-in" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowExport(false)}>
                            <i className="fa-solid fa-xmark" />
                        </button>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
                            {t('results_export_title')}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                            Choose a format to download your results.
                        </p>
                        {['JSON','XML','CSV'].map(f => (
                            <label key={f} className={`export-option ${format === f ? 'selected' : ''}`} onClick={() => setFormat(f)}>
                                <input type="radio" name="format" value={f} checked={format === f} onChange={() => setFormat(f)} />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{f}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                                        {f === 'JSON' ? 'JavaScript Object Notation' : f === 'XML' ? 'Extensible Markup Language' : 'Comma-Separated Values'}
                                    </div>
                                </div>
                            </label>
                        ))}
                        <button
                            className="btn btn-primary btn-full"
                            style={{ marginTop: '16px' }}
                            onClick={handleExport}
                            disabled={!format}
                        >
                            <i className="fa-solid fa-download" /> {t('results_export_button')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}