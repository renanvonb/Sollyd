-- =====================================================
-- ATUALIZAÇÃO DA TABELA PAYEES
-- Adiciona campos color e icon
-- =====================================================

-- Adicionar coluna color se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payees' 
        AND column_name = 'color'
    ) THEN
        ALTER TABLE payees ADD COLUMN color TEXT DEFAULT 'zinc';
    END IF;
END $$;

-- Adicionar coluna icon se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payees' 
        AND column_name = 'icon'
    ) THEN
        ALTER TABLE payees ADD COLUMN icon TEXT DEFAULT 'user';
    END IF;
END $$;

-- Adicionar coluna updated_at se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payees' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE payees ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Criar trigger para updated_at se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_payees_updated_at'
    ) THEN
        CREATE TRIGGER update_payees_updated_at
            BEFORE UPDATE ON payees
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Atualizar registros existentes com valores padrão
UPDATE payees 
SET 
    color = COALESCE(color, 'zinc'),
    icon = COALESCE(icon, 'user'),
    updated_at = COALESCE(updated_at, NOW())
WHERE color IS NULL OR icon IS NULL OR updated_at IS NULL;
