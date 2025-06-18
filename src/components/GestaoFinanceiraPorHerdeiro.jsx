import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  FileText,
  Download,
  Eye,
  Users,
  CreditCard,
  Wallet,
  PiggyBank,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react'

export default function GestaoFinanceiraPorHerdeiro() {
  const [herdeiros, setHerdeiros] = useState([
    { 
      id: '1', 
      nome: 'João Silva',
      saldoAtual: 15000.00,
      contribuicaoMensal: 2500.00,
      retiradaMensal: 1800.00,
      pendencias: ['Comprovante de despesa médica pendente'],
      status: 'regular'
    },
    { 
      id: '2', 
      nome: 'Maria Santos',
      saldoAtual: -3200.00,
      contribuicaoMensal: 1200.00,
      retiradaMensal: 2100.00,
      pendencias: ['Valor negativo há 2 meses', 'Documentação de receita em atraso'],
      status: 'alerta'
    },
    { 
      id: '3', 
      nome: 'Pedro Oliveira',
      saldoAtual: 8750.00,
      contribuicaoMensal: 3000.00,
      retiradaMensal: 2200.00,
      pendencias: [],
      status: 'regular'
    }
  ])

  const [movimentacoes, setMovimentacoes] = useState([
    {
      id: '1',
      herdeiroId: '1',
      tipo: 'receita',
      categoria: 'Aluguel',
      valor: 2500.00,
      descricao: 'Aluguel Apartamento Centro',
      data: '2024-06-01',
      comprovante: 'comprovante_aluguel_junho.pdf',
      status: 'confirmado'
    },
    {
      id: '2',
      herdeiroId: '1',
      tipo: 'despesa',
      categoria: 'Manutenção',
      valor: 800.00,
      descricao: 'Reparo hidráulico apartamento',
      data: '2024-06-05',
      comprovante: 'nota_fiscal_reparo.pdf',
      status: 'confirmado'
    },
    {
      id: '3',
      herdeiroId: '2',
      tipo: 'despesa',
      categoria: 'Médica',
      valor: 1200.00,
      descricao: 'Tratamento médico familiar',
      data: '2024-06-03',
      comprovante: null,
      status: 'pendente'
    }
  ])

  const [filtroHerdeiro, setFiltroHerdeiro] = useState('todos')
  const [filtroMes, setFiltroMes] = useState('2024-06')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mostrarAlertas, setMostrarAlertas] = useState(true)

  const [novaMovimentacao, setNovaMovimentacao] = useState({
    herdeiroId: '',
    tipo: '',
    categoria: '',
    valor: '',
    descricao: '',
    data: new Date().toISOString().split('T')[0],
    comprovante: null
  })

  const categorias = {
    receita: [
      'Aluguel',
      'Dividendos',
      'Juros',
      'Venda de Bem',
      'Restituição',
      'Outros Recebimentos'
    ],
    despesa: [
      'Manutenção',
      'Impostos',
      'Taxas Legais',
      'Médica',
      'Educação',
      'Outras Despesas'
    ]
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const movimentacao = {
      id: Date.now().toString(),
      ...novaMovimentacao,
      valor: parseFloat(novaMovimentacao.valor),
      status: novaMovimentacao.comprovante ? 'confirmado' : 'pendente',
      criadoEm: new Date().toISOString()
    }
    
    setMovimentacoes([...movimentacoes, movimentacao])
    
    // Atualizar saldo do herdeiro
    const herdeiro = herdeiros.find(h => h.id === novaMovimentacao.herdeiroId)
    if (herdeiro) {
      const novoSaldo = novaMovimentacao.tipo === 'receita' 
        ? herdeiro.saldoAtual + movimentacao.valor
        : herdeiro.saldoAtual - movimentacao.valor
      
      setHerdeiros(herdeiros.map(h => 
        h.id === novaMovimentacao.herdeiroId 
          ? { ...h, saldoAtual: novoSaldo }
          : h
      ))
    }
    
    resetFormulario()
  }

  const resetFormulario = () => {
    setNovaMovimentacao({
      herdeiroId: '',
      tipo: '',
      categoria: '',
      valor: '',
      descricao: '',
      data: new Date().toISOString().split('T')[0],
      comprovante: null
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
    const matchHerdeiro = filtroHerdeiro === 'todos' || mov.herdeiroId === filtroHerdeiro
    const matchMes = mov.data.startsWith(filtroMes)
    return matchHerdeiro && matchMes
  })

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0)
  }

  const getStatusColor = (status) => {
    const cores = {
      'regular': 'bg-green-100 text-green-800',
      'alerta': 'bg-red-100 text-red-800',
      'atencao': 'bg-yellow-100 text-yellow-800'
    }
    return cores[status] || cores.regular
  }

  const getStatusIcon = (status) => {
    const icones = {
      'regular': CheckCircle,
      'alerta': AlertTriangle,
      'atencao': Clock
    }
    return icones[status] || CheckCircle
  }

  // Cálculos gerais
  const totalReceitas = movimentacoesFiltradas
    .filter(mov => mov.tipo === 'receita')
    .reduce((total, mov) => total + mov.valor, 0)

  const totalDespesas = movimentacoesFiltradas
    .filter(mov => mov.tipo === 'despesa')
    .reduce((total, mov) => total + mov.valor, 0)

  const saldoTotal = herdeiros.reduce((total, h) => total + h.saldoAtual, 0)
  const herdeirosComAlerta = herdeiros.filter(h => h.status === 'alerta').length
  const pendenciasTotal = herdeiros.reduce((total, h) => total + h.pendencias.length, 0)

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão Financeira por Herdeiro</h1>
          <p className="text-gray-600">Controle mensal de receitas, despesas e saldos individuais</p>
        </div>
        <Button onClick={() => setMostrarFormulario(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Movimentação
        </Button>
      </div>

      {/* Alertas */}
      {mostrarAlertas && herdeirosComAlerta > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Atenção Necessária</h3>
                <p className="text-red-800 text-sm">
                  {herdeirosComAlerta} herdeiro(s) com situação que requer atenção e {pendenciasTotal} pendência(s) total.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 text-red-700 border-red-300"
                  onClick={() => setMostrarAlertas(false)}
                >
                  Dispensar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo Total</p>
                <p className={`text-2xl font-bold ${saldoTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatarMoeda(saldoTotal)}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receitas do Mês</p>
                <p className="text-2xl font-bold text-green-600">{formatarMoeda(totalReceitas)}</p>
              </div>
              <ArrowUpCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Despesas do Mês</p>
                <p className="text-2xl font-bold text-red-600">{formatarMoeda(totalDespesas)}</p>
              </div>
              <ArrowDownCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resultado Mensal</p>
                <p className={`text-2xl font-bold ${(totalReceitas - totalDespesas) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatarMoeda(totalReceitas - totalDespesas)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Situação por Herdeiro */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Situação por Herdeiro
          </CardTitle>
          <CardDescription>Saldos atuais e status de cada herdeiro</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {herdeiros.map(herdeiro => {
              const StatusIcon = getStatusIcon(herdeiro.status)
              
              return (
                <div key={herdeiro.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{herdeiro.nome}</h3>
                        <Badge className={getStatusColor(herdeiro.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {herdeiro.status === 'regular' ? 'Regular' : 
                           herdeiro.status === 'alerta' ? 'Alerta' : 'Atenção'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Saldo Atual</p>
                      <p className={`text-xl font-bold ${herdeiro.saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatarMoeda(herdeiro.saldoAtual)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="border-l-4 border-green-500 pl-3">
                      <p className="text-sm text-gray-600">Contribuição Mensal</p>
                      <p className="font-semibold text-green-600">{formatarMoeda(herdeiro.contribuicaoMensal)}</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-3">
                      <p className="text-sm text-gray-600">Retirada Mensal</p>
                      <p className="font-semibold text-red-600">{formatarMoeda(herdeiro.retiradaMensal)}</p>
                    </div>
                  </div>

                  {herdeiro.pendencias.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Pendências ({herdeiro.pendencias.length})
                      </h4>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        {herdeiro.pendencias.map((pendencia, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-yellow-600 rounded-full"></div>
                            {pendencia}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filtroHerdeiro}
                onChange={(e) => setFiltroHerdeiro(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos os herdeiros</option>
                {herdeiros.map(herdeiro => (
                  <option key={herdeiro.id} value={herdeiro.id}>{herdeiro.nome}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Input
                type="month"
                value={filtroMes}
                onChange={(e) => setFiltroMes(e.target.value)}
                className="w-auto"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle>Movimentações</CardTitle>
          <CardDescription>
            Histórico de receitas e despesas por herdeiro - {filtroMes}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {movimentacoesFiltradas.map(mov => {
              const herdeiro = herdeiros.find(h => h.id === mov.herdeiroId)
              const isReceita = mov.tipo === 'receita'
              
              return (
                <div key={mov.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isReceita ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {isReceita ? 
                          <ArrowUpCircle className="h-5 w-5 text-green-600" /> :
                          <ArrowDownCircle className="h-5 w-5 text-red-600" />
                        }
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{mov.categoria}</h3>
                        <p className="text-sm text-gray-600">{herdeiro?.nome} • {mov.descricao}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(mov.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${isReceita ? 'text-green-600' : 'text-red-600'}`}>
                        {isReceita ? '+' : '-'}{formatarMoeda(mov.valor)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={mov.status === 'confirmado' ? 
                          'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }>
                          {mov.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                        </Badge>
                        {mov.comprovante && (
                          <Button variant="outline" size="sm" className="h-6 px-2">
                            <FileText className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {movimentacoesFiltradas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma movimentação encontrada</p>
              <p className="text-sm">Adicione movimentações para começar</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulário de Nova Movimentação */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Nova Movimentação</CardTitle>
              <CardDescription>Registrar receita ou despesa de herdeiro</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="herdeiro">Herdeiro *</Label>
                    <select
                      id="herdeiro"
                      value={novaMovimentacao.herdeiroId}
                      onChange={(e) => setNovaMovimentacao(prev => ({ ...prev, herdeiroId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione o herdeiro</option>
                      {herdeiros.map(herdeiro => (
                        <option key={herdeiro.id} value={herdeiro.id}>{herdeiro.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo *</Label>
                    <select
                      id="tipo"
                      value={novaMovimentacao.tipo}
                      onChange={(e) => setNovaMovimentacao(prev => ({ ...prev, tipo: e.target.value, categoria: '' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione o tipo</option>
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
                      disabled={!novaMovimentacao.tipo}
                    >
                      <option value="">Selecione a categoria</option>
                      {novaMovimentacao.tipo && categorias[novaMovimentacao.tipo].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
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
                      placeholder="0,00"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
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
                    <Label htmlFor="comprovante">Comprovante</Label>
                    <Input
                      id="comprovante"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleComprovanteUpload}
                    />
                    {novaMovimentacao.comprovante && (
                      <p className="text-sm text-gray-600">
                        Arquivo: {novaMovimentacao.comprovante.nome}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetFormulario}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Registrar Movimentação
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

