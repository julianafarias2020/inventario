import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Dashboard from './Dashboard'
import Herdeiros from './Herdeiros'
import CadastroBensAvancado from './CadastroBensAvancado'
import { Card, Button } from './ui/card'

// Componente temporário para módulos em desenvolvimento
const ModuloEmDesenvolvimento = ({ nome }) => (
  <div className="p-6">
    <Card>
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{nome}</h2>
        <p className="text-gray-600 mb-4">Este módulo está em desenvolvimento</p>
        <div className="text-sm text-gray-500">
          Em breve todas as funcionalidades estarão disponíveis
        </div>
      </div>
    </Card>
  </div>
)

const MainApp = () => {
  const { user, inventarioAtivo, signOut } = useAuth()
  const [moduloAtivo, setModuloAtivo] = useState('dashboard')

  const menuItems = [
    { id: 'dashboard', nome: 'Dashboard', icon: '📊', implementado: true },
    { id: 'herdeiros', nome: 'Herdeiros', icon: '👥', implementado: true },
    { id: 'bens', nome: 'Cadastro de Bens', icon: '🏠', implementado: true },
    { id: 'financeiro', nome: 'Fundo de Caixa', icon: '💰', implementado: false },
    { id: 'alugueis', nome: 'Controle de Aluguéis', icon: '🏢', implementado: false },
    { id: 'reparticao', nome: 'Repartição de Lucros', icon: '📈', implementado: false },
    { id: 'votacao', nome: 'Sistema de Votação', icon: '🗳️', implementado: false },
    { id: 'comentarios', nome: 'Comentários', icon: '💬', implementado: false },
    { id: 'anexos', nome: 'Sistema de Anexos', icon: '📎', implementado: false },
    { id: 'relatorios', nome: 'Relatórios Jurídicos', icon: '📋', implementado: false },
    { id: 'configuracoes', nome: 'Configurações', icon: '⚙️', implementado: false }
  ]

  const renderModulo = () => {
    switch (moduloAtivo) {
      case 'dashboard':
        return <Dashboard />
      case 'herdeiros':
        return <Herdeiros />
      case 'bens':
        return <CadastroBensAvancado />
      case 'financeiro':
        return <ModuloEmDesenvolvimento nome="Fundo de Caixa" />
      case 'alugueis':
        return <ModuloEmDesenvolvimento nome="Controle de Aluguéis" />
      case 'reparticao':
        return <ModuloEmDesenvolvimento nome="Repartição de Lucros" />
      case 'votacao':
        return <ModuloEmDesenvolvimento nome="Sistema de Votação" />
      case 'comentarios':
        return <ModuloEmDesenvolvimento nome="Comentários" />
      case 'anexos':
        return <ModuloEmDesenvolvimento nome="Sistema de Anexos" />
      case 'relatorios':
        return <ModuloEmDesenvolvimento nome="Relatórios Jurídicos" />
      case 'configuracoes':
        return <ModuloEmDesenvolvimento nome="Configurações" />
      default:
        return <Dashboard />
    }
  }

  const handleLogout = async () => {
    if (confirm('Tem certeza que deseja sair?')) {
      await signOut()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">InventárioLegal</h1>
          {inventarioAtivo && (
            <p className="text-sm text-gray-600 mt-1 truncate">
              {inventarioAtivo.nome}
            </p>
          )}
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setModuloAtivo(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    moduloAtivo === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.nome}</span>
                  {!item.implementado && (
                    <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Em breve
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Informações do usuário e logout */}
        <div className="absolute bottom-0 left-0 right-0 w-64 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.user_metadata?.nome || user?.email}
              </p>
              <p className="text-xs text-gray-500">
                {user?.user_metadata?.perfil || 'Usuário'}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="ml-2"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto pb-20">
        {renderModulo()}
      </div>
    </div>
  )
}

export default MainApp

