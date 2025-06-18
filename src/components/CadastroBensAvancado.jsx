import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { bemService, herdeiroService } from '../lib/supabase'
import { organogramaBens } from '../data/organogramaBens'

const CadastroBensAvancado = () => {
  const { inventarioAtivo } = useAuth()
  const [bens, setBens] = useState([])
  const [herdeiros, setHerdeiros] = useState([])
  const [loading, setLoading] = useState(false)
  const [editandoBem, setEditandoBem] = useState(null)
  
  const [novoBem, setNovoBem] = useState({
    nome: '',
    tipo: '',
    categoria: '',
    subcategoria: '',
    descricao: '',
    valor_avaliacao: '',
    data_avaliacao: '',
    endereco: '',
    matricula: '',
    registro: '',
    observacoes: ''
  })

  const [percentuais, setPercentuais] = useState([])
  const [opcoesNivel2, setOpcoesNivel2] = useState([])
  const [opcoesNivel3, setOpcoesNivel3] = useState([])

  // Carregar dados ao montar componente
  useEffect(() => {
    if (inventarioAtivo) {
      loadBens()
      loadHerdeiros()
    }
  }, [inventarioAtivo])

  // Atualizar opções de nível 2 quando categoria muda
  useEffect(() => {
    if (novoBem.categoria) {
      const categoria = organogramaBens.find(cat => cat.nome === novoBem.categoria)
      setOpcoesNivel2(categoria ? categoria.subcategorias : [])
      setNovoBem(prev => ({ ...prev, subcategoria: '', tipo: '' }))
    }
  }, [novoBem.categoria])

  // Atualizar opções de nível 3 quando subcategoria muda
  useEffect(() => {
    if (novoBem.subcategoria) {
      const categoria = organogramaBens.find(cat => cat.nome === novoBem.categoria)
      const subcategoria = categoria?.subcategorias.find(sub => sub.nome === novoBem.subcategoria)
      setOpcoesNivel3(subcategoria ? subcategoria.tipos : [])
      setNovoBem(prev => ({ ...prev, tipo: '' }))
    }
  }, [novoBem.subcategoria])

  const loadBens = async () => {
    if (!inventarioAtivo) return
    
    try {
      setLoading(true)
      const data = await bemService.getByInventario(inventarioAtivo.id)
      setBens(data)
    } catch (error) {
      console.error('Erro ao carregar bens:', error)
      alert('Erro ao carregar bens: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadHerdeiros = async () => {
    if (!inventarioAtivo) return
    
    try {
      const data = await herdeiroService.getByInventario(inventarioAtivo.id)
      setHerdeiros(data)
      
      // Inicializar percentuais com todos os herdeiros
      setPercentuais(data.map(herdeiro => ({
        herdeiro_id: herdeiro.id,
        nome: herdeiro.nome,
        percentual: 0,
        observacoes: ''
      })))
    } catch (error) {
      console.error('Erro ao carregar herdeiros:', error)
    }
  }

  const adicionarBem = async () => {
    if (!inventarioAtivo) {
      alert('Nenhum inventário selecionado')
      return
    }

    if (!novoBem.nome.trim()) {
      alert('Nome do bem é obrigatório')
      return
    }

    if (!novoBem.categoria) {
      alert('Categoria é obrigatória')
      return
    }

    // Validar percentuais
    const totalPercentual = percentuais.reduce((total, p) => total + parseFloat(p.percentual || 0), 0)
    if (totalPercentual > 100) {
      alert('Total de percentuais não pode exceder 100%')
      return
    }

    try {
      setLoading(true)
      
      const dadosBem = {
        ...novoBem,
        inventario_id: inventarioAtivo.id,
        valor_avaliacao: novoBem.valor_avaliacao ? parseFloat(novoBem.valor_avaliacao) : null,
        data_avaliacao: novoBem.data_avaliacao || null
      }

      let bemSalvo
      if (editandoBem) {
        bemSalvo = await bemService.update(editandoBem.id, dadosBem)
        alert('Bem atualizado com sucesso!')
      } else {
        bemSalvo = await bemService.create(dadosBem)
        alert('Bem cadastrado com sucesso!')
      }

      // Salvar percentuais dos herdeiros
      const percentuaisParaSalvar = percentuais.filter(p => parseFloat(p.percentual || 0) > 0)
      if (percentuaisParaSalvar.length > 0) {
        await bemService.setPercentuais(bemSalvo.id, percentuaisParaSalvar)
      }

      // Limpar formulário
      resetForm()
      
      // Recarregar lista
      await loadBens()
    } catch (error) {
      console.error('Erro ao salvar bem:', error)
      alert('Erro ao salvar bem: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const editarBem = async (bem) => {
    setNovoBem({
      nome: bem.nome,
      tipo: bem.tipo || '',
      categoria: bem.categoria,
      subcategoria: bem.subcategoria || '',
      descricao: bem.descricao || '',
      valor_avaliacao: bem.valor_avaliacao || '',
      data_avaliacao: bem.data_avaliacao || '',
      endereco: bem.endereco || '',
      matricula: bem.matricula || '',
      registro: bem.registro || '',
      observacoes: bem.observacoes || ''
    })
    setEditandoBem(bem)

    // Carregar percentuais existentes
    try {
      const percentuaisExistentes = await bemService.getPercentuais(bem.id)
      const novosPercentuais = herdeiros.map(herdeiro => {
        const percentualExistente = percentuaisExistentes.find(p => p.herdeiro_id === herdeiro.id)
        return {
          herdeiro_id: herdeiro.id,
          nome: herdeiro.nome,
          percentual: percentualExistente ? percentualExistente.percentual : 0,
          observacoes: percentualExistente ? percentualExistente.observacoes : ''
        }
      })
      setPercentuais(novosPercentuais)
    } catch (error) {
      console.error('Erro ao carregar percentuais:', error)
    }
  }

  const resetForm = () => {
    setNovoBem({
      nome: '',
      tipo: '',
      categoria: '',
      subcategoria: '',
      descricao: '',
      valor_avaliacao: '',
      data_avaliacao: '',
      endereco: '',
      matricula: '',
      registro: '',
      observacoes: ''
    })
    setEditandoBem(null)
    setPercentuais(herdeiros.map(herdeiro => ({
      herdeiro_id: herdeiro.id,
      nome: herdeiro.nome,
      percentual: 0,
      observacoes: ''
    })))
  }

  const atualizarPercentual = (herdeiroId, campo, valor) => {
    setPercentuais(prev => prev.map(p => 
      p.herdeiro_id === herdeiroId 
        ? { ...p, [campo]: valor }
        : p
    ))
  }

  const totalPercentual = percentuais.reduce((total, p) => total + parseFloat(p.percentual || 0), 0)

  if (!inventarioAtivo) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Selecione um inventário para gerenciar bens
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cadastro de Bens</h1>
        <div className="text-sm text-gray-600">
          Inventário: {inventarioAtivo.nome}
        </div>
      </div>

      {/* Formulário de Cadastro */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          {editandoBem ? 'Editar Bem' : 'Adicionar Bem'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Bem *
            </label>
            <input
              type="text"
              value={novoBem.nome}
              onChange={(e) => setNovoBem({...novoBem, nome: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Nome do bem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              value={novoBem.categoria}
              onChange={(e) => setNovoBem({...novoBem, categoria: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione uma categoria</option>
              {organogramaBens.map((categoria) => (
                <option key={categoria.nome} value={categoria.nome}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategoria
            </label>
            <select
              value={novoBem.subcategoria}
              onChange={(e) => setNovoBem({...novoBem, subcategoria: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={!novoBem.categoria}
            >
              <option value="">Selecione uma subcategoria</option>
              {opcoesNivel2.map((sub) => (
                <option key={sub.nome} value={sub.nome}>
                  {sub.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={novoBem.tipo}
              onChange={(e) => setNovoBem({...novoBem, tipo: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={!novoBem.subcategoria}
            >
              <option value="">Selecione um tipo</option>
              {opcoesNivel3.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor de Avaliação
            </label>
            <input
              type="number"
              step="0.01"
              value={novoBem.valor_avaliacao}
              onChange={(e) => setNovoBem({...novoBem, valor_avaliacao: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data da Avaliação
            </label>
            <input
              type="date"
              value={novoBem.data_avaliacao}
              onChange={(e) => setNovoBem({...novoBem, data_avaliacao: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={novoBem.descricao}
              onChange={(e) => setNovoBem({...novoBem, descricao: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Descrição detalhada do bem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <input
              type="text"
              value={novoBem.endereco}
              onChange={(e) => setNovoBem({...novoBem, endereco: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Endereço (se aplicável)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula
            </label>
            <input
              type="text"
              value={novoBem.matricula}
              onChange={(e) => setNovoBem({...novoBem, matricula: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Número da matrícula"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registro
            </label>
            <input
              type="text"
              value={novoBem.registro}
              onChange={(e) => setNovoBem({...novoBem, registro: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Número do registro"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <input
              type="text"
              value={novoBem.observacoes}
              onChange={(e) => setNovoBem({...novoBem, observacoes: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Observações adicionais"
            />
          </div>
        </div>

        {/* Percentuais dos Herdeiros */}
        {herdeiros.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              Percentuais dos Herdeiros
              <span className={`ml-2 text-sm ${totalPercentual > 100 ? 'text-red-600' : 'text-gray-600'}`}>
                (Total: {totalPercentual.toFixed(2)}%)
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {percentuais.map((percentual) => (
                <div key={percentual.herdeiro_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="font-medium text-gray-900 mb-2">
                    {percentual.nome}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Percentual (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={percentual.percentual}
                        onChange={(e) => atualizarPercentual(percentual.herdeiro_id, 'percentual', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Observações
                      </label>
                      <input
                        type="text"
                        value={percentual.observacoes}
                        onChange={(e) => atualizarPercentual(percentual.herdeiro_id, 'observacoes', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Obs."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-6">
          <button
            onClick={adicionarBem}
            disabled={loading || totalPercentual > 100}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : editandoBem ? 'Atualizar Bem' : 'Salvar Bem'}
          </button>
          
          {editandoBem && (
            <button
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Lista de Bens */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Bens Cadastrados ({bens.length})
          </h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="text-gray-500">Carregando bens...</div>
          </div>
        ) : bens.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-gray-500">Nenhum bem cadastrado</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bens.map((bem) => (
                  <tr key={bem.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{bem.nome}</div>
                      {bem.descricao && (
                        <div className="text-sm text-gray-500">{bem.descricao}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {bem.categoria}
                      {bem.subcategoria && (
                        <div className="text-xs text-gray-500">{bem.subcategoria}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {bem.valor_avaliacao ? 
                        `R$ ${parseFloat(bem.valor_avaliacao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => editarBem(bem)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default CadastroBensAvancado

