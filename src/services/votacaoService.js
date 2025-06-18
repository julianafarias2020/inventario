// src/services/votacaoService.js

export async function createVotacao(data) {
  try {
    // Simula um POST para um backend — substitua pelo seu backend real
    console.log('Enviando votação para o backend...', data)
    return Promise.resolve({ success: true })
  } catch (error) {
    throw new Error('Erro ao criar votação')
  }
}
