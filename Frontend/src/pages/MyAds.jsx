import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/api.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function MyAds() {
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { t } = useLanguage()

    useEffect(() => {
        api.getMyAds()
            .then(setAds)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="page fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="page-title">
                        {t('myads_title')} <span className="gradient-text">{t('myads_title_accent')}</span>
                    </h1>
                    <p className="page-sub">{loading ? '…' : `${ads.length} active listings`}</p>
                </div>
                <Link to="/sell">
                    <button className="btn btn-primary">
                        <i className="fa-solid fa-plus" /> New listing
                    </button>
                </Link>
            </div>

            <ErrorMessage message={error} />

            {loading && (
                <div className="empty-state">
                    <i className="fa-solid fa-circle-notch spinner" style={{ fontSize: 36 }} />
                    <p>{t('myads_loading')}</p>
                </div>
            )}

            {!loading && ads.length === 0 && !error && (
                <div className="empty-state">
                    <i className="fa-solid fa-car" />
                    <p>{t('myads_none')}</p>
                    <Link to="/sell">
                        <button className="btn btn-primary">
                            <i className="fa-solid fa-plus" /> {t('myads_create')}
                        </button>
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
                                <p className="ad-seller">{ad.year} · {ad.car?.chassis}</p>
                                <p className="ad-price">${ad.price?.toLocaleString()}</p>
                                <div className="ad-tags">
                                    <span className="badge badge-accent">Your listing</span>
                                    <span className="badge badge-surface">{ad.car?.chassis}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}