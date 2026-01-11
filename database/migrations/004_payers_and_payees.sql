-- =====================================================
-- SOLLYD - SEPARAÇÃO DE PAGADORES E FAVORECIDOS
-- Criar tabelas distintas para Receitas e Despesas
-- =====================================================

-- Criar extensão UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar função de update_updated_at se não existir
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABELA: PAYERS (Pagadores - para Receitas)
-- =====================================================

DROP TABLE IF EXISTS payers CASCADE;

CREATE TABLE payers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT 'zinc',
    icon TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_payers_user_id ON payers(user_id);

-- RLS
ALTER TABLE payers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payers"
    ON payers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payers"
    ON payers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payers"
    ON payers FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payers"
    ON payers FOR DELETE
    USING (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER update_payers_updated_at
    BEFORE UPDATE ON payers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABELA: PAYEES (Favorecidos - para Despesas)
-- =====================================================

DROP TABLE IF EXISTS payees CASCADE;

CREATE TABLE payees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT 'zinc',
    icon TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice
CREATE INDEX idx_payees_user_id ON payees(user_id);

-- RLS
ALTER TABLE payees ENABLE ROW LEVEL SECURITY;

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

-- Trigger
CREATE TRIGGER update_payees_updated_at
    BEFORE UPDATE ON payees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS MOCKADOS PARA TESTE
-- =====================================================

-- Inserir pagadores de exemplo (para o primeiro usuário)
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    SELECT id INTO first_user_id FROM auth.users LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
        INSERT INTO payers (user_id, name, color, icon)
        VALUES 
            (first_user_id, 'Goapice', 'blue', 'building'),
            (first_user_id, 'Recebee', 'green', 'user')
        ON CONFLICT DO NOTHING;
        
        INSERT INTO payees (user_id, name, color)
        VALUES 
            (first_user_id, 'Fornecedor A', 'orange'),
            (first_user_id, 'Fornecedor B', 'purple')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- =====================================================
-- FORÇAR RELOAD DO SCHEMA CACHE
-- =====================================================

NOTIFY pgrst, 'reload schema';

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar tabela Payers
SELECT 'PAYERS' as tabela, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'payers'
ORDER BY ordinal_position;

-- Verificar tabela Payees
SELECT 'PAYEES' as tabela, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'payees'
ORDER BY ordinal_position;
