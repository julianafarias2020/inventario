-- =====================================================
-- INVENTÁRIOLEGAL - POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario_participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.herdeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bem_herdeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos_aluguel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos_aluguel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relatorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario_configuracoes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA PROFILES
-- =====================================================

-- Usuários podem ver e editar apenas seu próprio perfil
CREATE POLICY "Usuários podem ver próprio perfil" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar próprio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir próprio perfil" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- POLÍTICAS PARA INVENTÁRIOS
-- =====================================================

-- Usuários podem ver inventários onde são participantes
CREATE POLICY "Ver inventários como participante" ON public.inventarios
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = id 
      AND usuario_id = auth.uid() 
      AND ativo = true
    )
  );

-- Apenas inventariantes podem criar inventários
CREATE POLICY "Inventariantes podem criar inventários" ON public.inventarios
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND perfil = 'inventariante'
    )
  );

-- Apenas inventariantes podem atualizar inventários
CREATE POLICY "Inventariantes podem atualizar inventários" ON public.inventarios
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = id 
      AND usuario_id = auth.uid() 
      AND papel = 'inventariante'
      AND ativo = true
    )
  );

-- =====================================================
-- POLÍTICAS PARA PARTICIPANTES
-- =====================================================

-- Ver participantes do mesmo inventário
CREATE POLICY "Ver participantes do inventário" ON public.inventario_participantes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes ip2
      WHERE ip2.inventario_id = inventario_id 
      AND ip2.usuario_id = auth.uid() 
      AND ip2.ativo = true
    )
  );

-- Apenas inventariantes podem gerenciar participantes
CREATE POLICY "Inventariantes gerenciam participantes" ON public.inventario_participantes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = inventario_participantes.inventario_id 
      AND usuario_id = auth.uid() 
      AND papel = 'inventariante'
      AND ativo = true
    )
  );

-- =====================================================
-- POLÍTICAS PARA HERDEIROS
-- =====================================================

-- Ver herdeiros do inventário onde é participante
CREATE POLICY "Ver herdeiros do inventário" ON public.herdeiros
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = herdeiros.inventario_id 
      AND usuario_id = auth.uid() 
      AND ativo = true
    )
  );

-- Inventariantes e advogados podem gerenciar herdeiros
CREATE POLICY "Gerenciar herdeiros" ON public.herdeiros
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = herdeiros.inventario_id 
      AND usuario_id = auth.uid() 
      AND papel IN ('inventariante', 'advogado')
      AND ativo = true
    )
  );

-- =====================================================
-- POLÍTICAS PARA BENS
-- =====================================================

-- Ver bens do inventário onde é participante
CREATE POLICY "Ver bens do inventário" ON public.bens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = bens.inventario_id 
      AND usuario_id = auth.uid() 
      AND ativo = true
    )
  );

-- Inventariantes e advogados podem gerenciar bens
CREATE POLICY "Gerenciar bens" ON public.bens
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = bens.inventario_id 
      AND usuario_id = auth.uid() 
      AND papel IN ('inventariante', 'advogado')
      AND ativo = true
    )
  );

-- =====================================================
-- POLÍTICAS PARA BEM_HERDEIROS
-- =====================================================

-- Ver percentuais dos bens do inventário
CREATE POLICY "Ver percentuais dos bens" ON public.bem_herdeiros
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bens b
      JOIN public.inventario_participantes ip ON b.inventario_id = ip.inventario_id
      WHERE b.id = bem_herdeiros.bem_id 
      AND ip.usuario_id = auth.uid() 
      AND ip.ativo = true
    )
  );

-- Inventariantes e advogados podem gerenciar percentuais
CREATE POLICY "Gerenciar percentuais" ON public.bem_herdeiros
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.bens b
      JOIN public.inventario_participantes ip ON b.inventario_id = ip.inventario_id
      WHERE b.id = bem_herdeiros.bem_id 
      AND ip.usuario_id = auth.uid() 
      AND ip.papel IN ('inventariante', 'advogado')
      AND ip.ativo = true
    )
  );

-- =====================================================
-- POLÍTICAS PARA MOVIMENTAÇÕES FINANCEIRAS
-- =====================================================

-- Ver movimentações do inventário
CREATE POLICY "Ver movimentações financeiras" ON public.movimentacoes_financeiras
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = movimentacoes_financeiras.inventario_id 
      AND usuario_id = auth.uid() 
      AND ativo = true
    )
  );

-- Inventariantes, advogados e contadores podem gerenciar movimentações
CREATE POLICY "Gerenciar movimentações" ON public.movimentacoes_financeiras
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = movimentacoes_financeiras.inventario_id 
      AND usuario_id = auth.uid() 
      AND papel IN ('inventariante', 'advogado', 'contador')
      AND ativo = true
    )
  );

-- =====================================================
-- POLÍTICAS PARA CONTRATOS DE ALUGUEL
-- =====================================================

-- Ver contratos do inventário
CREATE POLICY "Ver contratos de aluguel" ON public.contratos_aluguel
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = contratos_aluguel.inventario_id 
      AND usuario_id = auth.uid() 
      AND ativo = true
    )
  );

-- Inventariantes e advogados podem gerenciar contratos
CREATE POLICY "Gerenciar contratos" ON public.contratos_aluguel
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = contratos_aluguel.inventario_id 
      AND usuario_id = auth.uid() 
      AND papel IN ('inventariante', 'advogado')
      AND ativo = true
    )
  );

-- =====================================================
-- POLÍTICAS PARA PAGAMENTOS DE ALUGUEL
-- =====================================================

-- Ver pagamentos dos contratos do inventário
CREATE POLICY "Ver pagamentos de aluguel" ON public.pagamentos_aluguel
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.contratos_aluguel ca
      JOIN public.inventario_participantes ip ON ca.inventario_id = ip.inventario_id
      WHERE ca.id = pagamentos_aluguel.contrato_id 
      AND ip.usuario_id = auth.uid() 
      AND ip.ativo = true
    )
  );

-- Inventariantes, advogados e contadores podem gerenciar pagamentos
CREATE POLICY "Gerenciar pagamentos" ON public.pagamentos_aluguel
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.contratos_aluguel ca
      JOIN public.inventario_participantes ip ON ca.inventario_id = ip.inventario_id
      WHERE ca.id = pagamentos_aluguel.contrato_id 
      AND ip.usuario_id = auth.uid() 
      AND ip.papel IN ('inventariante', 'advogado', 'contador')
      AND ip.ativo = true
    )
  );

-- =====================================================
-- POLÍTICAS PARA VOTAÇÕES
-- =====================================================

-- Ver votações do inventário
CREATE POLICY "Ver votações" ON public.votacoes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = votacoes.inventario_id 
      AND usuario_id = auth.uid() 
      AND ativo = true
    )
  );

-- Inventariantes e advogados podem criar votações
CREATE POLICY "Criar votações" ON public.votacoes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = votacoes.inventario_id 
      AND usuario_id = auth.uid() 
      AND papel IN ('inventariante', 'advogado')
      AND ativo = true
    )
  );

-- Apenas criador pode atualizar votação
CREATE POLICY "Atualizar próprias votações" ON public.votacoes
  FOR UPDATE USING (criado_por = auth.uid());

-- =====================================================
-- POLÍTICAS PARA VOTOS
-- =====================================================

-- Ver votos das votações do inventário
CREATE POLICY "Ver votos" ON public.votos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.votacoes v
      JOIN public.inventario_participantes ip ON v.inventario_id = ip.inventario_id
      WHERE v.id = votos.votacao_id 
      AND ip.usuario_id = auth.uid() 
      AND ip.ativo = true
    )
  );

-- Herdeiros podem votar
CREATE POLICY "Herdeiros podem votar" ON public.votos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.herdeiros h
      JOIN public.votacoes v ON h.inventario_id = v.inventario_id
      WHERE h.id = votos.herdeiro_id 
      AND v.id = votos.votacao_id
      AND v.status = 'ativa'
    )
  );

-- =====================================================
-- POLÍTICAS PARA COMENTÁRIOS
-- =====================================================

-- Ver comentários do inventário
CREATE POLICY "Ver comentários" ON public.comentarios
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = comentarios.inventario_id 
      AND usuario_id = auth.uid() 
      AND ativo = true
    )
  );

-- Participantes podem criar comentários
CREATE POLICY "Criar comentários" ON public.comentarios
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = comentarios.inventario_id 
      AND usuario_id = auth.uid() 
      AND ativo = true
    )
  );

-- Apenas autor pode atualizar comentário
CREATE POLICY "Atualizar próprios comentários" ON public.comentarios
  FOR UPDATE USING (autor_id = auth.uid());

-- =====================================================
-- POLÍTICAS PARA ANEXOS
-- =====================================================

-- Ver anexos do inventário
CREATE POLICY "Ver anexos" ON public.anexos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = anexos.inventario_id 
      AND usuario_id = auth.uid() 
      AND ativo = true
    )
  );

-- Participantes podem fazer upload de anexos
CREATE POLICY "Upload de anexos" ON public.anexos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = anexos.inventario_id 
      AND usuario_id = auth.uid() 
      AND ativo = true
    )
  );

-- Apenas quem fez upload pode deletar
CREATE POLICY "Deletar próprios anexos" ON public.anexos
  FOR DELETE USING (uploaded_by = auth.uid());

-- =====================================================
-- POLÍTICAS PARA RELATÓRIOS
-- =====================================================

-- Ver relatórios do inventário
CREATE POLICY "Ver relatórios" ON public.relatorios
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = relatorios.inventario_id 
      AND usuario_id = auth.uid() 
      AND ativo = true
    )
  );

-- Participantes podem gerar relatórios
CREATE POLICY "Gerar relatórios" ON public.relatorios
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = relatorios.inventario_id 
      AND usuario_id = auth.uid() 
      AND ativo = true
    )
  );

-- =====================================================
-- POLÍTICAS PARA CONFIGURAÇÕES
-- =====================================================

-- Ver configurações do inventário
CREATE POLICY "Ver configurações" ON public.inventario_configuracoes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = inventario_configuracoes.inventario_id 
      AND usuario_id = auth.uid() 
      AND ativo = true
    )
  );

-- Apenas inventariantes podem gerenciar configurações
CREATE POLICY "Gerenciar configurações" ON public.inventario_configuracoes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.inventario_participantes 
      WHERE inventario_id = inventario_configuracoes.inventario_id 
      AND usuario_id = auth.uid() 
      AND papel = 'inventariante'
      AND ativo = true
    )
  );

