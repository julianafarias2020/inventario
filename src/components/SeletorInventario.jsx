import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from './ui/card'

const SeletorInventario = () => {
  const { user, inventarios, criarInventario, selecionarInventario, loading } = useAuth()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [novoInventario, setNovoInventario] = useState({
    nome: '',
    falecido_nome: '',
    falecido_data_obito: '',
    observacoes: ''
  })

  const handleCriarInventario = async (e) => {
    e.preventDefault()
    
    if (!novoInventario.nome.trim()) {
      alert('Nome do inventário é obrigatório')
      return
    }
    
    if (!novoInventario.falecido_nome.trim()) {
      alert('Nome do falecido é obrigatório')
      return
    }

    try {
      const result = await criarInventario(novoInventario)
      if (result.success) {
        alert('Inventário criado com sucesso!')
        setMostrarFormulario(false)
        setNovoInventario({
          nome: '',
          falecido_nome: '',
          falecido_data_obito: '',
          observacoes: ''
        })
      } else {
        alert('Erro ao criar inventário: ' + result.error)
      }
    } catch (error) {
      console.error('Erro ao criar inventário:', error)
      alert('Erro ao criar inventário: ' + error.message)
    }
  }

  const handleSelecionarInventario = (inventario) => {
    selecionarInventario(inventario)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">InventárioLegal</h1>
          <p className="text-gray-600">Bem-vindo, {user?.user_metadata?.nome || user?.email}</p>
        </div>

        {!mostrarFormulario ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Seus Inventários</CardTitle>
                <Button onClick={() => setMostrarFormulario(true)}>
                  Novo Inventário
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Carregando inventários...</div>
                </div>
              ) : inventarios.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">
                    Você ainda não possui inventários
                  </div>
                  <Button onClick={() => setMostrarFormulario(true)}>
                    Criar Primeiro Inventário
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventarios.map((inventario) => (
                    <div
                      key={inventario.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleSelecionarInventario(inventario)}
                    >
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {inventario.nome}
                      </h3>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Falecido:</span> {inventario.falecido_nome}
                        </div>
                        
                        {inventario.falecido_data_obito && (
                          <div>
                            <span className="font-medium">Data do Óbito:</span> {
                              new Date(inventario.falecido_data_obito).toLocaleDateString('pt-BR')
                            }
                          </div>
                        )}
                        
                        <div>
                          <span className="font-medium">Criado em:</span> {
                            new Date(inventario.created_at).toLocaleDateString('pt-BR')
                          }
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          Papel: {inventario.inventario_participantes?.[0]?.papel || 'Inventariante'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Criar Novo Inventário</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setMostrarFormulario(false)}
                >
                  Cancelar
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleCriarInventario} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Inventário *
                  </label>
                  <Input
                    type="text"
                    value={novoInventario.nome}
                    onChange={(e) => setNovoInventario({...novoInventario, nome: e.target.value})}
                    placeholder="Ex: Inventário de João Silva"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Falecido *
                  </label>
                  <Input
                    type="text"
                    value={novoInventario.falecido_nome}
                    onChange={(e) => setNovoInventario({...novoInventario, falecido_nome: e.target.value})}
                    placeholder="Nome completo do falecido"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data do Óbito
                  </label>
                  <Input
                    type="date"
                    value={novoInventario.falecido_data_obito}
                    onChange={(e) => setNovoInventario({...novoInventario, falecido_data_obito: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={novoInventario.observacoes}
                    onChange={(e) => setNovoInventario({...novoInventario, observacoes: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Observações sobre o inventário"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Inventário'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setMostrarFormulario(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default SeletorInventario

