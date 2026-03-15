import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import SKUAnalytics from './pages/SKUAnalytics'
import DeadStock from './pages/DeadStock'
import Returns from './pages/Returns'
import Slotting from './pages/Slotting'
import { Loader2 } from 'lucide-react'

function AppContent() {
  const { showroom, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('Overview')

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <Loader2 size={28} className="text-indigo-400 animate-spin" />
      </div>
    )
  }

  if (!showroom) return <LoginPage />

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Dashboard />
      case 'SKU Analytics': return <SKUAnalytics />
      case 'Dead Stock': return <DeadStock />
      case 'Returns': return <Returns />
      case 'Slotting': return <Slotting />
      default: return <Dashboard />
    }
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
