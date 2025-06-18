import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Button } from './ui/button'

const ModalVoto = ({ aberto, aoFechar, votacao }) => {
  const [opcao, setOpcao] = useState('sim')

  if (!votacao) return null

  const votar = () => {
    // Simulação de votação (sem persistência)
    alert('Voto registrado: ' + opcao)
    aoFechar()
  }

  return (
    <Dialog open={aberto} onOpenChange={aoFechar}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Votar - {votacao.titulo}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">{votacao.descricao}</p>
        <div className="space-y-2">
          <RadioGroup value={opcao} onValueChange={setOpcao}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="sim" />
              <Label htmlFor="sim">Sim, concordo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="nao" />
              <Label htmlFor="nao">Não concordo</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={aoFechar}>Cancelar</Button>
          <Button onClick={votar} className="bg-green-600 text-white">Confirmar Voto</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModalVoto