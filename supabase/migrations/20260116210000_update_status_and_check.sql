-- Update existing statuses to new standard
UPDATE transactions 
SET status = 'Realizado' 
WHERE status = 'paid' OR status = 'done' OR status = 'received';

UPDATE transactions 
SET status = 'Pendente' 
WHERE status = 'pending' OR status IS NULL OR (status != 'Realizado');

-- Add Check Constraint (Dropping if exists to be safe, though usually named differently)
-- ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check;

ALTER TABLE transactions 
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('Realizado', 'Pendente'));
