import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { herdeiroService } from '../lib/supabase'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from './ui/card'

const Herdeiros = () => {
  const { inventarioAtivo } = useAuth()
  const [herdeiros, setHerdeiros] = useState([])
  const [loading, setLoading] = useState(false)
  const [editandoHerdeiro, setEditandoHerdeiro] = useState(null)
  const [novoHerdeiro, setNovoHerdeiro] = useState({
    nome: '',
    cpf: '',
    rg: '',
    telefone: '',
    email: '',
    endereco: '',
    tipo: 'legitimo',
    observacoes: ''
  })

  // Carregar herdeiros ao montar componente ou mudar inventário
  useEffect(() => {
    if (inventarioAtivo) {
      loadHerdeiros()
    }
  }, [inventarioAtivo])

  const loadHerdeiros = async () => {
    if (!inventarioAtivo) return
    
    try {
      setLoading(true)
      const data = await herdeiroService.getByInventario(inventarioAtivo.id)
      setHerdeiros(data)
    } catch (error) {
      console.error('Erro ao carregar herdeiros:', error)
      alert('Erro ao carregar herdeiros: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const validarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '')
    return cpfLimpo.length === 11
  }

  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const adicionarHerdeiro = async () => {
    if (!inventarioAtivo) {
      alert('Nenhum inventário selecionado')
      return
    }

    if (!novoHerdeiro.nome.trim()) {
      alert('Nome é obrigatório')
      return
    }

    if (!novoHerdeiro.cpf.trim()) {
      alert('CPF é obrigatório')
      return
    }

    if (!validarCPF(novoHerdeiro.cpf)) {
      alert('CPF inválido')
      return
    }

    if (novoHerdeiro.email && !validarEmail(novoHerdeiro.email)) {
      alert('Email inválido')
      return
    }

    try {
      setLoading(true)
      
      const dadosHerdeiro = {
        ...novoHerdeiro,
        inventario_id: inventarioAtivo.id,
        cpf: novoHerdeiro.cpf.replace(/\D/g, '') // Limpar CPF
      }

      if (editandoHerdeiro) {
        await herdeiroService.update(editandoHerdeiro.id, dadosHerdeiro)
        alert('Herdeiro atualizado com sucesso!')
      } else {
        await herdeiroService.create(dadosHerdeiro)
        alert('Herdeiro cadastrado com sucesso!')
      }

      // Limpar formulário
      setNovoHerdeiro({
        nome: '',
        cpf: '',
        rg: '',
        telefone: '',
        email: '',
        endereco: '',
        tipo: 'legitimo',
        observacoes: ''
      })
      setEditandoHerdeiro(null)

      // Recarregar lista
      await loadHerdeiros()
    } catch (error) {
      console.error('Erro ao salvar herdeiro:', error)
      alert('Erro ao salvar herdeiro: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const editarHerdeiro = (herdeiro) => {
    setNovoHerdeiro({
      nome: herdeiro.nome,
      cpf: herdeiro.cpf,
      rg: herdeiro.rg || '',
      telefone: herdeiro.telefone || '',
      email: herdeiro.email || '',
      endereco: herdeiro.endereco || '',
      tipo: herdeiro.tipo,
      observacoes: herdeiro.observacoes || ''
    })
    setEditandoHerdeiro(herdeiro)
  }

  const excluirHerdeiro = async (herdeiroId) => {
    if (!confirm('Tem certeza que deseja excluir este herdeiro?')) {
      return
    }

    try {
      setLoading(true)
      await herdeiroService.delete(herdeiroId)
      alert('Herdeiro excluído com sucesso!')
      await loadHerdeiros()
    } catch (error) {
      console.error('Erro ao excluir herdeiro:', error)
      alert('Erro ao excluir herdeiro: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const cancelarEdicao = () => {
    setNovoHerdeiro({
      nome: '',
      cpf: '',
      rg: '',
      telefone: '',
      email: '',
      endereco: '',
      tipo: 'legitimo',
      observacoes: ''
    })
    setEditandoHerdeiro(null)
  }

  if (!inventarioAtivo) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Selecione um inventário para gerenciar herdeiros
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Herdeiros</h1>
        <div className="text-sm text-gray-600">
          Inventário: {inventarioAtivo.nome}
        </div>
      </div>

      {/* Formulário de Cadastro */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editandoHerdeiro ? 'Editar Herdeiro' : 'Adicionar Herdeiro'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NOME *
              </label>
              <Input
                type="text"
                value={novoHerdeiro.nome}
                onChange={(e) => setNovoHerdeiro({...novoHerdeiro, nome: e.target.value})}
                placeholder="Nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF *
              </label>
              <Input
                type="text"
                value={novoHerdeiro.cpf}
                onChange={(e) => setNovoHerdeiro({...novoHerdeiro, cpf: e.target.value})}
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RG
              </label>
              <Input
                type="text"
                value={novoHerdeiro.rg}
                onChange={(e) => setNovoHerdeiro({...novoHerdeiro, rg: e.target.value})}
                placeholder="RG"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TELEFONE
              </label>
              <Input
                type="text"
                value={novoHerdeiro.telefone}
                onChange={(e) => setNovoHerdeiro({...novoHerdeiro, telefone: e.target.value})}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                EMAIL
              </label>
              <Input
                type="email"
                value={novoHerdeiro.email}
                onChange={(e) => setNovoHerdeiro({...novoHerdeiro, email: e.target.value})}
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ENDEREÇO
              </label>
              <Input
                type="text"
                value={novoHerdeiro.endereco}
                onChange={(e) => setNovoHerdeiro({...novoHerdeiro, endereco: e.target.value})}
                placeholder="Endereço completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={novoHerdeiro.tipo}
                onChange={(e) => setNovoHerdeiro({...novoHerdeiro, tipo: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="legitimo">Herdeiro Legítimo</option>
                <option value="meeira">Meeira</option>
                <option value="conjuge">Cônjuge</option>
                <option value="testamento">Por Testamento</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <Input
                type="text"
                value={novoHerdeiro.observacoes}
                onChange={(e) => setNovoHerdeiro({...novoHerdeiro, observacoes: e.target.value})}
                placeholder="Observações adicionais"
              />
            </div>

            <div className="md:col-span-3 flex gap-2">
              <Button
                onClick={adicionarHerdeiro}
                disabled={loading}
              >
                {loading ? 'Salvando...' : editandoHerdeiro ? 'Atualizar Herdeiro' : 'Salvar Herdeiro'}
              </Button>
              
              {editandoHerdeiro && (
                <Button
                  onClick={cancelarEdicao}
                  variant="secondary"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Herdeiros */}
      <Card>
        <CardHeader>
          <CardTitle>
            Herdeiros Cadastrados ({herdeiros.length})
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Carregando herdeiros...</div>
            </div>
          ) : herdeiros.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Nenhum herdeiro cadastrado</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {herdeiros.map((herdeiro) => (
                <div key={herdeiro.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {herdeiro.nome}
                    </h3>
                    <Badge variant="primary">
                      {herdeiro.tipo === 'legitimo' ? 'Legítimo' : 
                       herdeiro.tipo === 'meeira' ? 'Meeira' :
                       herdeiro.tipo === 'conjuge' ? 'Cônjuge' :
                       herdeiro.tipo === 'testamento' ? 'Testamento' : 'Outro'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="font-medium">CPF:</span>
                      <span className="ml-2">{herdeiro.cpf}</span>
                    </div>
                    
                    {herdeiro.rg && (
                      <div className="flex items-center">
                        <span className="font-medium">RG:</span>
                        <span className="ml-2">{herdeiro.rg}</span>
                      </div>
                    )}
                    
                    {herdeiro.telefone && (
                      <div className="flex items-center">
                        <span className="font-medium">Telefone:</span>
                        <span className="ml-2">{herdeiro.telefone}</span>
                      </div>
                    )}
                    
                    {herdeiro.email && (
                      <div className="flex items-center">
                        <span className="font-medium">Email:</span>
                        <span className="ml-2">{herdeiro.email}</span>
                      </div>
                    )}
                    
                    {herdeiro.endereco && (
                      <div className="flex items-center">
                        <span className="font-medium">Endereço:</span>
                        <span className="ml-2">{herdeiro.endereco}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={() => editarHerdeiro(herdeiro)}
                      size="sm"
                      className="flex-1"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => excluirHerdeiro(herdeiro.id)}
                      variant="danger"
                      size="sm"
                      className="flex-1"
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Herdeiros

