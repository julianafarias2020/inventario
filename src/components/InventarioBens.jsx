import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Checkbox } from './ui/checkbox'
import { 
  Home, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  FileText,
  Camera,
  Upload,
  Download,
  Eye,
  Car,
  Building,
  DollarSign,
  AlertTriangle,
  MapPin,
  Calendar,
  Users,
  Percent,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Image,
  Paperclip
} from 'lucide-react'

export default function InventarioBens() {
  const { inventarioAtivo } = useAuth()
  const [bens, setBens] = useState([])
  const [herdeiros, setHerdeiros] = useState([])
  const [filtros, setFiltros] = useState({
    busca: '',
    tipo: '',
    situacao: ''
  })
  const [modalAberto, setModalAberto] = useState(false)
  const [bemEditando, setBemEditando] = useState(null)
  const [modalAnexos, setModalAnexos] = useState(false)
  const [bemAnexos, setBemAnexos] = useState(null)
  const [modalPercentuais, setModalPercentuais] = useState(false)
  const [bemPercentuais, setBemPercentuais] = useState(null)
  const [modalFotos, setModalFotos] = useState(false)
  const [bemFotos, setBemFotos] = useState(null)

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Imóvel',
    categoria: '',
    endereco: '',
    valorAvaliado: '',
    valorVenda: '',
    situacao: 'regular',
    tags: '',
    observacoes: '',
    percentuaisHerdeiros: [],
    fotos: [],
    documentos: {
      escritura: { possui: false, arquivo: null },
      matricula: { possui: false, arquivo: null },
      certidoes: { possui: false, arquivo: null },
      outros: { possui: false, arquivo: null }
    }
  })

  const categoriasPorTipo = {
    'Imóvel': ['Residencial', 'Comercial', 'Rural', 'Terreno', 'Apartamento', 'Casa', 'Sala Comercial', 'Galpão'],
    'Veículo': ['Carro', 'Moto', 'Caminhão', 'Ônibus', 'Barco', 'Aeronave'],
    'Móvel/Bem': ['Móveis', 'Eletrodomésticos', 'Eletrônicos', 'Joias', 'Arte', 'Coleções'],
    'Financeiro': ['Conta Corrente', 'Poupança', 'Investimentos', 'Ações', 'Títulos', 'Criptomoedas']
  }

  const situacoesBem = [
    { valor: 'regular', label: 'Regular', cor: 'bg-green-100 text-green-800', icone: CheckCircle },
    { valor: 'em_disputa', label: 'Em Disputa', cor: 'bg-red-100 text-red-800', icone: AlertTriangle },
    { valor: 'sem_documentacao', label: 'Sem Documentação', cor: 'bg-yellow-100 text-yellow-800', icone: FileText },
    { valor: 'em_regularizacao', label: 'Em Regularização', cor: 'bg-blue-100 text-blue-800', icone: Clock },
    { valor: 'nao_localizado', label: 'Não Localizado', cor: 'bg-gray-100 text-gray-800', icone: XCircle },
    { valor: 'penhora_bloqueio', label: 'Penhora/Bloqueio', cor: 'bg-purple-100 text-purple-800', icone: Shield }
  ]

  const tiposBem = [
    { valor: 'Imóvel', icone: Home, cor: 'text-blue-600' },
    { valor: 'Veículo', icone: Car, cor: 'text-green-600' },
    { valor: 'Móvel/Bem', icone: Building, cor: 'text-purple-600' },
    { valor: 'Financeiro', icone: DollarSign, cor: 'text-yellow-600' }
  ]

  useEffect(() => {
    if (inventarioAtivo) {
      carregarDados()
    }
  }, [inventarioAtivo])

  const carregarDados = () => {
    if (!inventarioAtivo) return
    
    const inventarioId = inventarioAtivo.id
    const dadosBens = JSON.parse(localStorage.getItem(`bens_${inventarioId}`) || '[]')
    const dadosHerdeiros = JSON.parse(localStorage.getItem(`herdeiros_${inventarioId}`) || '[]')
    
    setBens(dadosBens)
    setHerdeiros(dadosHerdeiros)
  }

  const salvarBens = (novosBens) => {
    if (!inventarioAtivo) return
    
    const inventarioId = inventarioAtivo.id
    localStorage.setItem(`bens_${inventarioId}`, JSON.stringify(novosBens))
    setBens(novosBens)
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: 'Imóvel',
      categoria: '',
      endereco: '',
      valorAvaliado: '',
      valorVenda: '',
      situacao: 'regular',
      tags: '',
      observacoes: '',
      percentuaisHerdeiros: [],
      fotos: [],
      documentos: {
        escritura: { possui: false, arquivo: null },
        matricula: { possui: false, arquivo: null },
        certidoes: { possui: false, arquivo: null },
        outros: { possui: false, arquivo: null }
      }
    })
  }

  const adicionarBem = () => {
    if (!formData.nome || !formData.tipo) {
      alert('Nome e tipo são obrigatórios!')
      return
    }

    const bem = {
      ...formData,
      id: Date.now(),
      dataCadastro: new Date().toISOString(),
      valorAvaliado: parseFloat(formData.valorAvaliado) || 0,
      valorVenda: parseFloat(formData.valorVenda) || 0
    }

    const novosBens = [...bens, bem]
    salvarBens(novosBens)
    resetForm()
    setModalAberto(false)
  }

  const editarBem = (bem) => {
    setBemEditando(bem)
    setFormData({
      ...bem,
      valorAvaliado: bem.valorAvaliado?.toString() || '',
      valorVenda: bem.valorVenda?.toString() || ''
    })
    setModalAberto(true)
  }

  const salvarEdicao = () => {
    const novosBens = bens.map(b => 
      b.id === bemEditando.id ? {
        ...formData,
        id: bemEditando.id,
        dataCadastro: bemEditando.dataCadastro,
        valorAvaliado: parseFloat(formData.valorAvaliado) || 0,
        valorVenda: parseFloat(formData.valorVenda) || 0
      } : b
    )
    salvarBens(novosBens)
    setBemEditando(null)
    resetForm()
    setModalAberto(false)
  }

  const excluirBem = (id) => {
    if (confirm('Tem certeza que deseja excluir este bem?')) {
      const novosBens = bens.filter(b => b.id !== id)
      salvarBens(novosBens)
    }
  }

  const handleFileUpload = (event, tipo) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      if (tipo === 'foto') {
        const novaFoto = {
          id: Date.now(),
          nome: file.name,
          tipo: file.type,
          tamanho: file.size,
          data: new Date().toISOString(),
          conteudo: e.target.result
        }
        setFormData(prev => ({
          ...prev,
          fotos: [...prev.fotos, novaFoto]
        }))
      } else {
        // Upload de documento
        setFormData(prev => ({
          ...prev,
          documentos: {
            ...prev.documentos,
            [tipo]: {
              possui: true,
              arquivo: {
                nome: file.name,
                tipo: file.type,
                tamanho: file.size,
                data: new Date().toISOString(),
                conteudo: e.target.result
              }
            }
          }
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  const removerFoto = (fotoId) => {
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter(f => f.id !== fotoId)
    }))
  }

  const removerDocumento = (tipo) => {
    setFormData(prev => ({
      ...prev,
      documentos: {
        ...prev.documentos,
        [tipo]: { possui: false, arquivo: null }
      }
    }))
  }

  const abrirModalPercentuais = (bem) => {
    setBemPercentuais(bem)
    setModalPercentuais(true)
  }

  const abrirModalFotos = (bem) => {
    setBemFotos(bem)
    setModalFotos(true)
  }

  const abrirModalAnexos = (bem) => {
    setBemAnexos(bem)
    setModalAnexos(true)
  }

  const bensFiltrados = bens.filter(bem => {
    const matchBusca = bem.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                      bem.endereco?.toLowerCase().includes(filtros.busca.toLowerCase())
    const matchTipo = !filtros.tipo || bem.tipo === filtros.tipo
    const matchSituacao = !filtros.situacao || bem.situacao === filtros.situacao
    return matchBusca && matchTipo && matchSituacao
  })

  const getTipoInfo = (tipo) => {
    return tiposBem.find(t => t.valor === tipo) || tiposBem[0]
  }

  const getSituacaoInfo = (situacao) => {
    return situacoesBem.find(s => s.valor === situacao) || situacoesBem[0]
  }

  const calcularValorTotal = () => {
    return bens.reduce((total, bem) => total + (bem.valorVenda || bem.valorAvaliado || 0), 0)
  }

  const valorTotal = calcularValorTotal()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Home className="h-8 w-8 text-blue-600" />
            Cadastro de Bens
          </h1>
          <p className="text-gray-600">Inventário completo do patrimônio</p>
        </div>
        <Dialog open={modalAberto} onOpenChange={setModalAberto}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setBemEditando(null)
              resetForm()
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Bem
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Bens</CardTitle>
            <Home className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bens.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imóveis</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bens.filter(b => b.tipo === 'Imóvel').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Problemas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {bens.filter(b => ['em_disputa', 'sem_documentacao', 'nao_localizado'].includes(b.situacao)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou endereço..."
                  value={filtros.busca}
                  onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtros.tipo} onValueChange={(value) => setFiltros(prev => ({ ...prev, tipo: value }))}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                {tiposBem.map(tipo => (
                  <SelectItem key={tipo.valor} value={tipo.valor}>
                    {tipo.valor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filtros.situacao} onValueChange={(value) => setFiltros(prev => ({ ...prev, situacao: value }))}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Situação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as situações</SelectItem>
                {situacoesBem.map(situacao => (
                  <SelectItem key={situacao.valor} value={situacao.valor}>
                    {situacao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Bens */}
      <div className="grid gap-4">
        {bensFiltrados.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum bem encontrado</h3>
              <p className="text-gray-600 mb-4">
                {filtros.busca || filtros.tipo || filtros.situacao ? 'Tente ajustar os filtros de busca' : 'Comece adicionando o primeiro bem'}
              </p>
              {!filtros.busca && !filtros.tipo && !filtros.situacao && (
                <Button onClick={() => setModalAberto(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Bem
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          bensFiltrados.map(bem => {
            const tipoInfo = getTipoInfo(bem.tipo)
            const situacaoInfo = getSituacaoInfo(bem.situacao)
            const IconeTipo = tipoInfo.icone
            const IconeSituacao = situacaoInfo.icone
            
            return (
              <Card key={bem.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Ícone do Tipo */}
                      <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${tipoInfo.cor}`}>
                        <IconeTipo className="h-6 w-6" />
                      </div>

                      {/* Informações Principais */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{bem.nome}</h3>
                          <Badge variant="outline">{bem.tipo}</Badge>
                          {bem.categoria && (
                            <Badge variant="secondary">{bem.categoria}</Badge>
                          )}
                          <Badge className={situacaoInfo.cor}>
                            <IconeSituacao className="h-3 w-3 mr-1" />
                            {situacaoInfo.label}
                          </Badge>
                        </div>

                        {bem.endereco && (
                          <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{bem.endereco}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {bem.valorAvaliado > 0 && (
                            <div>
                              <span className="text-gray-600">Valor Avaliado:</span>
                              <p className="font-medium text-blue-600">
                                R$ {bem.valorAvaliado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          )}
                          {bem.valorVenda > 0 && (
                            <div>
                              <span className="text-gray-600">Valor de Venda:</span>
                              <p className="font-medium text-green-600">
                                R$ {bem.valorVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-600">Cadastrado em:</span>
                            <p className="font-medium">
                              {new Date(bem.dataCadastro).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>

                        {bem.tags && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {bem.tags.split(',').map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {bem.observacoes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{bem.observacoes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2">
                      {bem.fotos && bem.fotos.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => abrirModalFotos(bem)}
                        >
                          <Image className="h-4 w-4 mr-1" />
                          {bem.fotos.length}
                        </Button>
                      )}
                      {Object.values(bem.documentos || {}).some(doc => doc.possui) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => abrirModalAnexos(bem)}
                        >
                          <Paperclip className="h-4 w-4 mr-1" />
                          Docs
                        </Button>
                      )}
                      {bem.percentuaisHerdeiros && bem.percentuaisHerdeiros.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => abrirModalPercentuais(bem)}
                        >
                          <Percent className="h-4 w-4 mr-1" />
                          %
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editarBem(bem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => excluirBem(bem.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {bemEditando ? 'Editar Bem' : 'Novo Bem'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do bem patrimonial
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dados">Dados Básicos</TabsTrigger>
            <TabsTrigger value="valores">Valores</TabsTrigger>
            <TabsTrigger value="fotos">Fotos</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value="dados" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Bem *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Casa na Rua das Flores"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo *</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value, categoria: '' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposBem.map(tipo => (
                      <SelectItem key={tipo.valor} value={tipo.valor}>
                        {tipo.valor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categoriasPorTipo[formData.tipo] || []).map(categoria => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="situacao">Situação</Label>
                <Select value={formData.situacao} onValueChange={(value) => setFormData(prev => ({ ...prev, situacao: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {situacoesBem.map(situacao => (
                      <SelectItem key={situacao.valor} value={situacao.valor}>
                        <div className="flex items-center gap-2">
                          <situacao.icone className="h-4 w-4" />
                          {situacao.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço/Localização</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                placeholder="Endereço completo ou localização do bem"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Ex: alugado, reformado, centro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Informações adicionais sobre o bem"
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="valores" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valorAvaliado">Valor Avaliado (R$)</Label>
                <Input
                  id="valorAvaliado"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.valorAvaliado}
                  onChange={(e) => setFormData(prev => ({ ...prev, valorAvaliado: e.target.value }))}
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorVenda">Valor de Venda (R$)</Label>
                <Input
                  id="valorVenda"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.valorVenda}
                  onChange={(e) => setFormData(prev => ({ ...prev, valorVenda: e.target.value }))}
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Informações sobre Valores</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Valor Avaliado:</strong> Valor estimado por avaliação técnica</li>
                <li>• <strong>Valor de Venda:</strong> Valor de mercado ou venda efetiva</li>
                <li>• O sistema usará o valor de venda quando disponível, senão o valor avaliado</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="fotos" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Fotos do Bem</Label>
                <p className="text-sm text-gray-600 mb-3">
                  Adicione fotos para documentar o estado e características do bem
                </p>
                
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    Array.from(e.target.files).forEach(file => {
                      const event = { target: { files: [file] } }
                      handleFileUpload(event, 'foto')
                    })
                  }}
                  className="hidden"
                  id="upload-fotos"
                />
                <Label htmlFor="upload-fotos" className="cursor-pointer">
                  <Button type="button" variant="outline" asChild>
                    <span>
                      <Camera className="h-4 w-4 mr-2" />
                      Adicionar Fotos
                    </span>
                  </Button>
                </Label>
              </div>

              {/* Galeria de Fotos */}
              {formData.fotos.length > 0 && (
                <div className="space-y-2">
                  <Label>Fotos Adicionadas</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.fotos.map(foto => (
                      <div key={foto.id} className="relative group">
                        <img
                          src={foto.conteudo}
                          alt={foto.nome}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removerFoto(foto.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate">{foto.nome}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documentos" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-medium text-amber-900 mb-2">Documentos Importantes</h4>
                <p className="text-sm text-amber-800">
                  Marque os documentos que o bem possui e anexe os arquivos quando disponível
                </p>
              </div>

              {/* Lista de Documentos */}
              <div className="space-y-4">
                {Object.entries({
                  escritura: 'Escritura/Contrato',
                  matricula: 'Matrícula do Imóvel',
                  certidoes: 'Certidões Negativas',
                  outros: 'Outros Documentos'
                }).map(([tipo, label]) => (
                  <div key={tipo} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={formData.documentos[tipo]?.possui || false}
                          onCheckedChange={(checked) => {
                            if (!checked) {
                              removerDocumento(tipo)
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                documentos: {
                                  ...prev.documentos,
                                  [tipo]: { possui: true, arquivo: null }
                                }
                              }))
                            }
                          }}
                        />
                        <Label className="font-medium">{label}</Label>
                      </div>
                      
                      {formData.documentos[tipo]?.possui && (
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, tipo)}
                            className="hidden"
                            id={`upload-${tipo}`}
                          />
                          <Label htmlFor={`upload-${tipo}`} className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm" asChild>
                              <span>
                                <Upload className="h-4 w-4 mr-1" />
                                Anexar
                              </span>
                            </Button>
                          </Label>
                        </div>
                      )}
                    </div>

                    {formData.documentos[tipo]?.arquivo && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">{formData.documentos[tipo].arquivo.nome}</p>
                            <p className="text-xs text-gray-500">
                              {(formData.documentos[tipo].arquivo.tamanho / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removerDocumento(tipo)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setModalAberto(false)}>
            Cancelar
          </Button>
          <Button onClick={bemEditando ? salvarEdicao : adicionarBem}>
            {bemEditando ? 'Salvar Alterações' : 'Adicionar Bem'}
          </Button>
        </div>
      </DialogContent>

      {/* Modal de Fotos */}
      <Dialog open={modalFotos} onOpenChange={setModalFotos}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Fotos de {bemFotos?.nome}</DialogTitle>
            <DialogDescription>
              Galeria de fotos do bem
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {bemFotos?.fotos?.length > 0 ? (
              bemFotos.fotos.map(foto => (
                <div key={foto.id} className="space-y-2">
                  <img
                    src={foto.conteudo}
                    alt={foto.nome}
                    className="w-full h-48 object-cover rounded-lg border cursor-pointer"
                    onClick={() => window.open(foto.conteudo, '_blank')}
                  />
                  <p className="text-sm text-gray-600 truncate">{foto.nome}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma foto disponível</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Documentos */}
      <Dialog open={modalAnexos} onOpenChange={setModalAnexos}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Documentos de {bemAnexos?.nome}</DialogTitle>
            <DialogDescription>
              Documentos anexados ao bem
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {Object.entries(bemAnexos?.documentos || {}).map(([tipo, doc]) => {
              if (!doc.possui || !doc.arquivo) return null
              
              const labels = {
                escritura: 'Escritura/Contrato',
                matricula: 'Matrícula do Imóvel',
                certidoes: 'Certidões Negativas',
                outros: 'Outros Documentos'
              }
              
              return (
                <div key={tipo} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium">{labels[tipo]}</p>
                      <p className="text-sm text-gray-500">{doc.arquivo.nome}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(doc.arquivo.conteudo, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = doc.arquivo.conteudo
                        link.download = doc.arquivo.nome
                        link.click()
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

