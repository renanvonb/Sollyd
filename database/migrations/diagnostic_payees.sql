-- =====================================================
-- DIAGNÓSTICO DA TABELA PAYEES
-- Execute este SQL no Supabase SQL Editor para ver a estrutura atual
-- =====================================================

-- 1. Verificar se a tabela existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'payees'
) as table_exists;

-- 2. Ver todas as colunas da tabela payees
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'payees'
ORDER BY ordinal_position;

-- 3. Ver dados existentes (se houver)
SELECT * FROM payees LIMIT 5;
