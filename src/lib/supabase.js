// =====================================================
// INVENTÁRIOLEGAL - CONFIGURAÇÃO SUPABASE PRODUÇÃO
// =====================================================

import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Credenciais do Supabase não encontradas. Verifique o arquivo .env')
}

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// =====================================================
// SERVIÇOS DE AUTENTICAÇÃO
// =====================================================

export const authService = {
  // Registrar novo usuário
  async signUp(email, password, userData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: userData.nome,
            perfil: userData.perfil || 'inventariante'
          }
        }
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro no registro:', error)
      throw error
    }
  },

  // Login
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  },

  // Logout
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Erro no logout:', error)
      throw error
    }
  },

  // Obter usuário atual
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.error('Erro ao obter usuário:', error)
      return null
    }
  },

  // Obter perfil do usuário
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao obter perfil:', error)
      return null
    }
  }
}

// =====================================================
// SERVIÇOS DE INVENTÁRIOS
// =====================================================

export const inventarioService = {
  // Criar inventário
  async create(inventarioData) {
    try {
      const user = await authService.getCurrentUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('inventarios')
        .insert({
          ...inventarioData,
          criado_por: user.id
        })
        .select()
        .single()
      
      if (error) throw error
      
      // Adicionar criador como inventariante
      await this.addParticipante(data.id, user.id, 'inventariante')
      
      return data
    } catch (error) {
      console.error('Erro ao criar inventário:', error)
      throw error
    }
  },

  // Listar inventários do usuário
  async getUserInventarios(userId) {
    try {
      const { data, error } = await supabase
        .from('inventarios')
        .select(`
          *,
          inventario_participantes!inner(papel, ativo)
        `)
        .eq('inventario_participantes.usuario_id', userId)
        .eq('inventario_participantes.ativo', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao listar inventários:', error)
      return []
    }
  },

  // Adicionar participante
  async addParticipante(inventarioId, usuarioId, papel) {
    try {
      const { data, error } = await supabase
        .from('inventario_participantes')
        .insert({
          inventario_id: inventarioId,
          usuario_id: usuarioId,
          papel: papel
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao adicionar participante:', error)
      throw error
    }
  }
}

// =====================================================
// SERVIÇOS DE HERDEIROS
// =====================================================

export const herdeiroService = {
  // Criar herdeiro
  async create(herdeiroData) {
    try {
      const { data, error } = await supabase
        .from('herdeiros')
        .insert(herdeiroData)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar herdeiro:', error)
      throw error
    }
  },

  // Listar herdeiros do inventário
  async getByInventario(inventarioId) {
    try {
      const { data, error } = await supabase
        .from('herdeiros')
        .select('*')
        .eq('inventario_id', inventarioId)
        .eq('ativo', true)
        .order('nome')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao listar herdeiros:', error)
      return []
    }
  },

  // Atualizar herdeiro
  async update(herdeiroId, updates) {
    try {
      const { data, error } = await supabase
        .from('herdeiros')
        .update(updates)
        .eq('id', herdeiroId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao atualizar herdeiro:', error)
      throw error
    }
  },

  // Excluir herdeiro
  async delete(herdeiroId) {
    try {
      const { error } = await supabase
        .from('herdeiros')
        .update({ ativo: false })
        .eq('id', herdeiroId)
      
      if (error) throw error
    } catch (error) {
      console.error('Erro ao excluir herdeiro:', error)
      throw error
    }
  }
}

// =====================================================
// SERVIÇOS DE BENS
// =====================================================

export const bemService = {
  // Criar bem
  async create(bemData) {
    try {
      const { data, error } = await supabase
        .from('bens')
        .insert(bemData)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar bem:', error)
      throw error
    }
  },

  // Listar bens do inventário
  async getByInventario(inventarioId) {
    try {
      const { data, error } = await supabase
        .from('bens')
        .select('*')
        .eq('inventario_id', inventarioId)
        .eq('status', 'ativo')
        .order('nome')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao listar bens:', error)
      return []
    }
  },

  // Atualizar bem
  async update(bemId, updates) {
    try {
      const { data, error } = await supabase
        .from('bens')
        .update(updates)
        .eq('id', bemId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao atualizar bem:', error)
      throw error
    }
  },

  // Definir percentuais dos herdeiros
  async setPercentuais(bemId, percentuais) {
    try {
      // Primeiro, remover percentuais existentes
      await supabase
        .from('bem_herdeiros')
        .delete()
        .eq('bem_id', bemId)
      
      // Inserir novos percentuais
      if (percentuais.length > 0) {
        const { data, error } = await supabase
          .from('bem_herdeiros')
          .insert(percentuais.map(p => ({
            bem_id: bemId,
            herdeiro_id: p.herdeiro_id,
            percentual: p.percentual,
            observacoes: p.observacoes
          })))
          .select()
        
        if (error) throw error
        return data
      }
    } catch (error) {
      console.error('Erro ao definir percentuais:', error)
      throw error
    }
  },

  // Obter percentuais do bem
  async getPercentuais(bemId) {
    try {
      const { data, error } = await supabase
        .from('bem_herdeiros')
        .select(`
          *,
          herdeiros(nome, cpf)
        `)
        .eq('bem_id', bemId)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao obter percentuais:', error)
      return []
    }
  }
}

// =====================================================
// SERVIÇOS FINANCEIROS
// =====================================================

export const financeiroService = {
  // Criar movimentação
  async createMovimentacao(movimentacaoData) {
    try {
      const user = await authService.getCurrentUser()
      const { data, error } = await supabase
        .from('movimentacoes_financeiras')
        .insert({
          ...movimentacaoData,
          responsavel_id: user?.id
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar movimentação:', error)
      throw error
    }
  },

  // Listar movimentações
  async getMovimentacoes(inventarioId, filtros = {}) {
    try {
      let query = supabase
        .from('movimentacoes_financeiras')
        .select(`
          *,
          bens(nome)
        `)
        .eq('inventario_id', inventarioId)
        .order('data_movimentacao', { ascending: false })
      
      if (filtros.tipo) {
        query = query.eq('tipo', filtros.tipo)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao listar movimentações:', error)
      return []
    }
  }
}

// =====================================================
// SERVIÇOS DE CONTRATOS
// =====================================================

export const contratoService = {
  // Criar contrato
  async create(contratoData) {
    try {
      const { data, error } = await supabase
        .from('contratos_aluguel')
        .insert(contratoData)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar contrato:', error)
      throw error
    }
  },

  // Listar contratos
  async getByInventario(inventarioId) {
    try {
      const { data, error } = await supabase
        .from('contratos_aluguel')
        .select(`
          *,
          bens(nome)
        `)
        .eq('inventario_id', inventarioId)
        .order('data_inicio', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao listar contratos:', error)
      return []
    }
  },

  // Registrar pagamento
  async registrarPagamento(pagamentoData) {
    try {
      const { data, error } = await supabase
        .from('pagamentos_aluguel')
        .insert(pagamentoData)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error)
      throw error
    }
  }
}

// =====================================================
// SERVIÇOS DE VOTAÇÃO
// =====================================================

export const votacaoService = {
  // Criar votação
  async create(votacaoData) {
    try {
      const user = await authService.getCurrentUser()
      const { data, error } = await supabase
        .from('votacoes')
        .insert({
          ...votacaoData,
          criado_por: user?.id
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar votação:', error)
      throw error
    }
  },

  // Listar votações
  async getByInventario(inventarioId) {
    try {
      const { data, error } = await supabase
        .from('votacoes')
        .select('*')
        .eq('inventario_id', inventarioId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao listar votações:', error)
      return []
    }
  },

  // Votar
  async votar(votoData) {
    try {
      const { data, error } = await supabase
        .from('votos')
        .upsert(votoData)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao votar:', error)
      throw error
    }
  }
}

// =====================================================
// SERVIÇOS DE COMENTÁRIOS
// =====================================================

export const comentarioService = {
  // Criar comentário
  async create(comentarioData) {
    try {
      const user = await authService.getCurrentUser()
      const { data, error } = await supabase
        .from('comentarios')
        .insert({
          ...comentarioData,
          autor_id: user?.id
        })
        .select(`
          *,
          profiles(nome)
        `)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar comentário:', error)
      throw error
    }
  },

  // Listar comentários
  async getByModulo(inventarioId, modulo) {
    try {
      const { data, error } = await supabase
        .from('comentarios')
        .select(`
          *,
          profiles(nome)
        `)
        .eq('inventario_id', inventarioId)
        .eq('modulo', modulo)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao listar comentários:', error)
      return []
    }
  }
}

