'use client';

import { useState, useEffect } from 'react';
import { CrudBase } from './crud-base';
import { TableCell } from '@/components/ui/table';
import {
    IncomeCategory,
    getIncomeCategories,
    createIncomeCategory,
    updateIncomeCategory,
    deleteIncomeCategory,
} from '@/lib/supabase/cadastros';

export function IncomeCategoriesTab() {
    const [categories, setCategories] = useState<IncomeCategory[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await getIncomeCategories();
            setCategories(data);
        } catch (error) {
            console.error('Erro ao carregar categorias de receita:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <CrudBase<IncomeCategory>
            title="Categoria de Receita"
            description="Gerencie as categorias das suas receitas"
            fields={[
                {
                    name: 'name',
                    label: 'Nome',
                    type: 'text',
                    placeholder: 'Ex: Salário, Freelance, Investimentos',
                    required: true,
                },
            ]}
            data={categories}
            loading={loading}
            onRefresh={fetchCategories}
            onCreate={createIncomeCategory}
            onUpdate={updateIncomeCategory}
            onDelete={deleteIncomeCategory}
            getItemId={(category) => category.id}
            renderRow={(category) => (
                <>
                    <TableCell>
                        <span className="font-medium">{category.name}</span>
                    </TableCell>
                </>
            )}
            emptyMessage="Nenhuma categoria de receita cadastrada. Adicione sua primeira categoria!"
        />
    );
}
