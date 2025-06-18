# 🎯 INVENTÁRIOLEGAL - CONFIGURAÇÃO COMPLETA DO SUPABASE

## 📋 **GUIA COMPLETO DE CONFIGURAÇÃO**

### **🚀 PASSO 1: CRIAR PROJETO NO SUPABASE**

1. **Acesse:** https://supabase.com
2. **Crie uma conta** ou faça login
3. **Clique em "New Project"**
4. **Preencha:**
   - Nome: `InventarioLegal`
   - Organização: Sua organização
   - Região: `South America (São Paulo)`
   - Senha do banco: Crie uma senha forte

### **🗄️ PASSO 2: EXECUTAR SCRIPTS SQL**

**Execute os scripts na seguinte ordem no SQL Editor do Supabase:**

#### **2.1 - Schema Principal (supabase_schema.sql)**
```sql
-- Copie e cole todo o conteúdo do arquivo supabase_schema.sql
-- Este script cria todas as tabelas, índices e triggers
```

#### **2.2 - Políticas de Segurança (supabase_rls_policies.sql)**
```sql
-- Copie e cole todo o conteúdo do arquivo supabase_rls_policies.sql
-- Este script configura Row Level Security (RLS)
```

#### **2.3 - Funções Avançadas (supabase_functions.sql)**
```sql
-- Copie e cole todo o conteúdo do arquivo supabase_functions.sql
-- Este script adiciona funções personalizadas e views
```

### **🔧 PASSO 3: CONFIGURAR STORAGE**

1. **Vá para Storage** no painel do Supabase
2. **Crie um bucket** chamado `anexos`
3. **Configure as políticas:**

```sql
-- Política para visualizar anexos
CREATE POLICY "Usuários podem ver anexos do inventário" ON storage.objects
FOR SELECT USING (
  bucket_id = 'anexos' AND
  EXISTS (
    SELECT 1 FROM public.inventario_participantes ip
    WHERE ip.inventario_id::text = (storage.foldername(name))[1]
    AND ip.usuario_id = auth.uid()
    AND ip.ativo = true
  )
);

-- Política para upload de anexos
CREATE POLICY "Usuários podem fazer upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'anexos' AND
  EXISTS (
    SELECT 1 FROM public.inventario_participantes ip
    WHERE ip.inventario_id::text = (storage.foldername(name))[1]
    AND ip.usuario_id = auth.uid()
    AND ip.ativo = true
  )
);

-- Política para deletar anexos
CREATE POLICY "Usuários podem deletar próprios anexos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'anexos' AND
  EXISTS (
    SELECT 1 FROM public.anexos a
    WHERE a.arquivo_url = name
    AND a.uploaded_by = auth.uid()
  )
);
```

### **🔑 PASSO 4: OBTER CREDENCIAIS**

1. **Vá para Settings > API**
2. **Copie:**
   - **Project URL:** `https://your-project-id.supabase.co`
   - **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **⚙️ PASSO 5: CONFIGURAR APLICAÇÃO**

1. **Crie arquivo `.env`** na raiz do projeto:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. **Instale dependências:**
```bash
npm install @supabase/supabase-js
```

### **🧪 PASSO 6: TESTAR CONFIGURAÇÃO**

1. **Inicie o projeto:**
```bash
npm run dev
```

2. **Teste as funcionalidades:**
   - ✅ Registro de usuário
   - ✅ Login/Logout
   - ✅ Criação de inventário
   - ✅ Cadastro de herdeiros
   - ✅ Upload de anexos

## 📊 **ESTRUTURA DO BANCO DE DADOS**

### **🔗 TABELAS PRINCIPAIS:**

1. **`profiles`** - Perfis dos usuários
2. **`inventarios`** - Inventários criados
3. **`inventario_participantes`** - Usuários por inventário
4. **`herdeiros`** - Herdeiros do inventário
5. **`bens`** - Bens do espólio
6. **`bem_herdeiros`** - Percentuais por bem
7. **`movimentacoes_financeiras`** - Receitas e despesas
8. **`contratos_aluguel`** - Contratos de locação
9. **`pagamentos_aluguel`** - Pagamentos recebidos
10. **`votacoes`** - Sistema de votação
11. **`votos`** - Votos dos herdeiros
12. **`comentarios`** - Sistema de comentários
13. **`anexos`** - Documentos e arquivos
14. **`relatorios`** - Relatórios gerados
15. **`inventario_configuracoes`** - Configurações

### **🔒 SEGURANÇA IMPLEMENTADA:**

- ✅ **Row Level Security (RLS)** em todas as tabelas
- ✅ **Políticas granulares** por tipo de usuário
- ✅ **Isolamento de dados** por inventário
- ✅ **Controle de permissões** por papel
- ✅ **Validações automáticas** via triggers

### **⚡ FUNCIONALIDADES AVANÇADAS:**

- ✅ **Triggers automáticos** para updated_at
- ✅ **Validação de percentuais** (máx. 100%)
- ✅ **Funções de cálculo** (saldos, totais)
- ✅ **Views otimizadas** para consultas
- ✅ **Sistema de backup** completo
- ✅ **Finalização automática** de votações

## 🎯 **BENEFÍCIOS DA CONFIGURAÇÃO:**

### **💪 ROBUSTEZ:**
- Sistema multi-tenant completo
- Isolamento total de dados
- Backup automático
- Auditoria completa

### **🚀 PERFORMANCE:**
- Índices otimizados
- Views pré-calculadas
- Consultas eficientes
- Cache automático

### **🔐 SEGURANÇA:**
- Autenticação robusta
- Autorização granular
- Criptografia nativa
- Logs de auditoria

### **📈 ESCALABILIDADE:**
- Suporte a milhares de usuários
- Crescimento automático
- Backup incremental
- Monitoramento integrado

## 🛠️ **MANUTENÇÃO:**

### **📊 MONITORAMENTO:**
- Dashboard do Supabase
- Logs de erro automáticos
- Métricas de performance
- Alertas configuráveis

### **🔄 BACKUP:**
- Backup automático diário
- Função de backup manual
- Restore point-in-time
- Exportação de dados

### **🔧 ATUALIZAÇÕES:**
- Migrations automáticas
- Versionamento de schema
- Deploy sem downtime
- Rollback seguro

## 🎉 **SISTEMA PRONTO PARA PRODUÇÃO!**

Com esta configuração, o InventárioLegal está pronto para:
- ✅ **Uso em produção** com milhares de usuários
- ✅ **Crescimento escalável** sem limites
- ✅ **Segurança enterprise** com RLS
- ✅ **Performance otimizada** com índices
- ✅ **Backup automático** e recuperação
- ✅ **Monitoramento completo** e alertas

**O sistema agora é uma solução profissional completa!** 🚀

