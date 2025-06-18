import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardHeader, CardTitle, CardContent, Badge, Grid } from './ui/card'

const Dashboard = () => {
  const { inventarioAtivo, user } = useAuth()
  const [stats, setStats] = useState({
    totalHerdeiros: 0,
    totalBens: 0,
    valorTotalBens: 0,
    movimentacoesRecentes: 0,
    votacoesAbertas: 0,
    comentariosNaoLidos: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (inventarioAtivo) {
      loadDashboardData()
    }
  }, [inventarioAtivo])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Simular carregamento de dados do localStorage ou Supabase
      const inventarioKey = `inventario_${inventarioAtivo.id}`
      
      // Carregar herdeiros
      const herdeiros = JSON.parse(localStorage.getItem(`${inventarioKey}_herdeiros`) || '[]')
      
      // Carregar bens
      const bens = JSON.parse(localStorage.getItem(`${inventarioKey}_bens`) || '[]')
      
      // Carregar movimentações
      const movimentacoes = JSON.parse(localStorage.getItem(`${inventarioKey}_movimentacoes`) || '[]')
      
      // Carregar votações
      const votacoes = JSON.parse(localStorage.getItem(`${inventarioKey}_votacoes`) || '[]')
      
      // Calcular estatísticas
      const valorTotal = bens.reduce((total, bem) => {
        return total + (parseFloat(bem.valor_avaliacao) || 0)
      }, 0)
      
      const votacoesAbertas = votacoes.filter(v => v.status === 'aberta').length
      
      setStats({
        totalHerdeiros: herdeiros.length,
        totalBens: bens.length,
        valorTotalBens: valorTotal,
        movimentacoesRecentes: movimentacoes.length,
        votacoesAbertas: votacoesAbertas,
        comentariosNaoLidos: 0
      })
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!inventarioAtivo) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Selecione um inventário para ver o dashboard
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Inventário: {inventarioAtivo.nome}</p>
        </div>
        <Badge variant="primary">
          {user?.user_metadata?.nome || user?.email}
        </Badge>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Carregando dados...</div>
        </div>
      ) : (
        <>
          {/* Cards de Estatísticas */}
          <Grid cols={3}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Herdeiros</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalHerdeiros}</p>
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">👥</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Bens Cadastrados</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBens}</p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">🏠</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Valor Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {stats.valorTotalBens.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm">💰</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Cards de Atividades */}
          <Grid cols={2}>
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Movimentações Financeiras</p>
                      <p className="text-sm text-gray-600">{stats.movimentacoesRecentes} registros</p>
                    </div>
                    <Badge variant="secondary">{stats.movimentacoesRecentes}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Votações Abertas</p>
                      <p className="text-sm text-gray-600">Aguardando participação</p>
                    </div>
                    <Badge variant={stats.votacoesAbertas > 0 ? "warning" : "success"}>
                      {stats.votacoesAbertas}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Comentários</p>
                      <p className="text-sm text-gray-600">Sistema de comunicação</p>
                    </div>
                    <Badge variant="primary">Ativo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações do Inventário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nome do Inventário</p>
                    <p className="text-gray-900">{inventarioAtivo.nome}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Falecido</p>
                    <p className="text-gray-900">{inventarioAtivo.falecido_nome}</p>
                  </div>
                  
                  {inventarioAtivo.falecido_data_obito && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Data do Óbito</p>
                      <p className="text-gray-900">
                        {new Date(inventarioAtivo.falecido_data_obito).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Criado em</p>
                    <p className="text-gray-900">
                      {new Date(inventarioAtivo.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Alertas e Notificações */}
          {stats.votacoesAbertas > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-yellow-400 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Você tem {stats.votacoesAbertas} votação(ões) aguardando sua participação
                    </p>
                    <p className="text-sm text-gray-600">
                      Acesse o módulo "Sistema de Votação" para participar
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {stats.totalHerdeiros === 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-blue-400 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Comece cadastrando os herdeiros
                    </p>
                    <p className="text-sm text-gray-600">
                      Acesse o módulo "Herdeiros" para começar o inventário
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard

