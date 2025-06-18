import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from './ui/card'

const Login = () => {
  const { signIn, signUp, loading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    perfil: 'inventariante'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        alert('Senhas não coincidem')
        return
      }
      
      if (!formData.nome.trim()) {
        alert('Nome é obrigatório')
        return
      }
    }

    try {
      let result
      if (isLogin) {
        result = await signIn(formData.email, formData.password)
      } else {
        result = await signUp(formData.email, formData.password, {
          nome: formData.nome,
          perfil: formData.perfil
        })
      }

      if (!result.success) {
        alert(result.error || 'Erro na autenticação')
      }
    } catch (error) {
      console.error('Erro na autenticação:', error)
      alert('Erro na autenticação: ' + error.message)
    }
  }

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">InventárioLegal</h1>
          <p className="text-gray-600">Sistema de Gestão de Espólio</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? 'Entrar na Conta' : 'Criar Conta'}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <Input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => updateFormData('nome', e.target.value)}
                      placeholder="Seu nome completo"
                      required={!isLogin}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Perfil
                    </label>
                    <select
                      value={formData.perfil}
                      onChange={(e) => updateFormData('perfil', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="inventariante">Inventariante</option>
                      <option value="herdeiro">Herdeiro</option>
                      <option value="advogado">Advogado</option>
                      <option value="contador">Contador</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha *
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  placeholder="Sua senha"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Senha *
                  </label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    placeholder="Confirme sua senha"
                    required
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {isLogin ? 'Não tem conta? Criar conta' : 'Já tem conta? Fazer login'}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Sistema seguro com Supabase</p>
          <div className="flex justify-center gap-2 mt-2">
            <Badge variant="success">Dados Protegidos</Badge>
            <Badge variant="primary">Multi-tenant</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

