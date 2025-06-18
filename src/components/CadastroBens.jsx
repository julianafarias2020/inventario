import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { 
  Home, 
  Plus, 
  Search, 
  Filter,
  Building,
  Car,
  Sofa,
  CreditCard,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  Image,
  Users,
  Percent
} from 'lucide-react'

export default function CadastroBens() {
  const [bens, setBens] = useState([])
  const [herdeiros, setHerdeiros] = useState([
    { id: '1', nome: 'João Silva', tipo: 'legitimo' },
    { id: '2', nome: 'Maria Santos', tipo: 'meeira' },
    { id: '3', nome: 'Pedro Costa', tipo: 'conjuge' }
  ]) // Simulando herdeiros cadastrados
  const [filtro, setFiltro] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('todos')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  
  const [novoBem, setNovoBem] = useState({
    nome: '',
    tipo: 'imovel',
    endereco: '',
    valorAvaliado: '',
    valorVenda: '',
    situacao: 'inventariado',
    observacoes: '',
    fotos: [],
    documentos: [],
    percentuaisHerdeiros: {}
  })

  const tiposBem = [
    { value: 'imovel', label: 'Imóvel', icon: Home, color: 'bg-green-100 text-green-800' },
    { value: 'veiculo', label: 'Veículo', icon: Car, color: 'bg-blue-100 text-blue-800' },
    { value: 'movel', label: 'Móvel', icon: Sofa, color: 'bg-purple-100 text-purple-800' },
    { value: 'financeiro', label: 'Financeiro', icon: CreditCard, color: 'bg-orange-100 text-orange-800' }
  ]

  const situacoesBem = [
    { value: 'inventariado', label: 'Inventariado', color: 'bg-blue-100 text-blue-800' },
    { value: 'vendido', label: 'Vendido', color: 'bg-green-100 text-green-800' },
    { value: 'partilhado', label: 'Partilhado', color: 'bg-purple-100 text-purple-800' },
    { value: 'em_venda', label: 'Em Venda', color: 'bg-orange-100 text-orange-800' },
    { value: 'litigio', label: 'Em Litígio', color: 'bg-red-100 text-red-800' },
    { value: 'bloqueado', label: 'Bloqueado', color: 'bg-gray-100 text-gray-800' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validar se percentuais somam 100%
    const totalPercentual = Object.values(novoBem.percentuaisHerdeiros).reduce((total, p) => total + (parseFloat(p) || 0), 0)
    if (Math.abs(totalPercentual - 100) > 0.01) {
      alert(`Atenção: Os percentuais somam ${totalPercentual.toFixed(2)}%. Devem somar exatamente 100%.`)
      return
    }
    
    const bem = {
      id: Date.now().toString(),
      ...novoBem,
      criadoEm: new Date().toISOString()
    }
    
    setBens([...bens, bem])
    setNovoBem({
      nome: '',
      tipo: 'imovel',
      endereco: '',
      valorAvaliado: '',
      valorVenda: '',
      situacao: 'inventariado',
      observacoes: '',
      fotos: [],
      documentos: [],
      percentuaisHerdeiros: {}
    })
    setMostrarFormulario(false)
  }

  const handleFotoUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNovoBem(prev => ({
          ...prev,
          fotos: [...prev.fotos, { id: Date.now() + Math.random(), nome: file.name, url: e.target.result }]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDocumentoUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNovoBem(prev => ({
          ...prev,
          documentos: [...prev.documentos, { id: Date.now() + Math.random(), nome: file.name, url: e.target.result, tipo: file.type }]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const handlePercentualChange = (herdeiroId, valor) => {
    setNovoBem(prev => ({
      ...prev,
      percentuaisHerdeiros: {
        ...prev.percentuaisHerdeiros,
        [herdeiroId]: valor
      }
    }))
  }

  const bensFiltrados = bens.filter(bem => {
    const matchFiltro = bem.nome.toLowerCase().includes(filtro.toLowerCase()) ||
                       bem.endereco.toLowerCase().includes(filtro.toLowerCase())
    const matchTipo = tipoFiltro === 'todos' || bem.tipo === tipoFiltro
    return matchFiltro && matchTipo
  })

  const getTipoInfo = (tipo) => {
    return tiposBem.find(t => t.value === tipo) || tiposBem[0]
  }

  const getSituacaoInfo = (situacao) => {
    return situacoesBem.find(s => s.value === situacao) || situacoesBem[0]
  }

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0)
  }

  const totalPercentualAtual = Object.values(novoBem.percentuaisHerdeiros).reduce((total, p) => total + (parseFloat(p) || 0), 0)

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cadastro de Bens</h1>
          <p className="text-gray-600">Gestão completa do patrimônio do inventário</p>
        </div>
        <Button onClick={() => setMostrarFormulario(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Bem
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Bens</p>
                <p className="text-2xl font-bold">{bens.length}</p>
              </div>
              <Home className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Avaliado</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatarMoeda(bens.reduce((total, b) => total + (parseFloat(b.valorAvaliado) || 0), 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Imóveis</p>
                <p className="text-2xl font-bold">{bens.filter(b => b.tipo === 'imovel').length}</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vendidos</p>
                <p className="text-2xl font-bold">{bens.filter(b => b.situacao === 'vendido').length}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
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
                  placeholder="Buscar por nome ou endereço..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos os tipos</option>
                {tiposBem.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Bens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bensFiltrados.map(bem => {
          const tipoInfo = getTipoInfo(bem.tipo)
          const situacaoInfo = getSituacaoInfo(bem.situacao)
          const IconeTipo = tipoInfo.icon
          
          return (
            <Card key={bem.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <IconeTipo className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{bem.nome}</CardTitle>
                      <CardDescription>{bem.endereco}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={tipoInfo.color}>
                      {tipoInfo.label}
                    </Badge>
                    <Badge className={situacaoInfo.color}>
                      {situacaoInfo.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>Avaliado: {formatarMoeda(bem.valorAvaliado)}</span>
                  </div>
                  {bem.valorVenda && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span>Venda: {formatarMoeda(bem.valorVenda)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Image className="h-4 w-4 text-gray-400" />
                    <span>{bem.fotos.length} fotos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>{bem.documentos.length} documentos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Cadastrado em {new Date(bem.criadoEm).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {bensFiltrados.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">
              <Home className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum bem encontrado</p>
              <p className="text-sm">Adicione bens para começar</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulário de Cadastro */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Adicionar Novo Bem</CardTitle>
              <CardDescription>Preencha as informações do bem e defina os percentuais dos herdeiros</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações Básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome/Descrição do Bem *</Label>
                    <Input
                      id="nome"
                      value={novoBem.nome}
                      onChange={(e) => setNovoBem(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Casa na Rua das Flores, 123"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Bem *</Label>
                    <select
                      id="tipo"
                      value={novoBem.tipo}
                      onChange={(e) => setNovoBem(prev => ({ ...prev, tipo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {tiposBem.map(tipo => (
                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço/Localização</Label>
                    <Input
                      id="endereco"
                      value={novoBem.endereco}
                      onChange={(e) => setNovoBem(prev => ({ ...prev, endereco: e.target.value }))}
                      placeholder="Endereço completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="situacao">Situação *</Label>
                    <select
                      id="situacao"
                      value={novoBem.situacao}
                      onChange={(e) => setNovoBem(prev => ({ ...prev, situacao: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {situacoesBem.map(situacao => (
                        <option key={situacao.value} value={situacao.value}>{situacao.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valorAvaliado">Valor Avaliado (R$) *</Label>
                    <Input
                      id="valorAvaliado"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novoBem.valorAvaliado}
                      onChange={(e) => setNovoBem(prev => ({ ...prev, valorAvaliado: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valorVenda">Valor de Venda (R$)</Label>
                    <Input
                      id="valorVenda"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novoBem.valorVenda}
                      onChange={(e) => setNovoBem(prev => ({ ...prev, valorVenda: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Percentuais dos Herdeiros */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">Percentuais dos Herdeiros *</Label>
                    <Badge className={totalPercentualAtual === 100 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      Total: {totalPercentualAtual.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {herdeiros.map(herdeiro => (
                      <div key={herdeiro.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{herdeiro.nome}</p>
                          <p className="text-sm text-gray-600">{herdeiro.tipo}</p>
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            placeholder="0.00"
                            value={novoBem.percentuaisHerdeiros[herdeiro.id] || ''}
                            onChange={(e) => handlePercentualChange(herdeiro.id, e.target.value)}
                          />
                        </div>
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    ))}
                  </div>
                  {totalPercentualAtual !== 100 && (
                    <p className="text-sm text-red-600">
                      ⚠️ Os percentuais devem somar exatamente 100%. Faltam {(100 - totalPercentualAtual).toFixed(1)}%.
                    </p>
                  )}
                </div>

                {/* Upload de Fotos */}
                <div className="space-y-2">
                  <Label htmlFor="fotos">Fotos do Bem</Label>
                  <Input
                    id="fotos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFotoUpload}
                  />
                  {novoBem.fotos.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {novoBem.fotos.map(foto => (
                        <img 
                          key={foto.id}
                          src={foto.url} 
                          alt={foto.nome}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Upload de Documentos */}
                <div className="space-y-2">
                  <Label htmlFor="documentos">Documentos (Escritura, Matrícula, etc.)</Label>
                  <Input
                    id="documentos"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleDocumentoUpload}
                  />
                  {novoBem.documentos.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {novoBem.documentos.map(doc => (
                        <div key={doc.id} className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4" />
                          <span>{doc.nome}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <textarea
                    id="observacoes"
                    value={novoBem.observacoes}
                    onChange={(e) => setNovoBem(prev => ({ ...prev, observacoes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Informações adicionais sobre o bem..."
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
                  <Button type="submit" disabled={totalPercentualAtual !== 100}>
                    Adicionar Bem
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

