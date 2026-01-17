-- SOLLYD - Status Constraint Sync
-- Goal: Ensure database status matches frontend expectations and constraints

-- 1. Normalize existing data to match the strict constraint
UPDATE transactions 
SET status = 'Realizado' 
WHERE status IN ('paid', 'done', 'received', 'Realizado');

UPDATE transactions 
SET status = 'Pendente' 
WHERE status NOT IN ('Realizado');

-- 2. Clean up and re-establish the check constraint
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check;

ALTER TABLE transactions 
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('Realizado', 'Pendente'));

-- 3. Notify PostgREST to reload schema and reflect changes in API
NOTIFY pgrst, 'reload schema';
