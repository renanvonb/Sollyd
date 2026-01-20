-- Adiciona coluna type na tabela categories
ALTER TABLE "public"."categories" 
ADD COLUMN IF NOT EXISTS "type" text NOT NULL DEFAULT 'expense';

-- Adiciona a constraint de check para garantir apenas 'income' ou 'expense'
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'categories_type_check') THEN
        ALTER TABLE "public"."categories" 
        ADD CONSTRAINT "categories_type_check" 
        CHECK (type IN ('income', 'expense'));
    END IF;
END $$;
