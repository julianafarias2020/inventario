import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  FileText,
  Download,
  Home,
  Building
} from 'lucide-react'

export default function FundoCaixa() {
  const [movimentacoes, setMovimentacoes] = useState([])
  const [bens, setBens] = useState([
    { id: '1', nome: 'Casa Principal', tipo: 'imovel' },
    { id: '2', nome: 'Apartamento Centro', tipo: 'imovel' },
    { id: '3', nome: 'Terreno Rural', tipo: 'imovel' }
  ]) // Simulando bens cadastrados
  const [filtro, setFiltro] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('todos')
  const [bemFiltro, setBemFiltro] = useState('todos')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  
  const [novaMovimentacao, setNovaMovimentacao] = useState({
    tipo: 'receita',
    categoria: '',
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    bemId: '',
    comprovante: null,
    observacoes: ''
  })

  const categoriasReceita = [
    'Aluguel',
    'Venda de Bem',
    'Dividendos',
    'Juros',
    'Restituição',
    'Outros'
  ]

  const categoriasDespesa = [
    'IPTU',
    'Condomínio',
    'Manutenção',
    'Seguro',
    'Advocacia',
    'Cartório',
    'Inventariante',
    'Contador',
    'Outros'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const movimentacao = {
      id: Date.now().toString(),
      ...novaMovimentacao,
      valor: parseFloat(novaMovimentacao.valor),
      criadoEm: new Date().toISOString()
    }
    
    setMovimentacoes([...movimentacoes, movimentacao])
    setNovaMovimentacao({
      tipo: 'receita',
      categoria: '',
      descricao: '',
      valor: '',
      data: new Date().toISOString().split('T')[0],
      bemId: '',
      comprovante: null,
      observacoes: ''
    })
    setMostrarFormulario(false)
  }

  const handleComprovanteUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNovaMovimentacao(prev => ({
          ...prev,
          comprovante: { nome: file.name, url: e.target.result, tipo: file.type }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const movimentacoesFiltradas = movimentacoes.filter(mov => {
    const matchFiltro = mov.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
                       mov.categoria.toLowerCase().includes(filtro.toLowerCase())
    const matchTipo = tipoFiltro === 'todos' || mov.tipo === tipoFiltro
    const matchBem = bemFiltro === 'todos' || mov.bemId === bemFiltro
    return matchFiltro && matchTipo && matchBem
  })

  const totalReceitas = movimentacoes
    .filter(m => m.tipo === 'receita')
    .reduce((total, m) => total + m.valor, 0)

  const totalDespesas = movimentacoes
    .filter(m => m.tipo === 'despesa')
    .reduce((total, m) => total + m.valor, 0)

  const saldoAtual = totalReceitas - totalDespesas

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0)
  }

  const getBemNome = (bemId) => {
    const bem = bens.find(b => b.id === bemId)
    return bem ? bem.nome : 'Geral'
  }

  const exportarCSV = () => {
    const headers = ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor', 'Bem', 'Observações']
    const csvContent = [
      headers.join(','),
      ...movimentacoesFiltradas.map(mov => [
        mov.data,
        mov.tipo,
        mov.categoria,
        `"${mov.descricao}"`,
        mov.valor,
        `"${getBemNome(mov.bemId)}"`,
        `"${mov.observacoes || ''}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `fundo_caixa_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fundo de Caixa</h1>
          <p className="text-gray-600">Controle financeiro completo do inventário</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportarCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Button onClick={() => setMostrarFormulario(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Movimentação
          </Button>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Receitas</p>
                <p className="text-2xl font-bold text-green-600">{formatarMoeda(totalReceitas)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Despesas</p>
                <p className="text-2xl font-bold text-red-600">{formatarMoeda(totalDespesas)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
                <p className={`text-2xl font-bold ${saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatarMoeda(saldoAtual)}
                </p>
              </div>
              <DollarSign className={`h-8 w-8 ${saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Movimentações</p>
                <p className="text-2xl font-bold">{movimentacoes.length}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
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
                  placeholder="Buscar por descrição ou categoria..."
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
                <option value="receita">Receitas</option>
                <option value="despesa">Despesas</option>
              </select>
              <select
                value={bemFiltro}
                onChange={(e) => setBemFiltro(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos os bens</option>
                <option value="">Geral</option>
                {bens.map(bem => (
                  <option key={bem.id} value={bem.id}>{bem.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle>Movimentações Financeiras</CardTitle>
          <CardDescription>Histórico de receitas e despesas do inventário</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {movimentacoesFiltradas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma movimentação encontrada</p>
                <p className="text-sm">Adicione movimentações para começar</p>
              </div>
            ) : (
              movimentacoesFiltradas.map(mov => (
                <div key={mov.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      mov.tipo === 'receita' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {mov.tipo === 'receita' ? (
                        <TrendingUp className={`h-6 w-6 text-green-600`} />
                      ) : (
                        <TrendingDown className={`h-6 w-6 text-red-600`} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{mov.descricao}</h3>
                        <Badge className={mov.tipo === 'receita' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {mov.categoria}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(mov.data).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Home className="h-4 w-4" />
                          <span>{getBemNome(mov.bemId)}</span>
                        </div>
                        {mov.comprovante && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>Comprovante</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      mov.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {mov.tipo === 'receita' ? '+' : '-'} {formatarMoeda(mov.valor)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(mov.criadoEm).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Nova Movimentação */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Nova Movimentação</CardTitle>
              <CardDescription>Adicione uma receita ou despesa ao fundo de caixa</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo *</Label>
                    <select
                      id="tipo"
                      value={novaMovimentacao.tipo}
                      onChange={(e) => setNovaMovimentacao(prev => ({ ...prev, tipo: e.target.value, categoria: '' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="receita">Receita</option>
                      <option value="despesa">Despesa</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria *</Label>
                    <select
                      id="categoria"
                      value={novaMovimentacao.categoria}
                      onChange={(e) => setNovaMovimentacao(prev => ({ ...prev, categoria: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {(novaMovimentacao.tipo === 'receita' ? categoriasReceita : categoriasDespesa).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição *</Label>
                    <Input
                      id="descricao"
                      value={novaMovimentacao.descricao}
                      onChange={(e) => setNovaMovimentacao(prev => ({ ...prev, descricao: e.target.value }))}
                      placeholder="Descrição da movimentação"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor (R$) *</Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novaMovimentacao.valor}
                      onChange={(e) => setNovaMovimentacao(prev => ({ ...prev, valor: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data">Data *</Label>
                    <Input
                      id="data"
                      type="date"
                      value={novaMovimentacao.data}
                      onChange={(e) => setNovaMovimentacao(prev => ({ ...prev, data: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bemId">Bem Relacionado</Label>
                    <select
                      id="bemId"
                      value={novaMovimentacao.bemId}
                      onChange={(e) => setNovaMovimentacao(prev => ({ ...prev, bemId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Geral (não relacionado a bem específico)</option>
                      {bens.map(bem => (
                        <option key={bem.id} value={bem.id}>{bem.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comprovante">Comprovante</Label>
                  <Input
                    id="comprovante"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleComprovanteUpload}
                  />
                  {novaMovimentacao.comprovante && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{novaMovimentacao.comprovante.nome}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <textarea
                    id="observacoes"
                    value={novaMovimentacao.observacoes}
                    onChange={(e) => setNovaMovimentacao(prev => ({ ...prev, observacoes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Informações adicionais..."
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
                    Adicionar Movimentação
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

