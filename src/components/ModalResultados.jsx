import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Badge } from './ui/badge'

const ModalResultados = ({ aberto, aoFechar, votacao }) => {
  if (!votacao) return null

  // Simulação: contar votos
  const votos = votacao.votos || []
  const total = votos.length
  const sim = votos.filter(v => v.opcao === 'sim').length
  const nao = votos.filter(v => v.opcao === 'nao').length

  const percent = (qtd) => total ? ((qtd / total) * 100).toFixed(1) : '0.0'

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Resultados - {votacao.titulo}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">{votacao.descricao}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>✅ Sim</span>
            <Badge variant="outline">{sim} votos ({percent(sim)}%)</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>❌ Não</span>
            <Badge variant="outline">{nao} votos ({percent(nao)}%)</Badge>
          </div>
          <div className="flex justify-between items-center pt-2 border-t mt-2">
            <strong>Total:</strong>
            <span>{total} votos computados</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModalResultados