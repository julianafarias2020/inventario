import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  FileText,
  Download,
  Eye,
  Printer,
  Share,
  Calendar,
  Filter,
  Search,
  Plus,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Home,
  DollarSign,
  Scale,
  Gavel,
  BookOpen,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Building,
  FileCheck,
  FileX,
  FilePlus
} from 'lucide-react'

export default function RelatoriosJuridicos() {
  const { inventarioAtivo } = useAuth()
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroData, setFiltroData] = useState('')
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false)
  const [relatorioSelecionado, setRelatorioSelecionado] = useState(null)

  // Dados simulados para demonstração
  const [dadosInventario] = useState({
    herdeiros: [
      { id: '1', nome: 'João Silva', percentualGeral: 40.00, saldoAtual: 15000.00, tipo: 'Legítimo' },
      { id: '2', nome: 'Maria Santos', percentualGeral: 35.00, saldoAtual: -3200.00, tipo: 'Meeira' },
      { id: '3', nome: 'Pedro Oliveira', percentualGeral: 25.00, saldoAtual: 8750.00, tipo: 'Legítimo' }
    ],
    bens: [
      { id: '1', nome: 'Apartamento Centro', tipo: 'BENS_IMOVEIS', valorAvaliacao: 450000.00, situacao: 'Inventariado' },
      { id: '2', nome: 'Conta Corrente Banco do Brasil', tipo: 'BENS_MOVEIS', valorAvaliacao: 25000.00, situacao: 'Inventariado' },
      { id: '3', nome: 'Veículo Honda Civic', tipo: 'BENS_MOVEIS', valorAvaliacao: 85000.00, situacao: 'Inventariado' }
    ],
    movimentacoes: [
      { id: '1', tipo: 'receita', categoria: 'Aluguel', valor: 3200.00, data: '2024-01-15', bem: 'Apartamento Centro' },
      { id: '2', tipo: 'despesa', categoria: 'IPTU', valor: 1200.00, data: '2024-01-10', bem: 'Apartamento Centro' },
      { id: '3', tipo: 'receita', categoria: 'Dividendos', valor: 850.00, data: '2024-01-20', bem: 'Conta Corrente' }
    ],
    alugueis: [
      { id: '1', imovel: 'Apartamento Centro', inquilino: 'Carlos Silva', valor: 3200.00, status: 'Ativo' },
      { id: '2', imovel: 'Casa Subúrbio', inquilino: 'Ana Costa', valor: 1800.00, status: 'Ativo' }
    ]
  })

  const tiposRelatorio = [
    {
      id: 'inventario_completo',
      nome: 'Inventário Completo',
      descricao: 'Relatório completo com todos os bens, herdeiros e situação financeira',
      icone: Scale,
      categoria: 'judicial',
      template: 'completo'
    },
    {
      id: 'relacao_bens',
      nome: 'Relação de Bens',
      descricao: 'Lista detalhada de todos os bens do espólio com valores e situação',
      icone: Home,
      categoria: 'judicial',
      template: 'bens'
    },
    {
      id: 'demonstrativo_financeiro',
      nome: 'Demonstrativo Financeiro',
      descricao: 'Relatório financeiro com receitas, despesas e saldos por herdeiro',
      icone: DollarSign,
      categoria: 'financeiro',
      template: 'financeiro'
    },
    {
      id: 'relacao_herdeiros',
      nome: 'Relação de Herdeiros',
      descricao: 'Lista de herdeiros com percentuais e documentação',
      icone: Users,
      categoria: 'judicial',
      template: 'herdeiros'
    },
    {
      id: 'controle_alugueis',
      nome: 'Controle de Aluguéis',
      descricao: 'Relatório de contratos de aluguel e recebimentos',
      icone: Building,
      categoria: 'financeiro',
      template: 'alugueis'
    },
    {
      id: 'balanco_patrimonial',
      nome: 'Balanço Patrimonial',
      descricao: 'Demonstrativo do patrimônio total do espólio',
      icone: BarChart3,
      categoria: 'contabil',
      template: 'balanco'
    },
    {
      id: 'prestacao_contas',
      nome: 'Prestação de Contas',
      descricao: 'Relatório de prestação de contas do inventariante',
      icone: FileCheck,
      categoria: 'judicial',
      template: 'prestacao'
    },
    {
      id: 'resumo_executivo',
      nome: 'Resumo Executivo',
      descricao: 'Resumo executivo para anexar em petições',
      icone: FileText,
      categoria: 'judicial',
      template: 'resumo'
    }
  ]

  const [relatoriosGerados] = useState([
    {
      id: 1,
      tipo: 'inventario_completo',
      nome: 'Inventário Completo - Janeiro 2024',
      dataGeracao: '2024-01-25',
      tamanho: '2.3 MB',
      status: 'concluido'
    },
    {
      id: 2,
      tipo: 'demonstrativo_financeiro',
      nome: 'Demonstrativo Financeiro - Janeiro 2024',
      dataGeracao: '2024-01-20',
      tamanho: '1.1 MB',
      status: 'concluido'
    },
    {
      id: 3,
      tipo: 'relacao_bens',
      nome: 'Relação de Bens Atualizada',
      dataGeracao: '2024-01-18',
      tamanho: '856 KB',
      status: 'concluido'
    }
  ])

  const gerarRelatorio = async (tipoRelatorio) => {
    setGerandoRelatorio(true)
    setRelatorioSelecionado(tipoRelatorio)

    // Simular geração do relatório
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Aqui seria implementada a lógica real de geração
    console.log(`Gerando relatório: ${tipoRelatorio.nome}`)
    
    setGerandoRelatorio(false)
    setRelatorioSelecionado(null)
    
    alert(`Relatório "${tipoRelatorio.nome}" gerado com sucesso!`)
  }

  const visualizarRelatorio = (relatorio) => {
    console.log(`Visualizando relatório: ${relatorio.nome}`)
    alert(`Abrindo visualização do relatório: ${relatorio.nome}`)
  }

  const baixarRelatorio = (relatorio) => {
    console.log(`Baixando relatório: ${relatorio.nome}`)
    alert(`Download iniciado: ${relatorio.nome}`)
  }

  const getIconeCategoria = (categoria) => {
    switch (categoria) {
      case 'judicial': return <Gavel className="h-4 w-4" />
      case 'financeiro': return <DollarSign className="h-4 w-4" />
      case 'contabil': return <BarChart3 className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getCorCategoria = (categoria) => {
    switch (categoria) {
      case 'judicial': return 'bg-blue-100 text-blue-800'
      case 'financeiro': return 'bg-green-100 text-green-800'
      case 'contabil': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const relatoriosFiltrados = tiposRelatorio.filter(relatorio => {
    if (filtroTipo === 'todos') return true
    return relatorio.categoria === filtroTipo
  })

  const estatisticas = {
    totalRelatorios: relatoriosGerados.length,
    relatoriosJudiciais: tiposRelatorio.filter(r => r.categoria === 'judicial').length,
    relatoriosFinanceiros: tiposRelatorio.filter(r => r.categoria === 'financeiro').length,
    relatoriosContabeis: tiposRelatorio.filter(r => r.categoria === 'contabil').length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios Jurídicos</h1>
          <p className="text-gray-600">Documentos profissionais para o processo de inventário</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Relatórios</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalRelatorios}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Gavel className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Judiciais</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.relatoriosJudiciais}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Financeiros</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.relatoriosFinanceiros}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contábeis</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.relatoriosContabeis}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="filtro-tipo">Categoria</Label>
              <select
                id="filtro-tipo"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="todos">Todas as categorias</option>
                <option value="judicial">Judiciais</option>
                <option value="financeiro">Financeiros</option>
                <option value="contabil">Contábeis</option>
              </select>
            </div>
            <div className="flex-1">
              <Label htmlFor="filtro-data">Data</Label>
              <Input
                id="filtro-data"
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="gerar" className="w-full">
        <TabsList>
          <TabsTrigger value="gerar">Gerar Relatórios</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="modelos">Modelos</TabsTrigger>
        </TabsList>

        <TabsContent value="gerar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatoriosFiltrados.map(relatorio => {
              const Icone = relatorio.icone
              return (
                <Card key={relatorio.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Icone className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{relatorio.nome}</CardTitle>
                        </div>
                      </div>
                      <Badge className={getCorCategoria(relatorio.categoria)}>
                        {getIconeCategoria(relatorio.categoria)}
                        <span className="ml-1 capitalize">{relatorio.categoria}</span>
                      </Badge>
                    </div>
                    <CardDescription className="mt-2">
                      {relatorio.descricao}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      onClick={() => gerarRelatorio(relatorio)}
                      disabled={gerandoRelatorio}
                    >
                      {gerandoRelatorio && relatorioSelecionado?.id === relatorio.id ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <FilePlus className="h-4 w-4 mr-2" />
                          Gerar Relatório
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <div className="space-y-4">
            {relatoriosGerados.map(relatorio => {
              const tipoInfo = tiposRelatorio.find(t => t.id === relatorio.tipo)
              const Icone = tipoInfo?.icone || FileText
              
              return (
                <Card key={relatorio.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Icone className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{relatorio.nome}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Gerado em: {new Date(relatorio.dataGeracao).toLocaleDateString('pt-BR')}</span>
                            <span>Tamanho: {relatorio.tamanho}</span>
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {relatorio.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => visualizarRelatorio(relatorio)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Visualizar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => baixarRelatorio(relatorio)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="modelos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Modelos Judiciais
                </CardTitle>
                <CardDescription>
                  Modelos específicos para anexar em petições e processos judiciais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Inventário Inicial</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Prestação de Contas</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Partilha de Bens</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Modelos Contábeis
                </CardTitle>
                <CardDescription>
                  Relatórios contábeis e financeiros para controle interno
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Balanço Patrimonial</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">DRE - Demonstrativo</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Fluxo de Caixa</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

