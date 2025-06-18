import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'

const ModalCadastroVotacao = ({ aberto, aoFechar, aoSalvar }) => {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')

  const salvar = () => {
    if (!titulo.trim()) return alert('Título é obrigatório.')
    if (!descricao.trim()) return alert('Descrição é obrigatória.')

    const novaVotacao = {
      titulo,
      descricao,
      dataCriacao: new Date().toISOString(),
      votos: []
    }

    aoSalvar(novaVotacao)
    setTitulo('')
    setDescricao('')
    aoFechar()
  }

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Nova Votação</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm font-medium">Título</label>
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Aprovar reforma no imóvel" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição</label>
          <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Detalhe da proposta..." />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={aoFechar}>Cancelar</Button>
          <Button onClick={salvar} className="bg-blue-600 text-white">Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModalCadastroVotacao