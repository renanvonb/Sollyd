-- =====================================================
-- ATUALIZAÇÃO: Adicionar campo icon à tabela payees
-- Execute este SQL se a tabela payees já existir
-- =====================================================

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

-- Atualizar registros existentes com valor padrão
UPDATE payees 
SET icon = COALESCE(icon, 'user')
WHERE icon IS NULL;

-- Forçar reload do schema cache
NOTIFY pgrst, 'reload schema';

-- Verificar
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'payees'
ORDER BY ordinal_position;
