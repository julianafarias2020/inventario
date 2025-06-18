
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

export default function ModalNovaMovimentacao({
  aberta,
  aoFechar,
  novaMovimentacao,
  setNovaMovimentacao,
  aoSalvar
}) {
  const handleChange = (campo) => (e) => {
    setNovaMovimentacao(prev => ({ ...prev, [campo]: e.target.value }))
  }

  return (
    <Dialog open={aberta} onOpenChange={aoFechar}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Movimentação</DialogTitle>
          <DialogDescription>Preencha os dados da nova movimentação do fundo de caixa.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <select
                id="tipo"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={novaMovimentacao.tipo}
                onChange={handleChange('tipo')}
              >
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>
            <div>
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                value={novaMovimentacao.valor}
                onChange={handleChange('valor')}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={novaMovimentacao.descricao}
              onChange={handleChange('descricao')}
            />
          </div>

          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Input
              id="categoria"
              value={novaMovimentacao.categoria}
              onChange={handleChange('categoria')}
            />
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={novaMovimentacao.observacoes}
              onChange={handleChange('observacoes')}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={aoSalvar}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
