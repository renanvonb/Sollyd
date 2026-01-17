-- Add 'date' and 'competence' columns to transactions table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'date') THEN
        ALTER TABLE transactions ADD COLUMN date DATE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'competence') THEN
        ALTER TABLE transactions ADD COLUMN competence DATE;
    END IF;

    -- Ensure FK columns exist (just in case)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'classification_id') THEN
        ALTER TABLE transactions ADD COLUMN classification_id UUID REFERENCES classifications(id);
    END IF;

END $$;

-- Optional: Migrate legacy data if needed (commented out unless requested)
-- UPDATE transactions SET date = payment_date WHERE date IS NULL;
-- UPDATE transactions SET competence = competence_date WHERE competence IS NULL;
