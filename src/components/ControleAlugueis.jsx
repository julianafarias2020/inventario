import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { 
  Building, 
  Plus, 
  Search, 
  Filter,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function ControleAlugueis() {
  const [contratos, setContratos] = useState([])
  const [imoveis, setImoveis] = useState([
    { id: '1', nome: 'Casa Principal', endereco: 'Rua das Flores, 123' },
    { id: '2', nome: 'Apartamento Centro', endereco: 'Av. Central, 456' },
    { id: '3', nome: 'Casa Comercial', endereco: 'Rua do Comércio, 789' }
  ]) // Simulando imóveis do cadastro de bens
  const [filtro, setFiltro] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('todos')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  
  const [novoContrato, setNovoContrato] = useState({
    imovelId: '',
    nomeInquilino: '',
    cpfInquilino: '',
    telefoneInquilino: '',
    emailInquilino: '',
    valorAluguel: '',
    diaVencimento: '',
    dataInicio: '',
    dataFim: '',
    status: 'ativo',
    observacoes: '',
    contrato: null
  })

  const statusContratos = [
    { value: 'ativo', label: 'Ativo', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'atrasado', label: 'Atrasado', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
    { value: 'vencendo', label: 'Vencendo', color: 'bg-orange-100 text-orange-800', icon: Clock },
    { value: 'encerrado', label: 'Encerrado', color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const contrato = {
      id: Date.now().toString(),
      ...novoContrato,
      valorAluguel: parseFloat(novoContrato.valorAluguel),
      criadoEm: new Date().toISOString()
    }
    
    setContratos([...contratos, contrato])
    setNovoContrato({
      imovelId: '',
      nomeInquilino: '',
      cpfInquilino: '',
      telefoneInquilino: '',
      emailInquilino: '',
      valorAluguel: '',
      diaVencimento: '',
      dataInicio: '',
      dataFim: '',
      status: 'ativo',
      observacoes: '',
      contrato: null
    })
    setMostrarFormulario(false)
  }

  const handleContratoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNovoContrato(prev => ({
          ...prev,
          contrato: { nome: file.name, url: e.target.result, tipo: file.type }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const contratosFiltrados = contratos.filter(contrato => {
    const imovel = getImovelNome(contrato.imovelId)
    const matchFiltro = contrato.nomeInquilino.toLowerCase().includes(filtro.toLowerCase()) ||
                       imovel.toLowerCase().includes(filtro.toLowerCase())
    const matchStatus = statusFiltro === 'todos' || contrato.status === statusFiltro
    return matchFiltro && matchStatus
  })

  const getImovelNome = (imovelId) => {
    const imovel = imoveis.find(i => i.id === imovelId)
    return imovel ? imovel.nome : 'Imóvel não encontrado'
  }

  const getImovelEndereco = (imovelId) => {
    const imovel = imoveis.find(i => i.id === imovelId)
    return imovel ? imovel.endereco : ''
  }

  const getStatusInfo = (status) => {
    return statusContratos.find(s => s.value === status) || statusContratos[0]
  }

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0)
  }

  const calcularProximoVencimento = (diaVencimento) => {
    const hoje = new Date()
    const proximoVencimento = new Date(hoje.getFullYear(), hoje.getMonth(), parseInt(diaVencimento))
    
    if (proximoVencimento < hoje) {
      proximoVencimento.setMonth(proximoVencimento.getMonth() + 1)
    }
    
    return proximoVencimento.toLocaleDateString('pt-BR')
  }

  const contratosAtivos = contratos.filter(c => c.status === 'ativo')
  const receitaMensal = contratosAtivos.reduce((total, c) => total + c.valorAluguel, 0)
  const contratosAtrasados = contratos.filter(c => c.status === 'atrasado').length

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Controle de Aluguéis</h1>
          <p className="text-gray-600">Gestão completa de contratos de locação</p>
        </div>
        <Button onClick={() => setMostrarFormulario(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Contrato
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contratos Ativos</p>
                <p className="text-2xl font-bold">{contratosAtivos.length}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                <p className="text-2xl font-bold text-green-600">{formatarMoeda(receitaMensal)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contratos Atrasados</p>
                <p className="text-2xl font-bold text-red-600">{contratosAtrasados}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contratos</p>
                <p className="text-2xl font-bold">{contratos.length}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por inquilino ou imóvel..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos os status</option>
                {statusContratos.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Contratos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {contratosFiltrados.map(contrato => {
          const statusInfo = getStatusInfo(contrato.status)
          const IconeStatus = statusInfo.icon
          
          return (
            <Card key={contrato.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{getImovelNome(contrato.imovelId)}</CardTitle>
                    <CardDescription>{getImovelEndereco(contrato.imovelId)}</CardDescription>
                  </div>
                  <Badge className={statusInfo.color}>
                    <IconeStatus className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Informações do Inquilino */}
                  <div className="border-l-4 border-blue-500 pl-3">
                    <h4 className="font-semibold text-gray-900">Inquilino</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{contrato.nomeInquilino}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>CPF: {contrato.cpfInquilino}</span>
                      </div>
                      {contrato.telefoneInquilino && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{contrato.telefoneInquilino}</span>
                        </div>
                      )}
                      {contrato.emailInquilino && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{contrato.emailInquilino}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informações do Contrato */}
                  <div className="border-l-4 border-green-500 pl-3">
                    <h4 className="font-semibold text-gray-900">Contrato</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span>Valor: {formatarMoeda(contrato.valorAluguel)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Vencimento: dia {contrato.diaVencimento}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Próximo: {calcularProximoVencimento(contrato.diaVencimento)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Período: {new Date(contrato.dataInicio).toLocaleDateString('pt-BR')} - {new Date(contrato.dataFim).toLocaleDateString('pt-BR')}</span>
                      </div>
                      {contrato.contrato && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>Contrato anexado</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {contrato.observacoes && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Observações:</strong> {contrato.observacoes}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {contratosFiltrados.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">
              <Building className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum contrato encontrado</p>
              <p className="text-sm">Adicione contratos para começar</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário de Novo Contrato */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Novo Contrato de Aluguel</CardTitle>
              <CardDescription>Cadastre um novo contrato de locação</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Seleção do Imóvel */}
                <div className="space-y-2">
                  <Label htmlFor="imovelId">Imóvel *</Label>
                  <select
                    id="imovelId"
                    value={novoContrato.imovelId}
                    onChange={(e) => setNovoContrato(prev => ({ ...prev, imovelId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione um imóvel</option>
                    {imoveis.map(imovel => (
                      <option key={imovel.id} value={imovel.id}>
                        {imovel.nome} - {imovel.endereco}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dados do Inquilino */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Dados do Inquilino</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomeInquilino">Nome Completo *</Label>
                      <Input
                        id="nomeInquilino"
                        value={novoContrato.nomeInquilino}
                        onChange={(e) => setNovoContrato(prev => ({ ...prev, nomeInquilino: e.target.value }))}
                        placeholder="Nome completo do inquilino"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpfInquilino">CPF *</Label>
                      <Input
                        id="cpfInquilino"
                        value={novoContrato.cpfInquilino}
                        onChange={(e) => setNovoContrato(prev => ({ ...prev, cpfInquilino: e.target.value }))}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefoneInquilino">Telefone</Label>
                      <Input
                        id="telefoneInquilino"
                        value={novoContrato.telefoneInquilino}
                        onChange={(e) => setNovoContrato(prev => ({ ...prev, telefoneInquilino: e.target.value }))}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailInquilino">E-mail</Label>
                      <Input
                        id="emailInquilino"
                        type="email"
                        value={novoContrato.emailInquilino}
                        onChange={(e) => setNovoContrato(prev => ({ ...prev, emailInquilino: e.target.value }))}
                        placeholder="email@exemplo.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Dados do Contrato */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Dados do Contrato</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorAluguel">Valor do Aluguel (R$) *</Label>
                      <Input
                        id="valorAluguel"
                        type="number"
                        step="0.01"
                        min="0"
                        value={novoContrato.valorAluguel}
                        onChange={(e) => setNovoContrato(prev => ({ ...prev, valorAluguel: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diaVencimento">Dia do Vencimento *</Label>
                      <select
                        id="diaVencimento"
                        value={novoContrato.diaVencimento}
                        onChange={(e) => setNovoContrato(prev => ({ ...prev, diaVencimento: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Selecione o dia</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(dia => (
                          <option key={dia} value={dia}>Dia {dia}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataInicio">Data de Início *</Label>
                      <Input
                        id="dataInicio"
                        type="date"
                        value={novoContrato.dataInicio}
                        onChange={(e) => setNovoContrato(prev => ({ ...prev, dataInicio: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataFim">Data de Fim *</Label>
                      <Input
                        id="dataFim"
                        type="date"
                        value={novoContrato.dataFim}
                        onChange={(e) => setNovoContrato(prev => ({ ...prev, dataFim: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <select
                        id="status"
                        value={novoContrato.status}
                        onChange={(e) => setNovoContrato(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        {statusContratos.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Upload do Contrato */}
                <div className="space-y-2">
                  <Label htmlFor="contrato">Arquivo do Contrato</Label>
                  <Input
                    id="contrato"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleContratoUpload}
                  />
                  {novoContrato.contrato && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{novoContrato.contrato.nome}</span>
                    </div>
                  )}
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <textarea
                    id="observacoes"
                    value={novoContrato.observacoes}
                    onChange={(e) => setNovoContrato(prev => ({ ...prev, observacoes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Informações adicionais sobre o contrato..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setMostrarFormulario(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Criar Contrato
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

