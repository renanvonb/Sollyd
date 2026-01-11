-- =====================================================
-- GARANTIA FINAL DE SCHEMA DE FAVORECIDOS (PAYEES)
-- Execute este script para garantir que o salvamento funcione
-- =====================================================

-- 1. Se a tabela não existir, cria do zero
CREATE TABLE IF NOT EXISTS payees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT 'zinc',
    icon TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Se a tabela já existir, garante que tem a coluna COLOR
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payees' AND column_name = 'color') THEN
        ALTER TABLE payees ADD COLUMN color TEXT DEFAULT 'zinc';
    END IF;
END $$;

-- 3. Se a tabela já existir, garante que tem a coluna ICON
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payees' AND column_name = 'icon') THEN
        ALTER TABLE payees ADD COLUMN icon TEXT DEFAULT 'user';
    END IF;
END $$;

-- 4. Habilitar segurança RLS (se ainda não estiver)
ALTER TABLE payees ENABLE ROW LEVEL SECURITY;

-- 5. Atualizar políticas de segurança (recriar para garantir)
DROP POLICY IF EXISTS "Users can view their own payees" ON payees;
DROP POLICY IF EXISTS "Users can insert their own payees" ON payees;
DROP POLICY IF EXISTS "Users can update their own payees" ON payees;
DROP POLICY IF EXISTS "Users can delete their own payees" ON payees;

CREATE POLICY "Users can view their own payees" ON payees FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own payees" ON payees FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own payees" ON payees FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own payees" ON payees FOR DELETE USING (auth.uid() = user_id);

-- 6. Forçar atualização do cache do Supabase
NOTIFY pgrst, 'reload schema';
