-- =====================================================
-- SOLLYD - MÓDULO DE CADASTROS
-- Schema para Carteiras, Categorias, Subcategorias e Classificações
-- =====================================================

-- Extensão UUID (se ainda não existir)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABELA: WALLETS (Carteiras)
-- =====================================================
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);

-- RLS (Row Level Security)
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wallets"
    ON wallets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallets"
    ON wallets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallets"
    ON wallets FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wallets"
    ON wallets FOR DELETE
    USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wallets_updated_at
    BEFORE UPDATE ON wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. TABELA: INCOME_CATEGORIES (Categorias de Receita)
-- =====================================================
CREATE TABLE IF NOT EXISTS income_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_income_categories_user_id ON income_categories(user_id);

-- RLS
ALTER TABLE income_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own income categories"
    ON income_categories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own income categories"
    ON income_categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own income categories"
    ON income_categories FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own income categories"
    ON income_categories FOR DELETE
    USING (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER update_income_categories_updated_at
    BEFORE UPDATE ON income_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. TABELA: EXPENSE_CATEGORIES (Categorias de Despesa)
-- =====================================================
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_expense_categories_user_id ON expense_categories(user_id);

-- RLS
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own expense categories"
    ON expense_categories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expense categories"
    ON expense_categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expense categories"
    ON expense_categories FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expense categories"
    ON expense_categories FOR DELETE
    USING (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER update_expense_categories_updated_at
    BEFORE UPDATE ON expense_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. TABELA: CLASSIFICATIONS (Classificações)
-- =====================================================
CREATE TABLE IF NOT EXISTS classifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_classifications_user_id ON classifications(user_id);

-- RLS
ALTER TABLE classifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own classifications"
    ON classifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own classifications"
    ON classifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own classifications"
    ON classifications FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own classifications"
    ON classifications FOR DELETE
    USING (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER update_classifications_updated_at
    BEFORE UPDATE ON classifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. TABELA: PAYEES (Favorecidos)
-- =====================================================
CREATE TABLE IF NOT EXISTS payees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT 'zinc',
    icon TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_payees_user_id ON payees(user_id);

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
-- 5. ATUALIZAÇÃO: SUBCATEGORIES (Subcategorias)
-- =====================================================
-- Adicionar relacionamento com expense_categories se ainda não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subcategories' 
        AND column_name = 'expense_category_id'
    ) THEN
        ALTER TABLE subcategories 
        ADD COLUMN expense_category_id UUID REFERENCES expense_categories(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Atualizar RLS se necessário
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own subcategories" ON subcategories;
CREATE POLICY "Users can view their own subcategories"
    ON subcategories FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own subcategories" ON subcategories;
CREATE POLICY "Users can insert their own subcategories"
    ON subcategories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own subcategories" ON subcategories;
CREATE POLICY "Users can update their own subcategories"
    ON subcategories FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own subcategories" ON subcategories;
CREATE POLICY "Users can delete their own subcategories"
    ON subcategories FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 6. DADOS INICIAIS (SEED)
-- =====================================================

-- Inserir classificações padrão para o primeiro usuário
-- (Ajuste o user_id conforme necessário)
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    SELECT id INTO first_user_id FROM auth.users LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
        INSERT INTO classifications (user_id, name)
        VALUES 
            (first_user_id, 'Essencial'),
            (first_user_id, 'Necessário'),
            (first_user_id, 'Supérfluo')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================
