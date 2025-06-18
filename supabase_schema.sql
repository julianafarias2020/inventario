-- =====================================================
-- INVENTÁRIOLEGAL - CONFIGURAÇÃO COMPLETA DO SUPABASE
-- =====================================================

-- 1. TABELA DE USUÁRIOS (profiles)
-- Estende a tabela auth.users do Supabase
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  perfil VARCHAR(50) NOT NULL CHECK (perfil IN ('inventariante', 'herdeiro', 'advogado', 'contador')),
  telefone VARCHAR(20),
  cpf VARCHAR(14),
  endereco TEXT,
  foto_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE INVENTÁRIOS
CREATE TABLE public.inventarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  falecido VARCHAR(255) NOT NULL,
  data_obito DATE NOT NULL,
  numero_processo VARCHAR(100),
  comarca VARCHAR(255),
  vara VARCHAR(255),
  status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'finalizado', 'suspenso')),
  observacoes TEXT,
  criado_por UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE PARTICIPANTES DO INVENTÁRIO
CREATE TABLE public.inventario_participantes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inventario_id UUID REFERENCES public.inventarios(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  papel VARCHAR(50) NOT NULL CHECK (papel IN ('inventariante', 'herdeiro', 'advogado', 'contador')),
  permissoes JSONB DEFAULT '{}',
  ativo BOOLEAN DEFAULT true,
  convidado_por UUID REFERENCES public.profiles(id),
  data_convite TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_aceite TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(inventario_id, usuario_id)
);

-- 4. TABELA DE HERDEIROS
CREATE TABLE public.herdeiros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inventario_id UUID REFERENCES public.inventarios(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  rg VARCHAR(20),
  telefone VARCHAR(20),
  email VARCHAR(255),
  endereco TEXT,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('legitimo', 'meeira', 'conjuge', 'testamento', 'outro')),
  observacoes TEXT,
  foto_url TEXT,
  documentos JSONB DEFAULT '[]',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(inventario_id, cpf)
);

-- 5. TABELA DE BENS
CREATE TABLE public.bens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inventario_id UUID REFERENCES public.inventarios(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  subcategoria VARCHAR(100),
  descricao TEXT,
  valor_avaliacao DECIMAL(15,2),
  data_avaliacao DATE,
  endereco TEXT,
  matricula VARCHAR(100),
  registro VARCHAR(100),
  observacoes TEXT,
  documentos JSONB DEFAULT '[]',
  fotos JSONB DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'vendido', 'doado', 'partilhado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA DE PERCENTUAIS DOS HERDEIROS POR BEM
CREATE TABLE public.bem_herdeiros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bem_id UUID REFERENCES public.bens(id) ON DELETE CASCADE,
  herdeiro_id UUID REFERENCES public.herdeiros(id) ON DELETE CASCADE,
  percentual DECIMAL(5,2) NOT NULL CHECK (percentual >= 0 AND percentual <= 100),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bem_id, herdeiro_id)
);

-- 7. TABELA DE MOVIMENTAÇÕES FINANCEIRAS
CREATE TABLE public.movimentacoes_financeiras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inventario_id UUID REFERENCES public.inventarios(id) ON DELETE CASCADE,
  bem_id UUID REFERENCES public.bens(id) ON DELETE SET NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  categoria VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  valor DECIMAL(15,2) NOT NULL,
  data_movimentacao DATE NOT NULL,
  responsavel_id UUID REFERENCES public.profiles(id),
  comprovante_url TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABELA DE CONTRATOS DE ALUGUEL
CREATE TABLE public.contratos_aluguel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inventario_id UUID REFERENCES public.inventarios(id) ON DELETE CASCADE,
  bem_id UUID REFERENCES public.bens(id) ON DELETE CASCADE,
  inquilino_nome VARCHAR(255) NOT NULL,
  inquilino_cpf VARCHAR(14) NOT NULL,
  inquilino_telefone VARCHAR(20),
  inquilino_email VARCHAR(255),
  valor_aluguel DECIMAL(10,2) NOT NULL,
  valor_condominio DECIMAL(10,2) DEFAULT 0,
  valor_iptu DECIMAL(10,2) DEFAULT 0,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  dia_vencimento INTEGER NOT NULL CHECK (dia_vencimento >= 1 AND dia_vencimento <= 31),
  status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'finalizado', 'suspenso')),
  observacoes TEXT,
  contrato_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TABELA DE PAGAMENTOS DE ALUGUEL
CREATE TABLE public.pagamentos_aluguel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contrato_id UUID REFERENCES public.contratos_aluguel(id) ON DELETE CASCADE,
  mes_referencia DATE NOT NULL,
  valor_pago DECIMAL(10,2) NOT NULL,
  data_pagamento DATE NOT NULL,
  data_vencimento DATE NOT NULL,
  multa DECIMAL(10,2) DEFAULT 0,
  juros DECIMAL(10,2) DEFAULT 0,
  desconto DECIMAL(10,2) DEFAULT 0,
  observacoes TEXT,
  comprovante_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(contrato_id, mes_referencia)
);

-- 10. TABELA DE VOTAÇÕES
CREATE TABLE public.votacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inventario_id UUID REFERENCES public.inventarios(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('simples', 'multipla', 'aprovacao')),
  opcoes JSONB NOT NULL,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'ativa' CHECK (status IN ('ativa', 'finalizada', 'cancelada')),
  criado_por UUID REFERENCES public.profiles(id) NOT NULL,
  resultado JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. TABELA DE VOTOS
CREATE TABLE public.votos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  votacao_id UUID REFERENCES public.votacoes(id) ON DELETE CASCADE,
  herdeiro_id UUID REFERENCES public.herdeiros(id) ON DELETE CASCADE,
  opcao_escolhida VARCHAR(255) NOT NULL,
  justificativa TEXT,
  data_voto TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(votacao_id, herdeiro_id)
);

-- 12. TABELA DE COMENTÁRIOS
CREATE TABLE public.comentarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inventario_id UUID REFERENCES public.inventarios(id) ON DELETE CASCADE,
  modulo VARCHAR(100) NOT NULL,
  referencia_id UUID,
  autor_id UUID REFERENCES public.profiles(id) NOT NULL,
  conteudo TEXT NOT NULL,
  prioridade VARCHAR(50) DEFAULT 'normal' CHECK (prioridade IN ('baixa', 'normal', 'alta', 'urgente')),
  status VARCHAR(50) DEFAULT 'aberto' CHECK (status IN ('aberto', 'resolvido', 'fechado')),
  parent_id UUID REFERENCES public.comentarios(id),
  anexos JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. TABELA DE ANEXOS/DOCUMENTOS
CREATE TABLE public.anexos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inventario_id UUID REFERENCES public.inventarios(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  tamanho_bytes BIGINT,
  mime_type VARCHAR(100),
  tags JSONB DEFAULT '[]',
  uploaded_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. TABELA DE RELATÓRIOS
CREATE TABLE public.relatorios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inventario_id UUID REFERENCES public.inventarios(id) ON DELETE CASCADE,
  tipo VARCHAR(100) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  parametros JSONB DEFAULT '{}',
  arquivo_url TEXT,
  status VARCHAR(50) DEFAULT 'processando' CHECK (status IN ('processando', 'concluido', 'erro')),
  gerado_por UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. TABELA DE CONFIGURAÇÕES DO INVENTÁRIO
CREATE TABLE public.inventario_configuracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inventario_id UUID REFERENCES public.inventarios(id) ON DELETE CASCADE UNIQUE,
  configuracoes JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para consultas frequentes
CREATE INDEX idx_inventarios_criado_por ON public.inventarios(criado_por);
CREATE INDEX idx_inventario_participantes_inventario ON public.inventario_participantes(inventario_id);
CREATE INDEX idx_inventario_participantes_usuario ON public.inventario_participantes(usuario_id);
CREATE INDEX idx_herdeiros_inventario ON public.herdeiros(inventario_id);
CREATE INDEX idx_bens_inventario ON public.bens(inventario_id);
CREATE INDEX idx_bem_herdeiros_bem ON public.bem_herdeiros(bem_id);
CREATE INDEX idx_bem_herdeiros_herdeiro ON public.bem_herdeiros(herdeiro_id);
CREATE INDEX idx_movimentacoes_inventario ON public.movimentacoes_financeiras(inventario_id);
CREATE INDEX idx_movimentacoes_bem ON public.movimentacoes_financeiras(bem_id);
CREATE INDEX idx_contratos_inventario ON public.contratos_aluguel(inventario_id);
CREATE INDEX idx_contratos_bem ON public.contratos_aluguel(bem_id);
CREATE INDEX idx_pagamentos_contrato ON public.pagamentos_aluguel(contrato_id);
CREATE INDEX idx_votacoes_inventario ON public.votacoes(inventario_id);
CREATE INDEX idx_votos_votacao ON public.votos(votacao_id);
CREATE INDEX idx_comentarios_inventario ON public.comentarios(inventario_id);
CREATE INDEX idx_comentarios_modulo ON public.comentarios(modulo, referencia_id);
CREATE INDEX idx_anexos_inventario ON public.anexos(inventario_id);
CREATE INDEX idx_relatorios_inventario ON public.relatorios(inventario_id);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas com updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventarios_updated_at BEFORE UPDATE ON public.inventarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_herdeiros_updated_at BEFORE UPDATE ON public.herdeiros FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bens_updated_at BEFORE UPDATE ON public.bens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bem_herdeiros_updated_at BEFORE UPDATE ON public.bem_herdeiros FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_movimentacoes_updated_at BEFORE UPDATE ON public.movimentacoes_financeiras FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contratos_updated_at BEFORE UPDATE ON public.contratos_aluguel FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_votacoes_updated_at BEFORE UPDATE ON public.votacoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comentarios_updated_at BEFORE UPDATE ON public.comentarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON public.inventario_configuracoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

