export type TransactionType = 'revenue' | 'expense';
export type TransactionClassification = 'essential' | 'necessary' | 'superfluous';

export interface Payer {
    id: string;
    name: string;
    color?: string;
    icon?: string;
    created_at: string;
}

export interface PaymentMethod {
    id: string;
    name: string;
    created_at: string;
}

export interface Payee {
    id: string;
    name: string;
    type?: string;
    color?: string;
    icon?: string;
    created_at: string;
}

export interface Category {
    id: string;
    name: string;
    type?: 'Receita' | 'Despesa';
    color?: string;
    icon?: string;
    created_at: string;
}

export interface Subcategory {
    id: string;
    name: string;
    category_id: string;
    color?: string;
    created_at: string;
}

export interface Classification {
    id: string;
    name: string;
    description?: string;
    color: string;
    created_at: string;
}

export interface Wallet {
    id: string;
    name: string;
    logo_url?: string;
    color?: string;
    icon?: string;
    is_principal: boolean;
    created_at: string;
}

export interface Transaction {
    id: string;
    user_id: string;
    description: string;
    amount: number;
    type: TransactionType;
    payer_id?: string;
    payee_id?: string;
    payment_method?: string;
    classification_id?: string;
    category_id?: string;
    subcategory_id?: string;

    date?: string;
    wallet_id?: string;
    competence?: string;
    observation?: string;
    status?: string;
    created_at: string;
    updated_at: string;
    // Joined relations
    payers?: Payer;
    payees?: Payee;

    classifications?: Classification;
    categories?: Category;
    subcategories?: Subcategory;
    wallets?: Wallet;
}

export interface CreateTransactionInput {
    description: string;
    amount: number;
    type: TransactionType;
    payer_id?: string;
    payee_id?: string;
    payment_method?: string;
    classification_id?: string;
    category_id?: string;
    subcategory_id?: string;

    date?: string;
    wallet_id?: string;
    competence?: string;
    observation?: string;
    status?: string;
}
