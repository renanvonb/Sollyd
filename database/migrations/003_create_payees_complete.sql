-- =====================================================
-- CRIAR TABELA PAYEES COMPLETA
-- Execute este SQL se a tabela não existir ou precisar ser recriada
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

-- Dropar tabela se existir (CUIDADO: isso apaga todos os dados!)
-- Comente esta linha se quiser preservar dados existentes
-- DROP TABLE IF EXISTS payees CASCADE;

-- Criar tabela payees
CREATE TABLE IF NOT EXISTS payees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT 'zinc',
    icon TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_payees_user_id ON payees(user_id);

-- Habilitar RLS
ALTER TABLE payees ENABLE ROW LEVEL SECURITY;

-- Dropar políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view their own payees" ON payees;
DROP POLICY IF EXISTS "Users can insert their own payees" ON payees;
DROP POLICY IF EXISTS "Users can update their own payees" ON payees;
DROP POLICY IF EXISTS "Users can delete their own payees" ON payees;

-- Criar políticas RLS
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

-- Dropar trigger antigo se existir
DROP TRIGGER IF EXISTS update_payees_updated_at ON payees;

-- Criar trigger para updated_at
CREATE TRIGGER update_payees_updated_at
    BEFORE UPDATE ON payees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar se funcionou
SELECT 
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'payees'
ORDER BY ordinal_position;
