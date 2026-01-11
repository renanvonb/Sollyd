# 🔧 GUIA RÁPIDO: Corrigir Erro da Tabela Payees

## ⚡ PASSO A PASSO (5 minutos)

### 1️⃣ Abrir Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Faça login
- Selecione seu projeto "Sollyd"

### 2️⃣ Abrir SQL Editor
- No menu lateral esquerdo, clique em **"SQL Editor"**
- Clique no botão **"New query"**

### 3️⃣ Copiar e Colar este SQL

```sql
-- COPIE TODO ESTE BLOCO E COLE NO SQL EDITOR

-- 1. Remover tabela antiga (se existir)
DROP TABLE IF EXISTS payees CASCADE;

-- 2. Criar tabela nova com todas as colunas
CREATE TABLE payees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT 'zinc',
    icon TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Criar índice
CREATE INDEX idx_payees_user_id ON payees(user_id);

-- 4. Habilitar segurança
ALTER TABLE payees ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas de segurança
CREATE POLICY "Users can view their own payees"
    ON payees FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payees"
    ON payees FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payees"
    ON payees FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payees"
    ON payees FOR DELETE
    USING (auth.uid() = user_id);

-- 6. Criar função de atualização
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Criar trigger
CREATE TRIGGER update_payees_updated_at
    BEFORE UPDATE ON payees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Forçar reload do cache
NOTIFY pgrst, 'reload schema';

-- 9. Verificar se funcionou
SELECT 'Tabela criada com sucesso!' as status,
       column_name, 
       data_type 
FROM information_schema.columns 
WHERE table_name = 'payees'
ORDER BY ordinal_position;
```

### 4️⃣ Executar
- Clique no botão **"Run"** (ou pressione `Ctrl + Enter`)
- Aguarde aparecer "Success" na parte inferior

### 5️⃣ Verificar Resultado
- Você deve ver uma tabela com as colunas:
  - ✅ id
  - ✅ user_id
  - ✅ name
  - ✅ color ← IMPORTANTE
  - ✅ icon ← IMPORTANTE
  - ✅ created_at
  - ✅ updated_at

### 6️⃣ Testar na Aplicação
- Volte para sua aplicação
- Pressione `Ctrl + Shift + R` para recarregar completamente
- Tente cadastrar um favorecido
- ✅ Deve funcionar!

---

## ❌ Se ainda não funcionar:

### Opção A: Resetar Cache Manualmente
1. No Supabase Dashboard, vá em **Settings** → **API**
2. Clique em **"Restart project"**
3. Aguarde 1-2 minutos
4. Teste novamente

### Opção B: Verificar URL do Supabase
1. Abra o arquivo `.env.local`
2. Verifique se `NEXT_PUBLIC_SUPABASE_URL` está correto
3. Verifique se `NEXT_PUBLIC_SUPABASE_ANON_KEY` está correto

---

## 📞 Precisa de Ajuda?

Se após seguir todos os passos ainda não funcionar:
1. Me envie uma screenshot do resultado do passo 5 (verificação)
2. Me envie o erro exato que aparece no console do navegador (F12)
