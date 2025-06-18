import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  TrendingUp, 
  Users, 
  Percent, 
  DollarSign, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Trash2,
  Calculator,
  PieChart,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  ArrowRight,
  Banknote
} from 'lucide-react'

export default function ReparticaoLucros() {
  const { inventarioAtivo } = useAuth()
  const [herdeiros, setHerdeiros] = useState([])
  const [movimentacoes, setMovimentacoes] = useState([])
  const [periodo, setPeriodo] = useState('mes-atual')
  const [dadosReparticao, setDadosReparticao] = useState({})
  const [modalLimpeza, setModalLimpeza] = useState(false)
  const [modalDetalhes, setModalDetalhes] = useState(false)
  const [herdeiroDetalhes, setHerdeiroDetalhes] = useState(null)

  useEffect(() => {
    if (inventarioAtivo) {
      carregarDados()
    }
  }, [inventarioAtivo, periodo])

  const carregarDados = () => {
    if (!inventarioAtivo) return
    
    try {
      const inventarioId = inventarioAtivo.id
      
      // Carregar herdeiros
      const herdeirosData = JSON.parse(localStorage.getItem(`herdeiros_${inventarioId}`) || '[]')
      setHerdeiros(herdeirosData)

      // Carregar movimentações do Fundo de Caixa
      const movimentacoesData = JSON.parse(localStorage.getItem(`movimentacoes_${inventarioId}`) || '[]')
      setMovimentacoes(movimentacoesData)

      // Carregar dados de repartição
      const reparticaoData = JSON.parse(localStorage.getItem(`reparticao_${inventarioId}`) || '{}')
      setDadosReparticao(reparticaoData)

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setHerdeiros([])
      setMovimentacoes([])
      setDadosReparticao({})
    }
  }

  const calcularResultadoPeriodo = () => {
    const agora = new Date()
    let dataInicio, dataFim

    switch (periodo) {
      case 'mes-atual':
        dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1)
        dataFim = new Date(agora.getFullYear(), agora.getMonth() + 1, 0)
        break
      case 'mes-anterior':
        dataInicio = new Date(agora.getFullYear(), agora.getMonth() - 1, 1)
        dataFim = new Date(agora.getFullYear(), agora.getMonth(), 0)
        break
      case 'trimestre-atual':
        const trimestreAtual = Math.floor(agora.getMonth() / 3)
        dataInicio = new Date(agora.getFullYear(), trimestreAtual * 3, 1)
        dataFim = new Date(agora.getFullYear(), (trimestreAtual + 1) * 3, 0)
        break
      case 'ano-atual':
        dataInicio = new Date(agora.getFullYear(), 0, 1)
        dataFim = new Date(agora.getFullYear(), 11, 31)
        break
      case 'total':
        dataInicio = new Date(2000, 0, 1)
        dataFim = new Date(2099, 11, 31)
        break
      default:
        dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1)
        dataFim = new Date(agora.getFullYear(), agora.getMonth() + 1, 0)
    }

    // Filtrar movimentações do período
    const movimentacoesPeriodo = movimentacoes.filter(mov => {
      const dataMovimentacao = new Date(mov.data)
      return dataMovimentacao >= dataInicio && dataMovimentacao <= dataFim
    })

    // Calcular receitas e despesas
    const receitas = movimentacoesPeriodo
      .filter(mov => mov.tipo === 'receita')
      .reduce((total, mov) => total + mov.valor, 0)

    const despesas = movimentacoesPeriodo
      .filter(mov => mov.tipo === 'despesa')
      .reduce((total, mov) => total + mov.valor, 0)

    const resultado = receitas - despesas

    return {
      receitas,
      despesas,
      resultado,
      movimentacoesPeriodo,
      dataInicio,
      dataFim
    }
  }

  const calcularReparticao = () => {
    const { resultado } = calcularResultadoPeriodo()
    
    if (resultado <= 0 || herdeiros.length === 0) {
      return []
    }

    // Calcular percentual total dos herdeiros
    const percentualTotal = herdeiros.reduce((total, h) => total + (h.percentual || 0), 0)
    
    if (percentualTotal === 0) {
      return []
    }

    // Calcular valor para cada herdeiro
    return herdeiros.map(herdeiro => {
      const percentualHerdeiro = herdeiro.percentual || 0
      const valorHerdeiro = (resultado * percentualHerdeiro) / percentualTotal
      
      return {
        ...herdeiro,
        valorReparticao: valorHerdeiro,
        percentualEfetivo: percentualHerdeiro,
        percentualTotal
      }
    }).filter(h => h.valorReparticao > 0)
  }

  const executarReparticao = () => {
    if (!inventarioAtivo) return
    
    const { resultado, dataInicio, dataFim } = calcularResultadoPeriodo()
    const reparticaoCalculada = calcularReparticao()
    
    if (resultado <= 0) {
      alert('Não há lucro para repartir neste período!')
      return
    }

    if (reparticaoCalculada.length === 0) {
      alert('Nenhum herdeiro com percentual definido!')
      return
    }

    const novaReparticao = {
      id: Date.now(),
      periodo,
      dataInicio: dataInicio.toISOString(),
      dataFim: dataFim.toISOString(),
      resultado,
      herdeiros: reparticaoCalculada,
      dataExecucao: new Date().toISOString()
    }

    const inventarioId = inventarioAtivo.id
    const reparticoesExistentes = JSON.parse(localStorage.getItem(`reparticoes_${inventarioId}`) || '[]')
    const novasReparticoes = [...reparticoesExistentes, novaReparticao]
    
    localStorage.setItem(`reparticoes_${inventarioId}`, JSON.stringify(novasReparticoes))
    
    alert('Repartição executada com sucesso!')
    carregarDados()
  }

  const limparReparticoes = () => {
    if (!inventarioAtivo) return
    
    if (confirm('Tem certeza que deseja limpar todas as repartições? Esta ação não pode ser desfeita.')) {
      const inventarioId = inventarioAtivo.id
      localStorage.removeItem(`reparticoes_${inventarioId}`)
      setModalLimpeza(false)
      carregarDados()
    }
  }

  const exportarRelatorio = () => {
    const { resultado, dataInicio, dataFim } = calcularResultadoPeriodo()
    const reparticaoCalculada = calcularReparticao()
    
    const dados = [
      ['RELATÓRIO DE REPARTIÇÃO DE LUCROS'],
      [''],
      [`Período: ${dataInicio.toLocaleDateString('pt-BR')} a ${dataFim.toLocaleDateString('pt-BR')}`],
      [`Resultado do Período: R$ ${resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      [''],
      ['HERDEIRO', 'PERCENTUAL', 'VALOR A RECEBER'],
      ...reparticaoCalculada.map(h => [
        h.nome,
        `${h.percentualEfetivo}%`,
        `R$ ${h.valorReparticao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      ])
    ]

    const csv = dados.map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reparticao-lucros-${periodo}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const abrirDetalhesHerdeiro = (herdeiro) => {
    setHerdeiroDetalhes(herdeiro)
    setModalDetalhes(true)
  }

  const { resultado, receitas, despesas, dataInicio, dataFim } = calcularResultadoPeriodo()
  const reparticaoCalculada = calcularReparticao()
  const reparticoesHistorico = JSON.parse(localStorage.getItem(`reparticoes_${inventarioAtivo?.id}`) || '[]')

  const periodosOptions = [
    { valor: 'mes-atual', label: 'Mês Atual' },
    { valor: 'mes-anterior', label: 'Mês Anterior' },
    { valor: 'trimestre-atual', label: 'Trimestre Atual' },
    { valor: 'ano-atual', label: 'Ano Atual' },
    { valor: 'total', label: 'Período Total' }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <PieChart className="h-8 w-8 text-green-600" />
            Repartição de Lucros
          </h1>
          <p className="text-gray-600">Distribuição automática dos resultados entre herdeiros</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportarRelatorio}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={modalLimpeza} onOpenChange={setModalLimpeza}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            </DialogTrigger>
          </Dialog>
          <Button onClick={executarReparticao} disabled={resultado <= 0}>
            <Calculator className="h-4 w-4 mr-2" />
            Executar Repartição
          </Button>
        </div>
      </div>

      {/* Seletor de Período */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="periodo">Período para Análise:</Label>
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodosOptions.map(opcao => (
                  <SelectItem key={opcao.valor} value={opcao.valor}>
                    {opcao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline">
              {dataInicio.toLocaleDateString('pt-BR')} a {dataFim.toLocaleDateString('pt-BR')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-600">Total de entradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-600">Total de saídas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultado</CardTitle>
            <DollarSign className={`h-4 w-4 ${resultado >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${resultado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {resultado >= 0 ? '+' : ''}R$ {Math.abs(resultado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-600">
              {resultado >= 0 ? 'Lucro para repartir' : 'Prejuízo no período'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Herdeiros</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{herdeiros.length}</div>
            <p className="text-xs text-gray-600">
              {herdeiros.filter(h => h.percentual > 0).length} com percentual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {resultado <= 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-medium text-red-900">
                  {resultado === 0 ? 'Sem resultado para repartir' : 'Prejuízo no período'}
                </h3>
                <p className="text-sm text-red-700">
                  {resultado === 0 
                    ? 'As receitas e despesas estão equilibradas neste período.'
                    : 'As despesas superaram as receitas. Não há lucro para distribuir.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {herdeiros.filter(h => h.percentual > 0).length === 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-900">Nenhum herdeiro com percentual definido</h3>
                <p className="text-sm text-yellow-700">
                  Configure os percentuais dos herdeiros na seção "Herdeiros" para executar a repartição.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simulação da Repartição */}
      {resultado > 0 && reparticaoCalculada.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Simulação da Repartição
            </CardTitle>
            <CardDescription>
              Valores que cada herdeiro receberia com base no resultado do período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reparticaoCalculada.map(herdeiro => (
                <div key={herdeiro.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                     onClick={() => abrirDetalhesHerdeiro(herdeiro)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{herdeiro.nome}</h3>
                      <p className="text-sm text-gray-600">{herdeiro.documento}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {herdeiro.percentualEfetivo}%
                      </Badge>
                      <div className="text-lg font-bold text-green-600">
                        R$ {herdeiro.valorReparticao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total a Distribuir:</span>
                  <span className="text-green-600">
                    R$ {resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Repartições */}
      {reparticoesHistorico.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Histórico de Repartições
            </CardTitle>
            <CardDescription>
              Repartições já executadas anteriormente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reparticoesHistorico
                .sort((a, b) => new Date(b.dataExecucao) - new Date(a.dataExecucao))
                .map(reparticao => (
                  <div key={reparticao.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">
                          {new Date(reparticao.dataInicio).toLocaleDateString('pt-BR')} a {new Date(reparticao.dataFim).toLocaleDateString('pt-BR')}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Executada em {new Date(reparticao.dataExecucao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          R$ {reparticao.resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-sm text-gray-600">
                          {reparticao.herdeiros.length} herdeiros
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      {reparticao.herdeiros.map(h => (
                        <div key={h.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{h.nome}</span>
                          <span className="font-medium">
                            R$ {h.valorReparticao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de Limpeza */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Limpar Histórico de Repartições</DialogTitle>
          <DialogDescription>
            Esta ação irá remover todas as repartições executadas anteriormente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-medium text-red-900">Atenção!</h3>
                <p className="text-sm text-red-700">
                  Esta ação não pode ser desfeita. Todos os registros de repartições serão perdidos.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600">
            Você tem {reparticoesHistorico.length} repartição(ões) no histórico.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setModalLimpeza(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={limparReparticoes}>
            Confirmar Limpeza
          </Button>
        </div>
      </DialogContent>

      {/* Modal de Detalhes do Herdeiro */}
      <Dialog open={modalDetalhes} onOpenChange={setModalDetalhes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Repartição</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre o valor a receber
            </DialogDescription>
          </DialogHeader>
          
          {herdeiroDetalhes && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{herdeiroDetalhes.nome}</h3>
                  <p className="text-gray-600">{herdeiroDetalhes.documento}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Label className="text-sm text-gray-600">Percentual</Label>
                  <div className="text-2xl font-bold">{herdeiroDetalhes.percentualEfetivo}%</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <Label className="text-sm text-gray-600">Valor a Receber</Label>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {herdeiroDetalhes.valorReparticao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Cálculo</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>Resultado do período: R$ {resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                  <div>Percentual do herdeiro: {herdeiroDetalhes.percentualEfetivo}%</div>
                  <div className="border-t border-blue-200 pt-1 font-medium">
                    Valor = R$ {resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} × {herdeiroDetalhes.percentualEfetivo}% = R$ {herdeiroDetalhes.valorReparticao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

