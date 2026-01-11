'use client';

import { useState, useEffect } from 'react';
import { CrudBase, FieldConfig } from './crud-base';
import { TableCell } from '@/components/ui/table';
import {
    Subcategory,
    ExpenseCategory,
    getSubcategories,
    getExpenseCategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
} from '@/lib/supabase/cadastros';

export function SubcategoriesTab() {
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [subcatsData, catsData] = await Promise.all([
                getSubcategories(),
                getExpenseCategories(),
            ]);
            setSubcategories(subcatsData);
            setExpenseCategories(catsData);
        } catch (error) {
            console.error('Erro ao carregar subcategorias:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fields: FieldConfig[] = [
        {
            name: 'name',
            label: 'Nome',
            type: 'text',
            placeholder: 'Ex: Restaurantes, Supermercado',
            required: true,
        },
        {
            name: 'expense_category_id',
            label: 'Categoria de Despesa',
            type: 'select',
            required: true,
            options: expenseCategories.map((cat) => ({
                value: cat.id,
                label: cat.name,
            })),
        },
    ];

    return (
        <CrudBase<Subcategory>
            title="Subcategoria"
            description="Gerencie as subcategorias das suas despesas"
            fields={fields}
            data={subcategories}
            loading={loading}
            onRefresh={fetchData}
            onCreate={createSubcategory}
            onUpdate={updateSubcategory}
            onDelete={deleteSubcategory}
            getItemId={(subcat) => subcat.id}
            renderRow={(subcat) => (
                <>
                    <TableCell>
                        <span className="font-medium">{subcat.name}</span>
                    </TableCell>
                    <TableCell className="text-zinc-500">
                        {subcat.expense_categories?.name || '-'}
                    </TableCell>
                </>
            )}
            emptyMessage="Nenhuma subcategoria cadastrada. Adicione sua primeira subcategoria!"
        />
    );
}
