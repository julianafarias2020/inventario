-- =====================================================
-- INVENTÁRIOLEGAL - FUNÇÕES E TRIGGERS AVANÇADOS
-- =====================================================

-- =====================================================
-- FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, perfil)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'perfil', 'inventariante')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil quando usuário se registra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FUNÇÃO PARA VALIDAR PERCENTUAIS DOS HERDEIROS
-- =====================================================

CREATE OR REPLACE FUNCTION public.validar_percentuais_bem()
RETURNS TRIGGER AS $$
DECLARE
  total_percentual DECIMAL(5,2);
BEGIN
  -- Calcular total de percentuais para o bem
  SELECT COALESCE(SUM(percentual), 0) INTO total_percentual
  FROM public.bem_herdeiros
  WHERE bem_id = COALESCE(NEW.bem_id, OLD.bem_id)
  AND (TG_OP = 'DELETE' OR id != NEW.id);
  
  -- Adicionar o novo percentual se for INSERT ou UPDATE
  IF TG_OP != 'DELETE' THEN
    total_percentual := total_percentual + NEW.percentual;
  END IF;
  
  -- Validar se não excede 100%
  IF total_percentual > 100 THEN
    RAISE EXCEPTION 'Total de percentuais não pode exceder 100%%. Atual: %%', total_percentual;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar percentuais
CREATE TRIGGER trigger_validar_percentuais
  BEFORE INSERT OR UPDATE OR DELETE ON public.bem_herdeiros
  FOR EACH ROW EXECUTE FUNCTION public.validar_percentuais_bem();

-- =====================================================
-- FUNÇÃO PARA CALCULAR VALOR TOTAL DO INVENTÁRIO
-- =====================================================

CREATE OR REPLACE FUNCTION public.calcular_valor_total_inventario(inventario_uuid UUID)
RETURNS DECIMAL(15,2) AS $$
DECLARE
  valor_total DECIMAL(15,2);
BEGIN
  SELECT COALESCE(SUM(valor_avaliacao), 0) INTO valor_total
  FROM public.bens
  WHERE inventario_id = inventario_uuid
  AND status = 'ativo';
  
  RETURN valor_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNÇÃO PARA CALCULAR SALDO FINANCEIRO
-- =====================================================

CREATE OR REPLACE FUNCTION public.calcular_saldo_financeiro(inventario_uuid UUID)
RETURNS DECIMAL(15,2) AS $$
DECLARE
  total_receitas DECIMAL(15,2);
  total_despesas DECIMAL(15,2);
  saldo DECIMAL(15,2);
BEGIN
  -- Calcular total de receitas
  SELECT COALESCE(SUM(valor), 0) INTO total_receitas
  FROM public.movimentacoes_financeiras
  WHERE inventario_id = inventario_uuid
  AND tipo = 'receita';
  
  -- Calcular total de despesas
  SELECT COALESCE(SUM(valor), 0) INTO total_despesas
  FROM public.movimentacoes_financeiras
  WHERE inventario_id = inventario_uuid
  AND tipo = 'despesa';
  
  saldo := total_receitas - total_despesas;
  
  RETURN saldo;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNÇÃO PARA OBTER ESTATÍSTICAS DO INVENTÁRIO
-- =====================================================

CREATE OR REPLACE FUNCTION public.obter_estatisticas_inventario(inventario_uuid UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_bens', (SELECT COUNT(*) FROM public.bens WHERE inventario_id = inventario_uuid AND status = 'ativo'),
    'total_herdeiros', (SELECT COUNT(*) FROM public.herdeiros WHERE inventario_id = inventario_uuid AND ativo = true),
    'valor_total_bens', public.calcular_valor_total_inventario(inventario_uuid),
    'saldo_financeiro', public.calcular_saldo_financeiro(inventario_uuid),
    'contratos_ativos', (SELECT COUNT(*) FROM public.contratos_aluguel WHERE inventario_id = inventario_uuid AND status = 'ativo'),
    'votacoes_ativas', (SELECT COUNT(*) FROM public.votacoes WHERE inventario_id = inventario_uuid AND status = 'ativa'),
    'comentarios_abertos', (SELECT COUNT(*) FROM public.comentarios WHERE inventario_id = inventario_uuid AND status = 'aberto'),
    'total_anexos', (SELECT COUNT(*) FROM public.anexos WHERE inventario_id = inventario_uuid)
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNÇÃO PARA FINALIZAR VOTAÇÃO AUTOMATICAMENTE
-- =====================================================

CREATE OR REPLACE FUNCTION public.finalizar_votacoes_expiradas()
RETURNS void AS $$
BEGIN
  -- Finalizar votações que passaram da data limite
  UPDATE public.votacoes
  SET status = 'finalizada',
      updated_at = NOW()
  WHERE status = 'ativa'
  AND data_fim < NOW();
  
  -- Calcular resultados das votações finalizadas
  UPDATE public.votacoes
  SET resultado = (
    SELECT json_agg(
      json_build_object(
        'opcao', opcao_escolhida,
        'votos', COUNT(*)
      )
    )
    FROM public.votos
    WHERE votacao_id = votacoes.id
    GROUP BY opcao_escolhida
  )
  WHERE status = 'finalizada'
  AND resultado IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNÇÃO PARA GERAR RELATÓRIO DE MOVIMENTAÇÕES
-- =====================================================

CREATE OR REPLACE FUNCTION public.gerar_relatorio_movimentacoes(
  inventario_uuid UUID,
  data_inicio DATE DEFAULT NULL,
  data_fim DATE DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  relatorio JSON;
  filtro_data_inicio DATE;
  filtro_data_fim DATE;
BEGIN
  -- Definir datas padrão se não fornecidas
  filtro_data_inicio := COALESCE(data_inicio, DATE_TRUNC('month', CURRENT_DATE));
  filtro_data_fim := COALESCE(data_fim, CURRENT_DATE);
  
  SELECT json_build_object(
    'periodo', json_build_object(
      'inicio', filtro_data_inicio,
      'fim', filtro_data_fim
    ),
    'resumo', json_build_object(
      'total_receitas', COALESCE(SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END), 0),
      'total_despesas', COALESCE(SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END), 0),
      'saldo_periodo', COALESCE(SUM(CASE WHEN tipo = 'receita' THEN valor ELSE -valor END), 0),
      'total_movimentacoes', COUNT(*)
    ),
    'movimentacoes', json_agg(
      json_build_object(
        'id', id,
        'tipo', tipo,
        'categoria', categoria,
        'descricao', descricao,
        'valor', valor,
        'data', data_movimentacao,
        'bem_nome', (SELECT nome FROM public.bens WHERE id = bem_id)
      ) ORDER BY data_movimentacao DESC
    )
  ) INTO relatorio
  FROM public.movimentacoes_financeiras
  WHERE inventario_id = inventario_uuid
  AND data_movimentacao BETWEEN filtro_data_inicio AND filtro_data_fim;
  
  RETURN relatorio;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNÇÃO PARA BACKUP DE DADOS DO INVENTÁRIO
-- =====================================================

CREATE OR REPLACE FUNCTION public.backup_inventario(inventario_uuid UUID)
RETURNS JSON AS $$
DECLARE
  backup_data JSON;
BEGIN
  SELECT json_build_object(
    'inventario', (SELECT row_to_json(i) FROM public.inventarios i WHERE id = inventario_uuid),
    'participantes', (SELECT json_agg(row_to_json(p)) FROM public.inventario_participantes p WHERE inventario_id = inventario_uuid),
    'herdeiros', (SELECT json_agg(row_to_json(h)) FROM public.herdeiros h WHERE inventario_id = inventario_uuid),
    'bens', (SELECT json_agg(row_to_json(b)) FROM public.bens b WHERE inventario_id = inventario_uuid),
    'bem_herdeiros', (
      SELECT json_agg(row_to_json(bh))
      FROM public.bem_herdeiros bh
      JOIN public.bens b ON bh.bem_id = b.id
      WHERE b.inventario_id = inventario_uuid
    ),
    'movimentacoes', (SELECT json_agg(row_to_json(m)) FROM public.movimentacoes_financeiras m WHERE inventario_id = inventario_uuid),
    'contratos', (SELECT json_agg(row_to_json(c)) FROM public.contratos_aluguel c WHERE inventario_id = inventario_uuid),
    'votacoes', (SELECT json_agg(row_to_json(v)) FROM public.votacoes v WHERE inventario_id = inventario_uuid),
    'comentarios', (SELECT json_agg(row_to_json(co)) FROM public.comentarios co WHERE inventario_id = inventario_uuid),
    'anexos', (SELECT json_agg(row_to_json(a)) FROM public.anexos a WHERE inventario_id = inventario_uuid),
    'configuracoes', (SELECT row_to_json(cfg) FROM public.inventario_configuracoes cfg WHERE inventario_id = inventario_uuid),
    'backup_timestamp', NOW()
  ) INTO backup_data;
  
  RETURN backup_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VIEWS PARA CONSULTAS OTIMIZADAS
-- =====================================================

-- View para dashboard do inventário
CREATE OR REPLACE VIEW public.view_dashboard_inventario AS
SELECT 
  i.id,
  i.nome,
  i.falecido,
  i.data_obito,
  i.status,
  public.calcular_valor_total_inventario(i.id) as valor_total_bens,
  public.calcular_saldo_financeiro(i.id) as saldo_financeiro,
  (SELECT COUNT(*) FROM public.herdeiros WHERE inventario_id = i.id AND ativo = true) as total_herdeiros,
  (SELECT COUNT(*) FROM public.bens WHERE inventario_id = i.id AND status = 'ativo') as total_bens,
  (SELECT COUNT(*) FROM public.contratos_aluguel WHERE inventario_id = i.id AND status = 'ativo') as contratos_ativos,
  (SELECT COUNT(*) FROM public.votacoes WHERE inventario_id = i.id AND status = 'ativa') as votacoes_ativas
FROM public.inventarios i;

-- View para relatório de herdeiros com percentuais
CREATE OR REPLACE VIEW public.view_herdeiros_percentuais AS
SELECT 
  h.id,
  h.inventario_id,
  h.nome,
  h.cpf,
  h.tipo,
  COALESCE(SUM(bh.percentual), 0) as percentual_total,
  COUNT(bh.bem_id) as total_bens_vinculados
FROM public.herdeiros h
LEFT JOIN public.bem_herdeiros bh ON h.id = bh.herdeiro_id
WHERE h.ativo = true
GROUP BY h.id, h.inventario_id, h.nome, h.cpf, h.tipo;

-- View para contratos com valores calculados
CREATE OR REPLACE VIEW public.view_contratos_resumo AS
SELECT 
  ca.id,
  ca.inventario_id,
  ca.bem_id,
  b.nome as bem_nome,
  ca.inquilino_nome,
  ca.valor_aluguel,
  ca.status,
  ca.data_inicio,
  ca.data_fim,
  COALESCE(SUM(pa.valor_pago), 0) as total_recebido,
  COUNT(pa.id) as total_pagamentos
FROM public.contratos_aluguel ca
JOIN public.bens b ON ca.bem_id = b.id
LEFT JOIN public.pagamentos_aluguel pa ON ca.id = pa.contrato_id
GROUP BY ca.id, ca.inventario_id, ca.bem_id, b.nome, ca.inquilino_nome, 
         ca.valor_aluguel, ca.status, ca.data_inicio, ca.data_fim;

