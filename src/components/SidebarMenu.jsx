
import React from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { LogOut, Scale } from 'lucide-react'
import { getCorPerfil } from '../utils/formatar'

export default function SidebarMenu({
  user,
  inventarioAtivo,
  menuFiltrado,
  paginaAtiva,
  setPaginaAtiva,
  handleLogout
}) {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <Scale className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">InventárioLegal</h1>
            <p className="text-sm text-gray-600">Sistema Profissional</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.nome}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
            <Badge className={getCorPerfil(user?.perfil)}>
              {user?.perfil === 'inventariante' ? '👑 Inventariante' :
               user?.perfil === 'herdeiro' ? '👤 Herdeiro' :
               user?.perfil === 'advogado' ? '⚖️ Advogado' :
               user?.perfil === 'contador' ? '📊 Contador' : user?.perfil}
            </Badge>
            {inventarioAtivo && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600">Inventário:</p>
                <p className="text-sm font-medium text-gray-900">{inventarioAtivo.nome}</p>
                <p className="text-xs text-gray-600">Falecido: {inventarioAtivo.falecido}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="space-y-1">
          {menuFiltrado.map(item => {
            const Icone = item.icone
            const isAtivo = paginaAtiva === item.id

            return (
              <button
                key={item.id}
                onClick={() => setPaginaAtiva(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isAtivo 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icone className="h-5 w-5" />
                <span className="flex-1">{item.nome}</span>
                {!item.implementado && (
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                )}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto border-t pt-4">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
}
