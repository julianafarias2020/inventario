import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { 
  Settings,
  Save,
  FileText,
  User,
  Building,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Scale,
  Gavel,
  BookOpen,
  Shield,
  AlertCircle,
  CheckCircle,
  Edit,
  Eye,
  Download,
  Upload,
  Plus,
  Trash2
} from 'lucide-react'

export default function ConfiguracaoEspolio() {
  const { inventarioAtivo, updateInventario } = useAuth()
  const [editando, setEditando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  
  const [configuracao, setConfiguracao] = useState({
    // Dados do Espólio
    numeroProcesso: '',
    vara: '',
    comarca: '',
    dataAbertura: '',
    situacaoProcesso: 'em_andamento',
    
    // Dados do Falecido
    nomeCompleto: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    dataObito: '',
    naturalidade: '',
    estadoCivil: '',
    profissao: '',
    endereco: '',
    
    // Dados do Inventariante
    nomeInventariante: '',
    cpfInventariante: '',
    rgInventariante: '',
    telefoneInventariante: '',
    emailInventariante: '',
    enderecoInventariante: '',
    
    // Dados Jurídicos
    advogado: '',
    oabAdvogado: '',
    telefoneAdvogado: '',
    emailAdvogado: '',
    
    // Configurações do Sistema
    moedaPadrao: 'BRL',
    formatoData: 'DD/MM/YYYY',
    fusoHorario: 'America/Sao_Paulo',
    
    // Documentos Anexos
    documentos: []
  })

  useEffect(() => {
    if (inventarioAtivo) {
      setConfiguracao(prev => ({
        ...prev,
        nomeCompleto: inventarioAtivo.falecido || '',
        dataObito: inventarioAtivo.dataObito || '',
        ...inventarioAtivo.configuracao
      }))
    }
  }, [inventarioAtivo])

  const handleSave = async () => {
    setSalvando(true)
    try {
      await updateInventario({
        ...inventarioAtivo,
        configuracao
      })
      setEditando(false)
      alert('Configurações salvas com sucesso!')
    } catch (error) {
      alert('Erro ao salvar configurações: ' + error.message)
    } finally {
      setSalvando(false)
    }
  }

  const handleDocumentoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const novoDocumento = {
          id: Date.now().toString(),
          nome: file.name,
          tipo: file.type,
          tamanho: file.size,
          url: e.target.result,
          dataUpload: new Date().toISOString(),
          categoria: 'geral'
        }
        
        setConfiguracao(prev => ({
          ...prev,
          documentos: [...prev.documentos, novoDocumento]
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removerDocumento = (documentoId) => {
    setConfiguracao(prev => ({
      ...prev,
      documentos: prev.documentos.filter(doc => doc.id !== documentoId)
    }))
  }

  const formatarTamanhoArquivo = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const situacoesProcesso = [
    { value: 'em_andamento', label: 'Em Andamento', color: 'bg-blue-100 text-blue-800' },
    { value: 'suspenso', label: 'Suspenso', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'finalizado', label: 'Finalizado', color: 'bg-green-100 text-green-800' },
    { value: 'arquivado', label: 'Arquivado', color: 'bg-gray-100 text-gray-800' }
  ]

  const estadosCivis = [
    'Solteiro(a)',
    'Casado(a)',
    'Divorciado(a)',
    'Viúvo(a)',
    'União Estável'
  ]

  const situacaoAtual = situacoesProcesso.find(s => s.value === configuracao.situacaoProcesso)

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuração do Espólio</h1>
          <p className="text-gray-600">Dados jurídicos e configurações do inventário</p>
        </div>
        <div className="flex items-center gap-2">
          {!editando ? (
            <Button onClick={() => setEditando(true)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setEditando(false)}
                disabled={salvando}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                disabled={salvando}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {salvando ? 'Salvando...' : 'Salvar'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status do Processo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Status do Processo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge className={situacaoAtual?.color || 'bg-gray-100 text-gray-800'}>
              {situacaoAtual?.label || 'Não definido'}
            </Badge>
            {configuracao.numeroProcesso && (
              <div className="text-sm text-gray-600">
                Processo: <span className="font-medium">{configuracao.numeroProcesso}</span>
              </div>
            )}
            {configuracao.vara && (
              <div className="text-sm text-gray-600">
                Vara: <span className="font-medium">{configuracao.vara}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dados do Processo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            Dados do Processo
          </CardTitle>
          <CardDescription>Informações jurídicas do inventário</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroProcesso">Número do Processo</Label>
              <Input
                id="numeroProcesso"
                value={configuracao.numeroProcesso}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, numeroProcesso: e.target.value }))}
                placeholder="0000000-00.0000.0.00.0000"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vara">Vara</Label>
              <Input
                id="vara"
                value={configuracao.vara}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, vara: e.target.value }))}
                placeholder="1ª Vara de Família"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comarca">Comarca</Label>
              <Input
                id="comarca"
                value={configuracao.comarca}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, comarca: e.target.value }))}
                placeholder="São Paulo/SP"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataAbertura">Data de Abertura</Label>
              <Input
                id="dataAbertura"
                type="date"
                value={configuracao.dataAbertura}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, dataAbertura: e.target.value }))}
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="situacaoProcesso">Situação do Processo</Label>
              <select
                id="situacaoProcesso"
                value={configuracao.situacaoProcesso}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, situacaoProcesso: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!editando}
              >
                {situacoesProcesso.map(situacao => (
                  <option key={situacao.value} value={situacao.value}>
                    {situacao.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados do Falecido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados do Falecido
          </CardTitle>
          <CardDescription>Informações pessoais do de cujus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nomeCompleto">Nome Completo</Label>
              <Input
                id="nomeCompleto"
                value={configuracao.nomeCompleto}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, nomeCompleto: e.target.value }))}
                placeholder="Nome completo do falecido"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={configuracao.cpf}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, cpf: e.target.value }))}
                placeholder="000.000.000-00"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                value={configuracao.rg}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, rg: e.target.value }))}
                placeholder="00.000.000-0"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={configuracao.dataNascimento}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, dataNascimento: e.target.value }))}
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataObito">Data do Óbito</Label>
              <Input
                id="dataObito"
                type="date"
                value={configuracao.dataObito}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, dataObito: e.target.value }))}
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="naturalidade">Naturalidade</Label>
              <Input
                id="naturalidade"
                value={configuracao.naturalidade}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, naturalidade: e.target.value }))}
                placeholder="São Paulo/SP"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estadoCivil">Estado Civil</Label>
              <select
                id="estadoCivil"
                value={configuracao.estadoCivil}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, estadoCivil: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!editando}
              >
                <option value="">Selecione</option>
                {estadosCivis.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profissao">Profissão</Label>
              <Input
                id="profissao"
                value={configuracao.profissao}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, profissao: e.target.value }))}
                placeholder="Profissão do falecido"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={configuracao.endereco}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, endereco: e.target.value }))}
                placeholder="Endereço completo"
                disabled={!editando}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados do Inventariante */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Dados do Inventariante
          </CardTitle>
          <CardDescription>Informações do responsável pelo inventário</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nomeInventariante">Nome Completo</Label>
              <Input
                id="nomeInventariante"
                value={configuracao.nomeInventariante}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, nomeInventariante: e.target.value }))}
                placeholder="Nome completo do inventariante"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cpfInventariante">CPF</Label>
              <Input
                id="cpfInventariante"
                value={configuracao.cpfInventariante}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, cpfInventariante: e.target.value }))}
                placeholder="000.000.000-00"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rgInventariante">RG</Label>
              <Input
                id="rgInventariante"
                value={configuracao.rgInventariante}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, rgInventariante: e.target.value }))}
                placeholder="00.000.000-0"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefoneInventariante">Telefone</Label>
              <Input
                id="telefoneInventariante"
                value={configuracao.telefoneInventariante}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, telefoneInventariante: e.target.value }))}
                placeholder="(11) 99999-9999"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emailInventariante">E-mail</Label>
              <Input
                id="emailInventariante"
                type="email"
                value={configuracao.emailInventariante}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, emailInventariante: e.target.value }))}
                placeholder="email@exemplo.com"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="enderecoInventariante">Endereço</Label>
              <Input
                id="enderecoInventariante"
                value={configuracao.enderecoInventariante}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, enderecoInventariante: e.target.value }))}
                placeholder="Endereço completo do inventariante"
                disabled={!editando}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados do Advogado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Dados do Advogado
          </CardTitle>
          <CardDescription>Informações do advogado responsável</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="advogado">Nome do Advogado</Label>
              <Input
                id="advogado"
                value={configuracao.advogado}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, advogado: e.target.value }))}
                placeholder="Nome completo do advogado"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="oabAdvogado">OAB</Label>
              <Input
                id="oabAdvogado"
                value={configuracao.oabAdvogado}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, oabAdvogado: e.target.value }))}
                placeholder="OAB/SP 000.000"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefoneAdvogado">Telefone</Label>
              <Input
                id="telefoneAdvogado"
                value={configuracao.telefoneAdvogado}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, telefoneAdvogado: e.target.value }))}
                placeholder="(11) 99999-9999"
                disabled={!editando}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emailAdvogado">E-mail</Label>
              <Input
                id="emailAdvogado"
                type="email"
                value={configuracao.emailAdvogado}
                onChange={(e) => setConfiguracao(prev => ({ ...prev, emailAdvogado: e.target.value }))}
                placeholder="advogado@escritorio.com"
                disabled={!editando}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentos Anexos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documentos do Espólio
          </CardTitle>
          <CardDescription>Documentos gerais anexados ao inventário</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {editando && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">Clique para adicionar documentos</p>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleDocumentoUpload}
                    className="hidden"
                    id="upload-documento"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('upload-documento').click()}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Documento
                  </Button>
                </div>
              </div>
            )}

            {configuracao.documentos.length > 0 && (
              <div className="space-y-2">
                {configuracao.documentos.map(documento => (
                  <div key={documento.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{documento.nome}</p>
                        <p className="text-sm text-gray-600">
                          {formatarTamanhoArquivo(documento.tamanho)} • 
                          {new Date(documento.dataUpload).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {editando && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removerDocumento(documento.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {configuracao.documentos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum documento anexado</p>
                <p className="text-sm">Adicione documentos relacionados ao espólio</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

