import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Client } from '@stomp/stompjs'
import { api } from '../api/api.js'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function Chat() {
    const { conversationId } = useParams()
    const [conversations, setConversations] = useState([])
    const [activeConv, setActiveConv] = useState(null)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [connected, setConnected] = useState(false)
    const stompRef = useRef(null)
    const activeConvRef = useRef(null)
    const bottomRef = useRef(null)
    const myEmail = api.getEmail()
    const { t } = useLanguage()

    useEffect(() => {
        api.getMyConversations().then(setConversations)
    }, [])

    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            const found = conversations.find(c => c.id === parseInt(conversationId))
            if (found) selectConversation(found)
        }
    }, [conversationId, conversations])

    useEffect(() => {
        const token = localStorage.getItem('jwt')
        const client = new Client({
            brokerURL: 'ws://localhost:8083/ws',
            connectHeaders: { Authorization: `Bearer ${token}` },
        })
        client.onConnect = () => {
            setConnected(true)
            client.subscribe('/user/queue/messages', frame => {
                const msg = JSON.parse(frame.body)
                setMessages(prev =>
                    activeConvRef.current?.id === msg.conversationId ? [...prev, msg] : prev
                )
            })
        }
        client.onDisconnect = () => setConnected(false)
        client.activate()
        stompRef.current = client
        return () => client.deactivate()
    }, [])

    useEffect(() => { activeConvRef.current = activeConv }, [activeConv])
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

    const selectConversation = async (conv) => {
        setActiveConv(conv)
        const msgs = await api.getMessages(conv.id)
        setMessages(msgs)
    }

    const sendMessage = () => {
        if (!input.trim() || !activeConv || !connected) return
        stompRef.current.publish({
            destination: '/app/chat.send',
            body: JSON.stringify({ conversationId: activeConv.id, content: input.trim() })
        })
        setInput('')
    }

    const otherParty = conv => conv.buyerEmail === myEmail ? conv.sellerEmail : conv.buyerEmail

    const convCount = conversations.length
    const convLabel = convCount === 1 ? t('chat_conversation') : t('chat_conversations')

    return (
        <div className="chat-layout">
            {/* Sidebar */}
            <div className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <h2 style={{ fontSize: '16px', fontWeight: 700 }}>{t('chat_title')}</h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {convCount} {convLabel}
                    </p>
                </div>
                <div className="chat-list">
                    {convCount === 0 && (
                        <p style={{ padding: '20px 14px', fontSize: '13px', color: 'var(--text-dim)' }}>
                            {t('chat_empty_list')}
                        </p>
                    )}
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            className={`conv-item ${activeConv?.id === conv.id ? 'active' : ''}`}
                            onClick={() => selectConversation(conv)}
                        >
                            <div className="conv-title">{conv.adTitle}</div>
                            <div className="conv-party">{otherParty(conv)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main */}
            <div className="chat-main">
                {!activeConv ? (
                    <div className="chat-empty">
                        <i className="fa-regular fa-comment-dots" style={{ fontSize: 48, color: 'var(--text-dim)' }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{t('chat_select')}</p>
                    </div>
                ) : <>
                    <div className="chat-header">
                        <div>
                            <p style={{ fontWeight: 700, fontSize: '15px' }}>{activeConv.adTitle}</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {otherParty(activeConv)}
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: connected ? 'var(--success)' : 'var(--text-dim)' }}>
                            <span className={`status-dot ${connected ? 'online' : 'offline'}`} />
                            {connected ? t('chat_live') : t('chat_reconnecting')}
                        </div>
                    </div>

                    <div className="chat-messages">
                        {messages.map(msg => {
                            const mine = msg.senderEmail === myEmail
                            return (
                                <div key={msg.id}>
                                    <div className={`msg-row ${mine ? 'mine' : 'theirs'}`}>
                                        <div className={`bubble ${mine ? 'mine' : 'theirs'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                    <div className={`msg-time ${mine ? '' : 'theirs'}`}>
                                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={bottomRef} />
                    </div>

                    <div className="chat-input-bar">
                        <input
                            className="input"
                            style={{ flex: 1 }}
                            placeholder={t('chat_type_placeholder')}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={sendMessage}
                            disabled={!input.trim() || !connected}
                        >
                            <i className="fa-solid fa-paper-plane" />
                        </button>
                    </div>
                </>}
            </div>
        </div>
    )
}