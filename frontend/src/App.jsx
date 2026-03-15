import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
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
  const [activeTab, setActiveTab] = useState('Command')

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background-dark overflow-hidden">
        <div className="flex gap-2 items-center">
             <span className="size-3 bg-primary rounded-full animate-bounce shadow-[0_0_10px_#2536f4]" style={{ animationDelay: '0s' }}></span>
             <span className="size-3 bg-accent-cyan rounded-full animate-bounce shadow-[0_0_10px_#00f2ff]" style={{ animationDelay: '0.1s' }}></span>
             <span className="size-3 bg-accent-ultra rounded-full animate-bounce shadow-[0_0_10px_#7c3aed]" style={{ animationDelay: '0.2s' }}></span>
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-4 animate-pulse">Initializing Core...</p>
      </div>
    )
  }

  if (!showroom) return <LoginPage />

  const renderContent = () => {
    switch (activeTab) {
      case 'Command': return <Dashboard />
      case 'Alerts': return <SKUAnalytics />
      case 'Assets': return <Slotting />
      case 'System': return <DeadStock />
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
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  )
}
