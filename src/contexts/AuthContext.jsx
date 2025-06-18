import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService, inventarioService } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [inventarios, setInventarios] = useState([])
  const [inventarioAtivo, setInventarioAtivo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [perfilUsuario, setPerfilUsuario] = useState('inventariante')

  // Verificar usuário autenticado ao inicializar
  useEffect(() => {
    checkUser()
  }, [])

  // Carregar inventários quando usuário muda
  useEffect(() => {
    if (user) {
      loadInventarios()
      loadUserProfile()
    } else {
      setInventarios([])
      setInventarioAtivo(null)
    }
  }, [user])

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async () => {
    try {
      if (user) {
        const profile = await authService.getUserProfile(user.id)
        if (profile) {
          setPerfilUsuario(profile.perfil)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }

  const loadInventarios = async () => {
    try {
      if (user) {
        const userInventarios = await inventarioService.getUserInventarios(user.id)
        setInventarios(userInventarios)
        
        // Se não há inventário ativo, selecionar o primeiro
        if (userInventarios.length > 0 && !inventarioAtivo) {
          setInventarioAtivo(userInventarios[0])
        }
      }
    } catch (error) {
      console.error('Erro ao carregar inventários:', error)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { user: authUser } = await authService.signIn(email, password)
      setUser(authUser)
      return { success: true }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, userData) => {
    try {
      setLoading(true)
      const { user: authUser } = await authService.signUp(email, password, userData)
      setUser(authUser)
      setPerfilUsuario(userData.perfil || 'inventariante')
      return { success: true }
    } catch (error) {
      console.error('Erro no registro:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
      setInventarios([])
      setInventarioAtivo(null)
      setPerfilUsuario('inventariante')
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  const criarInventario = async (dadosInventario) => {
    try {
      const novoInventario = await inventarioService.create(dadosInventario)
      await loadInventarios()
      setInventarioAtivo(novoInventario)
      return { success: true, inventario: novoInventario }
    } catch (error) {
      console.error('Erro ao criar inventário:', error)
      return { success: false, error: error.message }
    }
  }

  const selecionarInventario = (inventario) => {
    setInventarioAtivo(inventario)
  }

  const value = {
    user,
    inventarios,
    inventarioAtivo,
    loading,
    perfilUsuario,
    signIn,
    signUp,
    signOut,
    logout: signOut, // Alias para compatibilidade
    criarInventario,
    selecionarInventario,
    loadInventarios
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

