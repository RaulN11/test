import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api/api.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'

export default function AdDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [ad, setAd] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [newPrice, setNewPrice] = useState('')
    const [error, setError] = useState('')
    const { t } = useLanguage()

    const email   = api.getEmail()
    const role    = api.getRole()
    const isOwner = ad && ad.userEmail === email
    const isAdmin = role === 'ROLE_ADMIN'

    useEffect(() => {
        api.getAdById(id)
            .then(data => { setAd(data); setNewPrice(data?.price || '') })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [id])

    const handleDelete = async () => {
        if (!confirm(t('ad_delete_confirm'))) return
        try {
            await api.deleteAd(id)
            navigate('/search')
        } catch(e) { setError(e.message) }
    }

    const handleUpdatePrice = async () => {
        try {
            await api.updatePrice(id, parseInt(newPrice))
            setAd({ ...ad, price: parseInt(newPrice) })
            setShowModal(false)
        } catch(e) { setError(e.message) }
    }

    if (loading) return (
        <div className="empty-state" style={{ minHeight: '60vh' }}>
            <i className="fa-solid fa-circle-notch spinner" style={{ fontSize: 40 }} />
            <p>{t('ad_loading')}</p>
        </div>
    )

    if (!ad || error) return (
        <div className="empty-state" style={{ minHeight: '60vh' }}>
            <i className="fa-solid fa-triangle-exclamation" />
            <p>{error || t('ad_not_found')}</p>
            <Link to="/search"><button className="btn btn-outline">Back to search</button></Link>
        </div>
    )

    return (
        <div className="page fade-in">
            {/* Back */}
            <Link to="/results" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500, marginBottom: '24px' }}>
                <i className="fa-solid fa-arrow-left" /> Back to results
            </Link>

            <ErrorMessage message={error} />

            <div className="ad-detail-grid">
                {/* Left — image */}
                <div>
                    {ad.images?.length > 0
                        ? <img className="ad-detail-img" src={`http://localhost:8082${ad.images[0]}`} alt="Car" />
                        : <div className="ad-img-placeholder" style={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)', aspectRatio: '16/9' }}>
                            <i className="fa-solid fa-car" />
                        </div>
                    }

                    {/* Specs grid */}
                    <div className="spec-grid">
                        {[
                            ['Year', ad.year, 'fa-calendar'],
                            ['Price', `$${ad.price?.toLocaleString()}`, 'fa-tag'],
                            ['Chassis', ad.car?.chassis, 'fa-car'],
                            ['Seller', `${ad.firstName} ${ad.lastName}`, 'fa-user'],
                        ].map(([label, value, icon]) => (
                            <div key={label} className="spec-item">
                                <div className="spec-label"><i className={`fa-solid ${icon}`} style={{ marginRight: 5 }} />{label}</div>
                                <div className="spec-value">{value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — info panel */}
                <div className="card" style={{ padding: '28px' }}>
                    <span className="badge badge-primary" style={{ marginBottom: '12px' }}>{ad.car?.chassis}</span>
                    <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>
                        {ad.car?.brand} {ad.car?.model}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                        {ad.year} · Listed by {ad.firstName} {ad.lastName}
                    </p>

                    <div style={{
                        background: 'var(--surface-raised)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '20px',
                        marginBottom: '24px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Asking Price</div>
                        <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--accent)' }}>
                            ${ad.price?.toLocaleString()}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {api.isLoggedIn() && !isOwner && (
                            <button
                                className="btn btn-primary btn-full btn-lg"
                                onClick={async () => {
                                    try {
                                        const conv = await api.startConversation(ad.id, ad.userEmail, `${ad.car?.brand} ${ad.car?.model}`)
                                        navigate(`/chat/${conv.id}`)
                                    } catch(e) { setError(e.message) }
                                }}
                            >
                                <i className="fa-solid fa-comment" /> Contact Seller
                            </button>
                        )}

                        {isOwner && (
                            <button className="btn btn-outline btn-full" onClick={() => setShowModal(true)}>
                                <i className="fa-solid fa-pen" /> {t('ad_edit_price')}
                            </button>
                        )}

                        {(isOwner || isAdmin) && (
                            <button className="btn btn-danger btn-full" onClick={handleDelete}>
                                <i className="fa-solid fa-trash" /> {t('ad_delete')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit price modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal fade-in" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>
                            <i className="fa-solid fa-xmark" />
                        </button>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>{t('ad_edit_price')}</h2>
                        <div className="form-group">
                            <label className="label">{t('ad_new_price')}</label>
                            <input
                                className="input"
                                type="number"
                                value={newPrice}
                                onChange={e => setNewPrice(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary btn-full" onClick={handleUpdatePrice}>
                            <i className="fa-solid fa-check" /> {t('ad_save')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}