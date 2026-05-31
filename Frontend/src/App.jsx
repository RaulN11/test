import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/Search'
import Results from './pages/Result.jsx'
import Sell from './pages/Sell'
import AdDetails from './pages/AdDetails.jsx'
import MyAds from './pages/MyAds.jsx'
import Chat from './pages/Chat'
import { LanguageProvider } from './context/LanguageContext'

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('jwt')
    if (!token) return <Navigate to="/login" />
    return children
}

export default function App() {
    return (
        <LanguageProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/ad/:id" element={<AdDetails />} />
                    <Route path="/sell" element={
                        <ProtectedRoute><Sell /></ProtectedRoute>
                    } />
                    <Route path="/my-ads" element={
                        <ProtectedRoute><MyAds /></ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/search" />} />
                    <Route path="/chat/:conversationId" element={
                        <ProtectedRoute><Chat /></ProtectedRoute>
                    } />
                    <Route path="/chat" element={
                        <ProtectedRoute><Chat /></ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </LanguageProvider>
    )
}