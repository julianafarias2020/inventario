import React from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import SeletorInventario from './components/SeletorInventario'
import MainApp from './components/MainApp'
import './App.css'

function AppContent() {
  const { user, inventarioAtivo, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não está logado, mostra tela de login
  if (!user) {
    return <Login />
  }

  // Se está logado mas não tem inventário ativo, mostra seletor
  if (!inventarioAtivo) {
    return <SeletorInventario />
  }

  // Se está logado e tem inventário ativo, mostra aplicação principal
  return <MainApp />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

