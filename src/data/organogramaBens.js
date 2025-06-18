// Sistema de Organograma Completo - 4 Níveis Hierárquicos
// Baseado na estrutura jurídica completa fornecida pelo usuário

export const organogramaBens = {
  "BENS_MOVEIS": {
    label: "BENS MÓVEIS",
    nivel2: {
      "DINHEIRO": {
        label: "Dinheiro",
        nivel3: {
          "SALDO_CONTAS": {
            label: "Saldo em contas bancárias",
            nivel4: {
              "REGULAR": { label: "Regular" },
              "BLOQUEADO": { label: "Bloqueado judicialmente" },
              "NAO_IDENTIFICADO": { label: "Valor não identificado" }
            }
          },
          "POUPANCA": {
            label: "Poupança",
            nivel4: {
              "REGULAR": { label: "Regular" },
              "TERCEIROS": { label: "Em nome de terceiros" }
            }
          },
          "INVESTIMENTOS": {
            label: "Investimentos",
            nivel4: {
              "RESGATAVEL": { label: "Comprovado e resgatável" },
              "SEM_DOC": { label: "Sem documentação" },
              "DISPUTA": { label: "Em disputa" }
            }
          },
          "OUTROS_VALORES": {
            label: "Outros valores em dinheiro",
            nivel4: {
              "COMPROVADO": { label: "Comprovado" },
              "NAO_DECLARADO": { label: "Não declarado" },
              "INCERTO": { label: "Valor incerto" }
            }
          }
        }
      },
      "ACOES_PARTICIPACOES": {
        label: "Ações e participações",
        nivel3: {
          "EMPRESAS": {
            label: "Empresas",
            nivel4: {
              "REGISTRADA": { label: "Com participação registrada" },
              "INFORMAL": { label: "Participação informal" },
              "LITIGIO": { label: "Em litígio societário" }
            }
          },
          "COTAS_FUNDOS": {
            label: "Cotas em fundos de investimento",
            nivel4: {
              "LIQUIDEZ_IMEDIATA": { label: "Liquidez imediata" },
              "SEM_LIQUIDEZ": { label: "Sem liquidez" },
              "PENDENCIA": { label: "Pendência de resgate" }
            }
          },
          "OUTROS": {
            label: "Outros",
            nivel4: {
              "DOCUMENTADOS": { label: "Documentados" },
              "SEM_COMPROVACAO": { label: "Sem comprovação" },
              "DISPUTADOS": { label: "Disputados" }
            }
          }
        }
      },
      "VEICULOS": {
        label: "Veículos",
        nivel3: {
          "TERRESTRE": {
            label: "Terrestre",
            nivel4: {
              "REGULAR": { label: "Regular (licenciado)" },
              "ALIENADO": { label: "Alienado" },
              "COM_DEBITOS": { label: "Com débitos (IPVA, multas)" },
              "TERCEIROS": { label: "Em nome de terceiros" }
            }
          },
          "AEREOS": {
            label: "Aéreos",
            nivel4: {
              "ANAC": { label: "Com registro na ANAC" },
              "SEM_REGISTRO": { label: "Sem registro/documentação" }
            }
          },
          "AQUATICOS": {
            label: "Aquáticos",
            nivel4: {
              "REGULAR": { label: "Regular" },
              "TERCEIROS": { label: "Em nome de terceiros" }
            }
          },
          "OUTROS": {
            label: "Outros",
            nivel4: {
              "IDENTIFICADOS": { label: "Identificados" },
              "ABANDONADOS": { label: "Abandonados ou inservíveis" }
            }
          }
        }
      },
      "OBJETOS_VALOR": {
        label: "Objetos de valor",
        nivel3: {
          "JOIAS": {
            label: "Joias",
            nivel4: {
              "AVALIADAS": { label: "Avaliadas e com nota" },
              "SEM_ORIGEM": { label: "Sem comprovação de origem" }
            }
          },
          "OBRAS_ARTE": {
            label: "Obras de arte",
            nivel4: {
              "AUTENTICADAS": { label: "Autenticadas" },
              "ESTIMADO": { label: "Valor estimado" },
              "DISPUTA": { label: "Em disputa" }
            }
          },
          "COLECOES": {
            label: "Coleções",
            nivel4: {
              "AVALIADAS": { label: "Avaliadas" },
              "SEM_VALOR": { label: "Sem valor definido" }
            }
          },
          "OUTROS": {
            label: "Outros",
            nivel4: {
              "COM_DOC": { label: "Com documentação" },
              "DIFICIL_AVALIACAO": { label: "Dificuldade de avaliação" }
            }
          }
        }
      },
      "CREDITO_DIVIDA": {
        label: "Crédito e dívida",
        nivel3: {
          "CHEQUES": {
            label: "Cheques",
            nivel4: {
              "COMPENSAVEIS": { label: "Compensáveis" },
              "PRESCRITOS": { label: "Prescritos" }
            }
          },
          "NOTAS_PROMISSORIAS": {
            label: "Notas promissórias",
            nivel4: {
              "VALIDAS": { label: "Válidas e executáveis" },
              "VENCIDAS": { label: "Vencidas ou prescritas" }
            }
          },
          "DIVIDAS_RECEBER": {
            label: "Dívidas a receber",
            nivel4: {
              "LIQUIDADAS": { label: "Liquidadas" },
              "COBRANCA": { label: "Em cobrança judicial" },
              "INCOBRAVEIS": { label: "Incobráveis" }
            }
          },
          "OUTROS": {
            label: "Outros",
            nivel4: {
              "COM_DOC": { label: "Com documentação" },
              "SEM_PROVA": { label: "Sem prova suficiente" }
            }
          }
        }
      }
    }
  },
  "BENS_IMOVEIS": {
    label: "BENS IMÓVEIS",
    nivel2: {
      "IMOVEIS": {
        label: "Imóveis",
        nivel3: {
          "RESIDENCIAL": {
            label: "Residencial",
            nivel4: {
              "REGULAR": { label: "Regular (matrícula e escritura)" },
              "SEM_ESCRITURA": { label: "Sem escritura" },
              "NAO_AVERBADA": { label: "Construção não averbada" },
              "LITIGIO": { label: "Em litígio" }
            }
          },
          "COMERCIAL": {
            label: "Comercial",
            nivel4: {
              "REGULAR": { label: "Regular" },
              "HIPOTECADO": { label: "Hipotecado" },
              "COM_DEBITOS": { label: "Com débitos (IPTU, condomínio)" }
            }
          },
          "INDUSTRIAL": {
            label: "Industrial",
            nivel4: {
              "REGULAR": { label: "Regular" },
              "USO_IRREGULAR": { label: "Uso irregular" },
              "AREA_DISPUTA": { label: "Área em disputa" }
            }
          },
          "MISTOS": {
            label: "Mistos",
            nivel4: {
              "REGULAR": { label: "Regular" },
              "PARTE_SEM_MATRICULA": { label: "Parte sem matrícula" },
              "AVERBACAO_PENDENTE": { label: "Averbação pendente" }
            }
          }
        }
      },
      "DIREITOS_IMOVEIS": {
        label: "Direitos sobre imóveis",
        nivel3: {
          "USUFRUTO": {
            label: "Usufruto",
            nivel4: {
              "FORMALIZADO": { label: "Formalizado" },
              "CONTESTACAO": { label: "Contestação de validade" }
            }
          },
          "SERVIDAO": {
            label: "Servidão",
            nivel4: {
              "REGISTRADA": { label: "Registrada" },
              "DISPUTA": { label: "Em disputa" }
            }
          },
          "OUTROS": {
            label: "Outros",
            nivel4: {
              "COM_DOC": { label: "Com documentação" },
              "INEXISTENTE": { label: "Inexistente ou incerto" }
            }
          }
        }
      }
    }
  },
  "DIREITOS_OBRIGACOES": {
    label: "DIREITOS E OBRIGAÇÕES",
    nivel2: {
      "DIREITO_RECEBER": {
        label: "Direito a receber",
        nivel3: {
          "SALARIOS": {
            label: "Salários",
            nivel4: {
              "DOCUMENTADOS": { label: "Documentados" },
              "PENDENTES": { label: "Pendentes de liberação judicial" }
            }
          },
          "RENDIMENTOS": {
            label: "Rendimentos",
            nivel4: {
              "CONTRATOS": { label: "Previstos em contratos" },
              "INCERTEZA": { label: "Incerteza de recebimento" }
            }
          },
          "CREDITOS": {
            label: "Créditos",
            nivel4: {
              "VALIDOS": { label: "Válidos" },
              "PRESCRITOS": { label: "Prescritos ou incobráveis" }
            }
          },
          "OUTROS": {
            label: "Outros",
            nivel4: {
              "DOCUMENTAL": { label: "Comprovação documental" },
              "SEM_TITULO": { label: "Sem título formal" }
            }
          }
        }
      },
      "DIVIDAS": {
        label: "Dívidas",
        nivel3: {
          "FINANCIAMENTOS": {
            label: "Financiamentos",
            nivel4: {
              "ATIVOS": { label: "Ativos" },
              "ATRASADOS": { label: "Atrasados" }
            }
          },
          "EMPRESTIMOS": {
            label: "Empréstimos",
            nivel4: {
              "FORMAIS": { label: "Contratados formalmente" },
              "SEM_CONTRATO": { label: "Sem contrato" }
            }
          },
          "OUTROS": {
            label: "Outros",
            nivel4: {
              "CONTESTADOS": { label: "Contestados pelos herdeiros" },
              "DUVIDOSA": { label: "Relevância duvidosa" }
            }
          }
        }
      },
      "CONTRATOS": {
        label: "Contratos",
        nivel3: {
          "LOCACAO": {
            label: "Contratos de locação",
            nivel4: {
              "VIGENTES": { label: "Vigentes" },
              "ENCERRADOS": { label: "Encerrados" },
              "DISPUTA": { label: "Em disputa judicial" }
            }
          },
          "SEGUROS": {
            label: "Seguros",
            nivel4: {
              "ATIVOS": { label: "Ativos" },
              "BENEFICIARIO_INDEFINIDO": { label: "Beneficiário não definido" }
            }
          },
          "OUTROS": {
            label: "Outros",
            nivel4: {
              "FORMALIZADOS": { label: "Formalizados" },
              "ORAIS": { label: "Orais / não documentados" }
            }
          }
        }
      },
      "ACOES_LEGAIS": {
        label: "Ações legais",
        nivel3: {
          "PROCESSOS": {
            label: "Processos em andamento",
            nivel4: {
              "VALOR_DEFINIDO": { label: "Valor definido" },
              "VALOR_ESTIMADO": { label: "Valor estimado" }
            }
          },
          "OUTROS": {
            label: "Outros",
            nivel4: {
              "GANHO_PROVAVEL": { label: "Com ganho provável" },
              "RISCO_PERDA": { label: "Com risco de perda" }
            }
          }
        }
      }
    }
  },
  "SEGUROS": {
    label: "SEGUROS",
    nivel2: {
      "SEGURO_VIDA": {
        label: "Seguro de vida",
        nivel3: {
          "REGULAR": {
            label: "Regular e com beneficiários",
            nivel4: {
              "VALOR_DEFINIDO": { label: "Valor definido" },
              "BENEFICIARIO_CONTESTADO": { label: "Beneficiário contestado" }
            }
          },
          "SEM_COMPROVACAO": {
            label: "Sem comprovação de existência",
            nivel4: {}
          }
        }
      }
    }
  },
  "PREVIDENCIA": {
    label: "PREVIDÊNCIA",
    nivel2: {
      "PLANO_PREVIDENCIA": {
        label: "Plano de previdência privada",
        nivel3: {
          "RESGATAVEL": {
            label: "Resgatável",
            nivel4: {
              "TRIBUTACAO": { label: "Sujeito a tributação" },
              "DISPUTA_BENEFICIARIOS": { label: "Disputa entre beneficiários" }
            }
          }
        }
      }
    }
  },
  "OUTROS_BENS": {
    label: "OUTROS BENS",
    nivel2: {
      "VALOR_MERCADO": {
        label: "Qualquer bem com valor de mercado",
        nivel3: {
          "IDENTIFICADO": {
            label: "Identificado e avaliado",
            nivel4: {
              "COM_DOC": { label: "Com documentação" },
              "SEM_NOTA": { label: "Sem nota fiscal ou prova de posse" },
              "DISPUTADO": { label: "Disputado entre herdeiros" }
            }
          }
        }
      }
    }
  }
}

// Função para obter opções do nível seguinte
export const getOpcoesNivel = (nivel1, nivel2, nivel3) => {
  const estrutura = organogramaBens[nivel1]
  if (!estrutura) return []
  
  if (!nivel2) {
    return Object.keys(estrutura.nivel2).map(key => ({
      value: key,
      label: estrutura.nivel2[key].label
    }))
  }
  
  const nivel2Obj = estrutura.nivel2[nivel2]
  if (!nivel2Obj) return []
  
  if (!nivel3) {
    return Object.keys(nivel2Obj.nivel3).map(key => ({
      value: key,
      label: nivel2Obj.nivel3[key].label
    }))
  }
  
  const nivel3Obj = nivel2Obj.nivel3[nivel3]
  if (!nivel3Obj) return []
  
  return Object.keys(nivel3Obj.nivel4).map(key => ({
    value: key,
    label: nivel3Obj.nivel4[key].label
  }))
}

// Função para obter label completo
export const getLabelCompleto = (nivel1, nivel2, nivel3, nivel4) => {
  const labels = []
  
  if (nivel1 && organogramaBens[nivel1]) {
    labels.push(organogramaBens[nivel1].label)
  }
  
  if (nivel2 && organogramaBens[nivel1]?.nivel2[nivel2]) {
    labels.push(organogramaBens[nivel1].nivel2[nivel2].label)
  }
  
  if (nivel3 && organogramaBens[nivel1]?.nivel2[nivel2]?.nivel3[nivel3]) {
    labels.push(organogramaBens[nivel1].nivel2[nivel2].nivel3[nivel3].label)
  }
  
  if (nivel4 && organogramaBens[nivel1]?.nivel2[nivel2]?.nivel3[nivel3]?.nivel4[nivel4]) {
    labels.push(organogramaBens[nivel1].nivel2[nivel2].nivel3[nivel3].nivel4[nivel4].label)
  }
  
  return labels.join(' → ')
}

// Opções do primeiro nível
export const opcoesNivel1 = Object.keys(organogramaBens).map(key => ({
  value: key,
  label: organogramaBens[key].label
}))

