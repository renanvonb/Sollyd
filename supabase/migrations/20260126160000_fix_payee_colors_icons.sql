-- Atualizar Pagadores (payer)
UPDATE payees 
SET color = 'green', icon = 'arrow-down-right' 
WHERE type = 'payer';

-- Atualizar Beneficiários (favored)
UPDATE payees 
SET color = 'red', icon = 'arrow-up-right' 
WHERE type = 'favored';
