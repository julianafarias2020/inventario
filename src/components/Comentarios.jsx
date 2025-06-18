import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  MessageSquare, 
  Reply, 
  Pin, 
  Clock, 
  User,
  AlertCircle,
  CheckCircle,
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react'

export default function Comentarios() {
  const [comentarios, setComentarios] = useState([
    {
      id: 1,
      modulo: 'bens',
      titulo: "Dúvida sobre avaliação do imóvel",
      conteudo: "Gostaria de entender melhor como foi feita a avaliação do imóvel da Rua das Flores. O valor parece estar acima do mercado.",
      autor: "Pedro Costa",
      data: "2024-01-20T10:30:00",
      status: "aberto",
      prioridade: "media",
      tags: ["avaliacao", "imovel"],
      fixado: false,
      respostas: [
        {
          id: 1,
          conteudo: "A avaliação foi feita por perito judicial conforme determinação do juiz. Posso enviar o laudo completo.",
          autor: "João Silva",
          data: "2024-01-20T14:15:00"
        },
        {
          id: 2,
          conteudo: "Seria interessante ter uma segunda opinião. Podemos solicitar nova avaliação?",
          autor: "Maria Santos",
          data: "2024-01-20T16:45:00"
        }
      ]
    },
    {
      id: 2,
      modulo: 'financeiro',
      titulo: "Proposta para distribuição dos aluguéis",
      conteudo: "Sugiro que os aluguéis de janeiro sejam mantidos no fundo para cobrir as despesas de IPTU que vencerão em março.",
      autor: "Maria Santos",
      data: "2024-01-19T09:15:00",
      status: "resolvido",
      prioridade: "alta",
      tags: ["alugueis", "iptu", "planejamento"],
      fixado: true,
      respostas: [
        {
          id: 1,
          conteudo: "Concordo com a proposta. É uma decisão prudente.",
          autor: "João Silva",
          data: "2024-01-19T11:30:00"
        },
        {
          id: 2,
          conteudo: "Perfeito! Vou criar uma votação para formalizar essa decisão.",
          autor: "Ana Lima",
          data: "2024-01-19T13:20:00"
        }
      ]
    },
    {
      id: 3,
      modulo: 'herdeiros',
      titulo: "Documentação pendente",
      conteudo: "Ainda estou providenciando a certidão de nascimento atualizada. Devo receber até sexta-feira.",
      autor: "Ana Lima",
      data: "2024-01-18T16:20:00",
      status: "em_andamento",
      prioridade: "baixa",
      tags: ["documentos", "certidao"],
      fixado: false,
      respostas: []
    }
  ])

  const [novoComentario, setNovoComentario] = useState({
    modulo: 'geral',
    titulo: '',
    conteudo: '',
    prioridade: 'media',
    tags: ''
  })

  const [filtros, setFiltros] = useState({
    modulo: 'todos',
    status: 'todos',
    prioridade: 'todas'
  })

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [comentarioSelecionado, setComentarioSelecionado] = useState(null)
  const [novaResposta, setNovaResposta] = useState('')

  const modulos = [
    { id: 'geral', nome: 'Geral' },
    { id: 'bens', nome: 'Cadastro de Bens' },
    { id: 'herdeiros', nome: 'Herdeiros' },
    { id: 'financeiro', nome: 'Financeiro' },
    { id: 'alugueis', nome: 'Aluguéis' },
    { id: 'votacao', nome: 'Votações' },
    { id: 'relatorios', nome: 'Relatórios' }
  ]

  const criarComentario = () => {
    if (!novoComentario.titulo || !novoComentario.conteudo) {
      alert('Preencha título e conteúdo')
      return
    }

    const comentario = {
      id: comentarios.length + 1,
      modulo: novoComentario.modulo,
      titulo: novoComentario.titulo,
      conteudo: novoComentario.conteudo,
      autor: "João Silva", // Simulado
      data: new Date().toISOString(),
      status: "aberto",
      prioridade: novoComentario.prioridade,
      tags: novoComentario.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      fixado: false,
      respostas: []
    }

    setComentarios(prev => [comentario, ...prev])
    setNovoComentario({
      modulo: 'geral',
      titulo: '',
      conteudo: '',
      prioridade: 'media',
      tags: ''
    })
    setMostrarFormulario(false)
  }

  const adicionarResposta = (comentarioId) => {
    if (!novaResposta.trim()) {
      alert('Digite uma resposta')
      return
    }

    setComentarios(prev => prev.map(comentario => {
      if (comentario.id === comentarioId) {
        const resposta = {
          id: comentario.respostas.length + 1,
          conteudo: novaResposta,
          autor: "João Silva", // Simulado
          data: new Date().toISOString()
        }
        return {
          ...comentario,
          respostas: [...comentario.respostas, resposta]
        }
      }
      return comentario
    }))

    setNovaResposta('')
  }

  const alterarStatus = (comentarioId, novoStatus) => {
    setComentarios(prev => prev.map(comentario => 
      comentario.id === comentarioId 
        ? { ...comentario, status: novoStatus }
        : comentario
    ))
  }

  const fixarComentario = (comentarioId) => {
    setComentarios(prev => prev.map(comentario => 
      comentario.id === comentarioId 
        ? { ...comentario, fixado: !comentario.fixado }
        : comentario
    ))
  }

  const getStatusBadge = (status) => {
    const configs = {
      aberto: { color: 'bg-blue-100 text-blue-800', icon: MessageSquare, text: 'Aberto' },
      em_andamento: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Em Andamento' },
      resolvido: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Resolvido' }
    }
    
    const config = configs[status] || configs.aberto
    const Icon = config.icon
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  const getPrioridadeBadge = (prioridade) => {
    const configs = {
      baixa: { color: 'bg-gray-100 text-gray-800', text: 'Baixa' },
      media: { color: 'bg-blue-100 text-blue-800', text: 'Média' },
      alta: { color: 'bg-red-100 text-red-800', text: 'Alta' }
    }
    
    const config = configs[prioridade] || configs.media
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    )
  }

  const comentariosFiltrados = comentarios.filter(comentario => {
    const filtroModulo = filtros.modulo === 'todos' || comentario.modulo === filtros.modulo
    const filtroStatus = filtros.status === 'todos' || comentario.status === filtros.status
    const filtroPrioridade = filtros.prioridade === 'todas' || comentario.prioridade === filtros.prioridade
    
    return filtroModulo && filtroStatus && filtroPrioridade
  })

  const comentariosFixados = comentariosFiltrados.filter(c => c.fixado)
  const comentariosNormais = comentariosFiltrados.filter(c => !c.fixado)

  const estatisticas = {
    total: comentarios.length,
    abertos: comentarios.filter(c => c.status === 'aberto').length,
    emAndamento: comentarios.filter(c => c.status === 'em_andamento').length,
    resolvidos: comentarios.filter(c => c.status === 'resolvido').length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comentários</h1>
          <p className="text-gray-600">Comunicação e discussões sobre o inventário</p>
        </div>
        <Button onClick={() => setMostrarFormulario(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Comentário
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Abertos</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.abertos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.emAndamento}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolvidos</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.resolvidos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="filtro-modulo">Módulo</Label>
              <select
                id="filtro-modulo"
                value={filtros.modulo}
                onChange={(e) => setFiltros(prev => ({ ...prev, modulo: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="todos">Todos os módulos</option>
                {modulos.map(modulo => (
                  <option key={modulo.id} value={modulo.id}>{modulo.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="filtro-status">Status</Label>
              <select
                id="filtro-status"
                value={filtros.status}
                onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="todos">Todos os status</option>
                <option value="aberto">Aberto</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="resolvido">Resolvido</option>
              </select>
            </div>

            <div>
              <Label htmlFor="filtro-prioridade">Prioridade</Label>
              <select
                id="filtro-prioridade"
                value={filtros.prioridade}
                onChange={(e) => setFiltros(prev => ({ ...prev, prioridade: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="todas">Todas as prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Novo Comentário */}
      {mostrarFormulario && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Comentário</CardTitle>
            <CardDescription>Inicie uma nova discussão ou faça uma pergunta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="modulo">Módulo</Label>
                <select
                  id="modulo"
                  value={novoComentario.modulo}
                  onChange={(e) => setNovoComentario(prev => ({ ...prev, modulo: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {modulos.map(modulo => (
                    <option key={modulo.id} value={modulo.id}>{modulo.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <select
                  id="prioridade"
                  value={novoComentario.prioridade}
                  onChange={(e) => setNovoComentario(prev => ({ ...prev, prioridade: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={novoComentario.titulo}
                onChange={(e) => setNovoComentario(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Título do comentário ou pergunta"
              />
            </div>

            <div>
              <Label htmlFor="conteudo">Conteúdo</Label>
              <Textarea
                id="conteudo"
                value={novoComentario.conteudo}
                onChange={(e) => setNovoComentario(prev => ({ ...prev, conteudo: e.target.value }))}
                placeholder="Descreva sua dúvida, sugestão ou comentário..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={novoComentario.tags}
                onChange={(e) => setNovoComentario(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Ex: avaliacao, imovel, urgente"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={criarComentario}>Criar Comentário</Button>
              <Button variant="outline" onClick={() => setMostrarFormulario(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Comentários */}
      <div className="space-y-4">
        {/* Comentários Fixados */}
        {comentariosFixados.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Pin className="h-5 w-5" />
              Comentários Fixados
            </h3>
            {comentariosFixados.map(comentario => (
              <ComentarioCard 
                key={comentario.id} 
                comentario={comentario}
                modulos={modulos}
                onAlterarStatus={alterarStatus}
                onFixar={fixarComentario}
                onAdicionarResposta={adicionarResposta}
                novaResposta={novaResposta}
                setNovaResposta={setNovaResposta}
                getStatusBadge={getStatusBadge}
                getPrioridadeBadge={getPrioridadeBadge}
              />
            ))}
          </div>
        )}

        {/* Comentários Normais */}
        {comentariosNormais.length > 0 ? (
          <div className="space-y-4">
            {comentariosFixados.length > 0 && (
              <h3 className="text-lg font-semibold text-gray-900">Outros Comentários</h3>
            )}
            {comentariosNormais.map(comentario => (
              <ComentarioCard 
                key={comentario.id} 
                comentario={comentario}
                modulos={modulos}
                onAlterarStatus={alterarStatus}
                onFixar={fixarComentario}
                onAdicionarResposta={adicionarResposta}
                novaResposta={novaResposta}
                setNovaResposta={setNovaResposta}
                getStatusBadge={getStatusBadge}
                getPrioridadeBadge={getPrioridadeBadge}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-medium">Nenhum comentário encontrado</p>
                <p className="text-sm">Ajuste os filtros ou crie um novo comentário</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Componente para cada comentário
function ComentarioCard({ 
  comentario, 
  modulos, 
  onAlterarStatus, 
  onFixar, 
  onAdicionarResposta,
  novaResposta,
  setNovaResposta,
  getStatusBadge,
  getPrioridadeBadge
}) {
  const [mostrarRespostas, setMostrarRespostas] = useState(false)
  const [mostrarFormResposta, setMostrarFormResposta] = useState(false)

  const moduloNome = modulos.find(m => m.id === comentario.modulo)?.nome || comentario.modulo

  return (
    <Card className={comentario.fixado ? 'border-yellow-300 bg-yellow-50' : ''}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {comentario.fixado && <Pin className="h-4 w-4 text-yellow-600" />}
              <h3 className="text-lg font-semibold">{comentario.titulo}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{comentario.autor}</span>
              <span>•</span>
              <span>{new Date(comentario.data).toLocaleDateString('pt-BR')}</span>
              <span>•</span>
              <span>{moduloNome}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(comentario.status)}
            {getPrioridadeBadge(comentario.prioridade)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700">{comentario.conteudo}</p>

        {comentario.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {comentario.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarRespostas(!mostrarRespostas)}
            >
              <Reply className="h-4 w-4 mr-1" />
              {comentario.respostas.length} respostas
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarFormResposta(!mostrarFormResposta)}
            >
              Responder
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={comentario.status}
              onChange={(e) => onAlterarStatus(comentario.id, e.target.value)}
              className="text-xs p-1 border border-gray-300 rounded"
            >
              <option value="aberto">Aberto</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="resolvido">Resolvido</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFixar(comentario.id)}
            >
              <Pin className={`h-4 w-4 ${comentario.fixado ? 'text-yellow-600' : 'text-gray-400'}`} />
            </Button>
          </div>
        </div>

        {/* Formulário de Resposta */}
        {mostrarFormResposta && (
          <div className="border-t pt-4 space-y-2">
            <Textarea
              value={novaResposta}
              onChange={(e) => setNovaResposta(e.target.value)}
              placeholder="Digite sua resposta..."
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  onAdicionarResposta(comentario.id)
                  setMostrarFormResposta(false)
                }}
              >
                Enviar Resposta
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMostrarFormResposta(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Lista de Respostas */}
        {mostrarRespostas && comentario.respostas.length > 0 && (
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-medium text-sm text-gray-900">Respostas:</h4>
            {comentario.respostas.map(resposta => (
              <div key={resposta.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                  <User className="h-3 w-3" />
                  <span>{resposta.autor}</span>
                  <span>•</span>
                  <span>{new Date(resposta.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <p className="text-sm text-gray-700">{resposta.conteudo}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

