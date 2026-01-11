'use client';

import { useState, useEffect } from 'react';
import { CrudBase } from './crud-base';
import { TableCell } from '@/components/ui/table';
import {
    ExpenseCategory,
    getExpenseCategories,
    createExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
} from '@/lib/supabase/cadastros';

export function ExpenseCategoriesTab() {
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await getExpenseCategories();
            setCategories(data);
        } catch (error) {
            console.error('Erro ao carregar categorias de despesa:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <CrudBase<ExpenseCategory>
            title="Categoria de Despesa"
            description="Gerencie as categorias das suas despesas"
            fields={[
                {
                    name: 'name',
                    label: 'Nome',
                    type: 'text',
                    placeholder: 'Ex: Alimentação, Transporte, Moradia',
                    required: true,
                },
            ]}
            data={categories}
            loading={loading}
            onRefresh={fetchCategories}
            onCreate={createExpenseCategory}
            onUpdate={updateExpenseCategory}
            onDelete={deleteExpenseCategory}
            getItemId={(category) => category.id}
            renderRow={(category) => (
                <>
                    <TableCell>
                        <span className="font-medium">{category.name}</span>
                    </TableCell>
                </>
            )}
            emptyMessage="Nenhuma categoria de despesa cadastrada. Adicione sua primeira categoria!"
        />
    );
}
