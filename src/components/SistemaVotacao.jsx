import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Button } from '../components/ui/button'
import { Checkbox } from '../components/ui/checkbox'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { Vote, Users, Clock, CheckCircle, AlertCircle, Plus, X } from 'lucide-react'

export default function SistemaVotacao() {
  const { user, inventarioAtivo } = useAuth()
  const [votacoes, setVotacoes] = useState([])
  const [herdeiros, setHerdeiros] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const [novaVotacao, setNovaVotacao] = useState({
    titulo: '',
    descricao: '',
    tipo: 'maioria_simples', // maioria_simples, maioria_absoluta, unanimidade
    opcoes: ['Sim', 'Não'],
    participantesSelecionados: [],
    prazo: ''
  })

  // Carregar dados do localStorage
  useEffect(() => {
    const inventarioId = inventarioAtivo?.id || 'default'
    
    const votacoesSalvas = localStorage.getItem(`votacoes_${inventarioId}`)
    if (votacoesSalvas) {
      setVotacoes(JSON.parse(votacoesSalvas))
    } else {
      setVotacoes([])
    }
    
    const herdeirosSalvos = localStorage.getItem(`herdeiros_${inventarioId}`)
    if (herdeirosSalvos) {
      setHerdeiros(JSON.parse(herdeirosSalvos))
    } else {
      setHerdeiros([])
    }
  }, [inventarioAtivo])

  // Salvar votações no localStorage
  useEffect(() => {
    const inventarioId = inventarioAtivo?.id || 'default'
    localStorage.setItem(`votacoes_${inventarioId}`, JSON.stringify(votacoes))
  }, [votacoes, inventarioAtivo])

  const toggleParticipante = (herdeiroId) => {
    setNovaVotacao(prev => ({
      ...prev,
      participantesSelecionados: prev.participantesSelecionados.includes(herdeiroId)
        ? prev.participantesSelecionados.filter(id => id !== herdeiroId)
        : [...prev.participantesSelecionados, herdeiroId]
    }))
  }

  const adicionarOpcao = () => {
    setNovaVotacao(prev => ({
      ...prev,
      opcoes: [...prev.opcoes, '']
    }))
  }

  const removerOpcao = (index) => {
    if (novaVotacao.opcoes.length > 2) {
      setNovaVotacao(prev => ({
        ...prev,
        opcoes: prev.opcoes.filter((_, i) => i !== index)
      }))
    }
  }

  const atualizarOpcao = (index, valor) => {
    setNovaVotacao(prev => ({
      ...prev,
      opcoes: prev.opcoes.map((opcao, i) => i === index ? valor : opcao)
    }))
  }

  const criarVotacao = () => {
    if (!novaVotacao.titulo.trim()) {
      alert('Título é obrigatório')
      return
    }

    if (novaVotacao.participantesSelecionados.length === 0) {
      alert('Selecione pelo menos um participante')
      return
    }

    if (novaVotacao.opcoes.some(opcao => !opcao.trim())) {
      alert('Todas as opções devem ser preenchidas')
      return
    }

    const votacao = {
      id: Date.now().toString(),
      ...novaVotacao,
      criadorId: user?.id,
      criadorNome: user?.nome || user?.name,
      criadaEm: new Date().toISOString(),
      status: 'ativa',
      votos: {},
      resultado: null
    }

    setVotacoes([...votacoes, votacao])
    
    // Resetar formulário
    setNovaVotacao({
      titulo: '',
      descricao: '',
      tipo: 'maioria_simples',
      opcoes: ['Sim', 'Não'],
      participantesSelecionados: [],
      prazo: ''
    })
    setMostrarFormulario(false)
  }

  const votar = (votacaoId, opcaoEscolhida, justificativa = '') => {
    setVotacoes(votacoes.map(votacao => {
      if (votacao.id === votacaoId) {
        const novosVotos = {
          ...votacao.votos,
          [user.id]: {
            opcao: opcaoEscolhida,
            justificativa,
            dataVoto: new Date().toISOString(),
            nomeVotante: user?.nome || user?.name
          }
        }

        // Verificar se votação está completa
        const totalParticipantes = votacao.participantesSelecionados.length
        const totalVotos = Object.keys(novosVotos).length
        
        let novoStatus = votacao.status
        let resultado = null

        if (totalVotos === totalParticipantes) {
          // Calcular resultado
          const contagemVotos = {}
          Object.values(novosVotos).forEach(voto => {
            contagemVotos[voto.opcao] = (contagemVotos[voto.opcao] || 0) + 1
          })

          const opcaoVencedora = Object.entries(contagemVotos)
            .sort(([,a], [,b]) => b - a)[0]

          const votosVencedora = opcaoVencedora[1]
          
          switch (votacao.tipo) {
            case 'maioria_simples':
              resultado = opcaoVencedora[0]
              novoStatus = 'finalizada'
              break
            case 'maioria_absoluta':
              if (votosVencedora > totalParticipantes / 2) {
                resultado = opcaoVencedora[0]
                novoStatus = 'finalizada'
              } else {
                resultado = 'Sem maioria absoluta'
                novoStatus = 'finalizada'
              }
              break
            case 'unanimidade':
              if (votosVencedora === totalParticipantes) {
                resultado = opcaoVencedora[0]
                novoStatus = 'finalizada'
              } else {
                resultado = 'Sem unanimidade'
                novoStatus = 'finalizada'
              }
              break
          }
        }

        return {
          ...votacao,
          votos: novosVotos,
          status: novoStatus,
          resultado
        }
      }
      return votacao
    }))
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ativa':
        return <Badge className="bg-green-100 text-green-800"><Clock className="w-3 h-3 mr-1" />Ativa</Badge>
      case 'finalizada':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Finalizada</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>
    }
  }

  const getTipoBadge = (tipo) => {
    const tipos = {
      'maioria_simples': 'Maioria Simples',
      'maioria_absoluta': 'Maioria Absoluta',
      'unanimidade': 'Unanimidade'
    }
    return tipos[tipo] || tipo
  }

  const podeVotar = (votacao) => {
    return votacao.status === 'ativa' && 
           votacao.participantesSelecionados.includes(user?.id) &&
           !votacao.votos[user?.id]
  }

  const jaVotou = (votacao) => {
    return !!votacao.votos[user?.id]
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Votação</h1>
          <p className="text-gray-600">Decisões colaborativas do espólio</p>
        </div>
        <Button onClick={() => setMostrarFormulario(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Votação
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Vote className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Votações</p>
                <p className="text-2xl font-bold text-gray-900">{votacoes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Votações Ativas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {votacoes.filter(v => v.status === 'ativa').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Participantes</p>
                <p className="text-2xl font-bold text-gray-900">{herdeiros.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário de Nova Votação */}
      {mostrarFormulario && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Votação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título da Votação</Label>
              <Input
                id="titulo"
                value={novaVotacao.titulo}
                onChange={(e) => setNovaVotacao(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Ex: Aprovação da venda do imóvel"
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={novaVotacao.descricao}
                onChange={(e) => setNovaVotacao(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva os detalhes da votação..."
              />
            </div>

            <div>
              <Label htmlFor="tipo">Tipo de Votação</Label>
              <select
                id="tipo"
                value={novaVotacao.tipo}
                onChange={(e) => setNovaVotacao(prev => ({ ...prev, tipo: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="maioria_simples">Maioria Simples</option>
                <option value="maioria_absoluta">Maioria Absoluta (50% + 1)</option>
                <option value="unanimidade">Unanimidade</option>
              </select>
            </div>

            <div>
              <Label>Opções de Voto</Label>
              {novaVotacao.opcoes.map((opcao, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={opcao}
                    onChange={(e) => atualizarOpcao(index, e.target.value)}
                    placeholder={`Opção ${index + 1}`}
                  />
                  {novaVotacao.opcoes.length > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removerOpcao(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={adicionarOpcao}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Opção
              </Button>
            </div>

            <div>
              <Label>Participantes</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {herdeiros.map(herdeiro => (
                  <div key={herdeiro.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`herdeiro-${herdeiro.id}`}
                      checked={novaVotacao.participantesSelecionados.includes(herdeiro.id)}
                      onCheckedChange={() => toggleParticipante(herdeiro.id)}
                    />
                    <Label htmlFor={`herdeiro-${herdeiro.id}`}>{herdeiro.nome}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="prazo">Prazo (opcional)</Label>
              <Input
                id="prazo"
                type="datetime-local"
                value={novaVotacao.prazo}
                onChange={(e) => setNovaVotacao(prev => ({ ...prev, prazo: e.target.value }))}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={criarVotacao} className="flex-1">
                Criar Votação
              </Button>
              <Button
                variant="outline"
                onClick={() => setMostrarFormulario(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Votações */}
      <div className="space-y-4">
        {votacoes.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma votação criada ainda</p>
              <p className="text-sm text-gray-500">Clique em "Nova Votação" para começar</p>
            </CardContent>
          </Card>
        ) : (
          votacoes.map(votacao => (
            <Card key={votacao.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{votacao.titulo}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{votacao.descricao}</p>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(votacao.status)}
                    <Badge variant="outline">{getTipoBadge(votacao.tipo)}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Criada por: {votacao.criadorNome} em {new Date(votacao.criadaEm).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Participantes: {votacao.participantesSelecionados.length} | 
                      Votos: {Object.keys(votacao.votos).length}
                    </p>
                  </div>

                  {/* Opções de Voto */}
                  {podeVotar(votacao) && (
                    <div className="border-t pt-4">
                      <p className="font-medium mb-2">Escolha sua opção:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {votacao.opcoes.map((opcao, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => {
                              const justificativa = prompt('Justificativa (opcional):')
                              votar(votacao.id, opcao, justificativa || '')
                            }}
                          >
                            {opcao}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resultado */}
                  {votacao.status === 'finalizada' && votacao.resultado && (
                    <div className="border-t pt-4">
                      <p className="font-medium text-green-700">
                        Resultado: {votacao.resultado}
                      </p>
                    </div>
                  )}

                  {/* Votos */}
                  {Object.keys(votacao.votos).length > 0 && (
                    <div className="border-t pt-4">
                      <p className="font-medium mb-2">Votos registrados:</p>
                      <div className="space-y-2">
                        {Object.entries(votacao.votos).map(([userId, voto]) => (
                          <div key={userId} className="text-sm bg-gray-50 p-2 rounded">
                            <p><strong>{voto.nomeVotante}:</strong> {voto.opcao}</p>
                            {voto.justificativa && (
                              <p className="text-gray-600 italic">"{voto.justificativa}"</p>
                            )}
                            <p className="text-xs text-gray-500">
                              {new Date(voto.dataVoto).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {jaVotou(votacao) && votacao.status === 'ativa' && (
                    <div className="text-center text-green-600">
                      <CheckCircle className="w-5 h-5 inline mr-2" />
                      Você já votou nesta votação
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

