import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from './ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from './ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table'
import {
  FileText,
  Image,
  File,
  FileArchive,
  FilePlus,
  Trash2,
  Download,
  Search,
  Filter,
  Calendar,
  User,
  Tag,
  Eye,
  X,
  Plus,
  Check,
  AlertCircle
} from 'lucide-react'

// Categorias de documentos
const categorias = [
  { id: 'pessoal', nome: 'Documentos Pessoais', icone: <User className="h-4 w-4" /> },
  { id: 'imovel', nome: 'Documentos de Imóveis', icone: <FileText className="h-4 w-4" /> },
  { id: 'financeiro', nome: 'Documentos Financeiros', icone: <FileText className="h-4 w-4" /> },
  { id: 'judicial', nome: 'Documentos Judiciais', icone: <FileText className="h-4 w-4" /> },
  { id: 'contrato', nome: 'Contratos', icone: <FileText className="h-4 w-4" /> },
  { id: 'foto', nome: 'Fotos', icone: <Image className="h-4 w-4" /> },
  { id: 'outro', nome: 'Outros', icone: <File className="h-4 w-4" /> }
]

// Tipos de documentos por categoria
const tiposDocumentos = {
  pessoal: [
    'RG',
    'CPF',
    'Certidão de Nascimento',
    'Certidão de Casamento',
    'Certidão de Óbito',
    'Comprovante de Residência',
    'Outro'
  ],
  imovel: [
    'Escritura',
    'Matrícula',
    'IPTU',
    'Contrato de Compra e Venda',
    'Certidão Negativa de Débitos',
    'Laudo de Avaliação',
    'Outro'
  ],
  financeiro: [
    'Extrato Bancário',
    'Comprovante de Pagamento',
    'Declaração de Imposto de Renda',
    'Comprovante de Rendimentos',
    'Fatura de Cartão de Crédito',
    'Outro'
  ],
  judicial: [
    'Petição Inicial',
    'Contestação',
    'Sentença',
    'Acórdão',
    'Procuração',
    'Substabelecimento',
    'Outro'
  ],
  contrato: [
    'Contrato de Aluguel',
    'Contrato de Prestação de Serviços',
    'Contrato de Trabalho',
    'Contrato Social',
    'Outro'
  ],
  foto: [
    'Foto de Imóvel',
    'Foto de Bem Móvel',
    'Foto de Documento',
    'Outro'
  ],
  outro: [
    'Documento Diverso'
  ]
}

// Função para obter o ícone baseado no tipo de arquivo
const getFileIcon = (fileName) => {
  if (!fileName) return <File className="h-5 w-5" />
  
  const extension = fileName.split('.').pop().toLowerCase()
  
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
    return <Image className="h-5 w-5" />
  } else if (['pdf'].includes(extension)) {
    return <FileText className="h-5 w-5" />
  } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
    return <FileArchive className="h-5 w-5" />
  } else {
    return <File className="h-5 w-5" />
  }
}

// Componente principal
export default function SistemaAnexos() {
  const { user, inventarioAtivo } = useAuth()
  const [documentos, setDocumentos] = useState([])
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos')
  const [visualizandoDocumento, setVisualizandoDocumento] = useState(null)
  const [filtro, setFiltro] = useState('')
  const [ordenacao, setOrdenacao] = useState('data-desc')
  const [novoDocumento, setNovoDocumento] = useState({
    nome: '',
    descricao: '',
    categoria: '',
    tipo: '',
    arquivo: null,
    data: new Date().toISOString().split('T')[0],
    responsavel: user?.name || 'Usuário',
    tags: []
  })
  const [novaTag, setNovaTag] = useState('')
  const [erroUpload, setErroUpload] = useState('')

  // Carregar documentos do localStorage
  useEffect(() => {
    if (inventarioAtivo) {
      const docsArmazenados = localStorage.getItem(`documentos_${inventarioAtivo.id}`)
      if (docsArmazenados) {
        setDocumentos(JSON.parse(docsArmazenados))
      }
    }
  }, [inventarioAtivo])

  // Salvar documentos no localStorage
  useEffect(() => {
    if (inventarioAtivo && documentos.length > 0) {
      localStorage.setItem(`documentos_${inventarioAtivo.id}`, JSON.stringify(documentos))
    }
  }, [documentos, inventarioAtivo])

  // Filtrar documentos
  const documentosFiltrados = documentos.filter(doc => {
    // Filtro por categoria
    if (categoriaAtiva !== 'todos' && doc.categoria !== categoriaAtiva) {
      return false
    }
    
    // Filtro por texto
    if (filtro && !doc.nome.toLowerCase().includes(filtro.toLowerCase()) && 
        !doc.descricao.toLowerCase().includes(filtro.toLowerCase()) &&
        !doc.tags.some(tag => tag.toLowerCase().includes(filtro.toLowerCase()))) {
      return false
    }
    
    return true
  })

  // Ordenar documentos
  const documentosOrdenados = [...documentosFiltrados].sort((a, b) => {
    switch (ordenacao) {
      case 'data-asc':
        return new Date(a.data) - new Date(b.data)
      case 'data-desc':
        return new Date(b.data) - new Date(a.data)
      case 'nome-asc':
        return a.nome.localeCompare(b.nome)
      case 'nome-desc':
        return b.nome.localeCompare(a.nome)
      default:
        return new Date(b.data) - new Date(a.data)
    }
  })

  // Manipular upload de arquivo
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Verificar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErroUpload('O arquivo é muito grande. Tamanho máximo: 5MB.')
      return
    }
    
    setErroUpload('')
    
    // Converter para base64
    const reader = new FileReader()
    reader.onload = (event) => {
      setNovoDocumento({
        ...novoDocumento,
        arquivo: {
          nome: file.name,
          tipo: file.type,
          tamanho: file.size,
          conteudo: event.target.result
        }
      })
    }
    reader.readAsDataURL(file)
  }

  // Adicionar tag
  const adicionarTag = () => {
    if (novaTag.trim() && !novoDocumento.tags.includes(novaTag.trim())) {
      setNovoDocumento({
        ...novoDocumento,
        tags: [...novoDocumento.tags, novaTag.trim()]
      })
      setNovaTag('')
    }
  }

  // Remover tag
  const removerTag = (tag) => {
    setNovoDocumento({
      ...novoDocumento,
      tags: novoDocumento.tags.filter(t => t !== tag)
    })
  }

  // Salvar documento
  const salvarDocumento = () => {
    if (!novoDocumento.nome || !novoDocumento.categoria || !novoDocumento.tipo || !novoDocumento.arquivo) {
      setErroUpload('Preencha todos os campos obrigatórios.')
      return
    }
    
    const novoDoc = {
      ...novoDocumento,
      id: `doc_${Date.now()}`,
      dataUpload: new Date().toISOString()
    }
    
    setDocumentos([...documentos, novoDoc])
    
    // Resetar formulário
    setNovoDocumento({
      nome: '',
      descricao: '',
      categoria: '',
      tipo: '',
      arquivo: null,
      data: new Date().toISOString().split('T')[0],
      responsavel: user?.name || 'Usuário',
      tags: []
    })
    
    setErroUpload('')
  }

  // Excluir documento
  const excluirDocumento = (id) => {
    setDocumentos(documentos.filter(doc => doc.id !== id))
    if (visualizandoDocumento?.id === id) {
      setVisualizandoDocumento(null)
    }
  }

  // Atualizar tipo de documento quando a categoria mudar
  const handleCategoriaChange = (value) => {
    setNovoDocumento({
      ...novoDocumento,
      categoria: value,
      tipo: ''
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sistema de Anexos</h2>
          <p className="text-muted-foreground">
            Gerencie todos os documentos do inventário de forma organizada
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              Novo Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Documento</DialogTitle>
              <DialogDescription>
                Preencha as informações e faça upload do arquivo
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Documento *</Label>
                  <Input
                    id="nome"
                    value={novoDocumento.nome}
                    onChange={(e) => setNovoDocumento({...novoDocumento, nome: e.target.value})}
                    placeholder="Ex: Escritura do Imóvel"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data">Data do Documento *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={novoDocumento.data}
                    onChange={(e) => setNovoDocumento({...novoDocumento, data: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select
                    value={novoDocumento.categoria}
                    onValueChange={handleCategoriaChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            {cat.icone}
                            <span>{cat.nome}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Documento *</Label>
                  <Select
                    value={novoDocumento.tipo}
                    onValueChange={(value) => setNovoDocumento({...novoDocumento, tipo: value})}
                    disabled={!novoDocumento.categoria}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {novoDocumento.categoria && tiposDocumentos[novoDocumento.categoria]?.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={novoDocumento.descricao}
                  onChange={(e) => setNovoDocumento({...novoDocumento, descricao: e.target.value})}
                  placeholder="Descreva o documento..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="arquivo">Arquivo *</Label>
                <Input
                  id="arquivo"
                  type="file"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {novoDocumento.arquivo && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getFileIcon(novoDocumento.arquivo.nome)}
                    <span>{novoDocumento.arquivo.nome}</span>
                    <span className="text-xs">
                      ({Math.round(novoDocumento.arquivo.tamanho / 1024)} KB)
                    </span>
                  </div>
                )}
                {erroUpload && (
                  <div className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {erroUpload}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={novaTag}
                    onChange={(e) => setNovaTag(e.target.value)}
                    placeholder="Adicione tags..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarTag())}
                  />
                  <Button type="button" variant="outline" onClick={adicionarTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {novoDocumento.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {novoDocumento.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removerTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={salvarDocumento}>Salvar Documento</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar com categorias */}
        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 p-2">
              <Button
                variant={categoriaAtiva === 'todos' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCategoriaAtiva('todos')}
              >
                <File className="h-4 w-4 mr-2" />
                Todos os Documentos
                <Badge variant="secondary" className="ml-auto">
                  {documentos.length}
                </Badge>
              </Button>
              
              {categorias.map((cat) => (
                <Button
                  key={cat.id}
                  variant={categoriaAtiva === cat.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setCategoriaAtiva(cat.id)}
                >
                  {cat.icone}
                  <span className="ml-2">{cat.nome}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {documentos.filter(doc => doc.categoria === cat.id).length}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Lista de documentos */}
        <div className="space-y-4">
          {/* Filtros e ordenação */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                className="pl-8"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            
            <Select
              value={ordenacao}
              onValueChange={setOrdenacao}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="data-desc">Mais recentes</SelectItem>
                <SelectItem value="data-asc">Mais antigos</SelectItem>
                <SelectItem value="nome-asc">Nome (A-Z)</SelectItem>
                <SelectItem value="nome-desc">Nome (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Resultados */}
          {documentosOrdenados.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nenhum documento encontrado</h3>
                <p className="text-muted-foreground text-center mt-2">
                  {documentos.length === 0 
                    ? "Adicione documentos clicando no botão 'Novo Documento'"
                    : "Tente ajustar os filtros para encontrar o que procura"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Documentos ({documentosOrdenados.length})</CardTitle>
                <CardDescription>
                  {categoriaAtiva === 'todos' 
                    ? 'Todos os documentos do inventário'
                    : `Documentos da categoria ${categorias.find(c => c.id === categoriaAtiva)?.nome}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentosOrdenados.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getFileIcon(doc.arquivo?.nome)}
                            <span>{doc.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {categorias.find(c => c.id === doc.categoria)?.nome || doc.categoria}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(doc.data).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>{doc.responsavel}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setVisualizandoDocumento(doc)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => excluirDocumento(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Modal de visualização de documento */}
      {visualizandoDocumento && (
        <Dialog open={!!visualizandoDocumento} onOpenChange={() => setVisualizandoDocumento(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getFileIcon(visualizandoDocumento.arquivo?.nome)}
                {visualizandoDocumento.nome}
              </DialogTitle>
              <DialogDescription>
                {visualizandoDocumento.descricao || 'Sem descrição'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-4 overflow-hidden flex-1">
              {/* Visualização do documento */}
              <div className="bg-muted rounded-md overflow-hidden flex items-center justify-center min-h-[300px]">
                {visualizandoDocumento.arquivo?.tipo?.startsWith('image/') ? (
                  <img
                    src={visualizandoDocumento.arquivo.conteudo}
                    alt={visualizandoDocumento.nome}
                    className="max-w-full max-h-[60vh] object-contain"
                  />
                ) : visualizandoDocumento.arquivo?.tipo === 'application/pdf' ? (
                  <iframe
                    src={visualizandoDocumento.arquivo.conteudo}
                    title={visualizandoDocumento.nome}
                    className="w-full h-[60vh]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    {getFileIcon(visualizandoDocumento.arquivo?.nome)}
                    <p className="mt-4 text-muted-foreground">
                      Visualização não disponível para este tipo de arquivo
                    </p>
                    <Button className="mt-4" onClick={() => {
                      // Criar um link temporário para download
                      const link = document.createElement('a')
                      link.href = visualizandoDocumento.arquivo.conteudo
                      link.download = visualizandoDocumento.arquivo.nome
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Arquivo
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Detalhes do documento */}
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4 p-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Categoria</h4>
                    <Badge variant="outline">
                      {categorias.find(c => c.id === visualizandoDocumento.categoria)?.nome || visualizandoDocumento.categoria}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Tipo</h4>
                    <p>{visualizandoDocumento.tipo}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Data do Documento</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(visualizandoDocumento.data).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Data de Upload</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(visualizandoDocumento.dataUpload).toLocaleDateString('pt-BR')}
                      {' '}
                      {new Date(visualizandoDocumento.dataUpload).toLocaleTimeString('pt-BR')}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Responsável</h4>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {visualizandoDocumento.responsavel}
                    </div>
                  </div>
                  
                  {visualizandoDocumento.arquivo && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Arquivo</h4>
                      <div className="flex items-center gap-2">
                        {getFileIcon(visualizandoDocumento.arquivo.nome)}
                        <span>{visualizandoDocumento.arquivo.nome}</span>
                        <span className="text-xs text-muted-foreground">
                          ({Math.round(visualizandoDocumento.arquivo.tamanho / 1024)} KB)
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {visualizandoDocumento.tags && visualizandoDocumento.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {visualizandoDocumento.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="pt-2">
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        excluirDocumento(visualizandoDocumento.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Documento
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  // Criar um link temporário para download
                  const link = document.createElement('a')
                  link.href = visualizandoDocumento.arquivo.conteudo
                  link.download = visualizandoDocumento.arquivo.nome
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Arquivo
              </Button>
              <DialogClose asChild>
                <Button>Fechar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

