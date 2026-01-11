'use client';

import { useState, useEffect } from 'react';
import { CrudBase } from './crud-base';
import { TableCell } from '@/components/ui/table';
import {
    Payee,
    getPayees,
    createPayee,
    updatePayee,
    deletePayee,
} from '@/lib/supabase/cadastros';

export function PayeesTab() {
    const [payees, setPayees] = useState<Payee[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPayees = async () => {
        setLoading(true);
        try {
            const data = await getPayees();
            setPayees(data);
        } catch (error) {
            console.error('Erro ao carregar favorecidos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayees();
    }, []);

    return (
        <CrudBase<Payee>
            title="Favorecido"
            description="Gerencie os favorecidos das suas transações"
            fields={[
                {
                    name: 'name',
                    label: 'Nome',
                    type: 'text',
                    placeholder: 'Ex: Fornecedor, Prestador de Serviço',
                    required: true,
                },
                {
                    name: 'type',
                    label: 'Tipo',
                    type: 'text',
                    placeholder: 'Ex: Pessoa Física, Pessoa Jurídica',
                    required: false,
                },
            ]}
            data={payees}
            loading={loading}
            onRefresh={fetchPayees}
            onCreate={createPayee}
            onUpdate={updatePayee}
            onDelete={deletePayee}
            getItemId={(payee) => payee.id}
            renderRow={(payee) => (
                <>
                    <TableCell>
                        <span className="font-medium">{payee.name}</span>
                    </TableCell>
                    <TableCell className="text-zinc-500">
                        {payee.type || '-'}
                    </TableCell>
                </>
            )}
            emptyMessage="Nenhum favorecido cadastrado. Adicione seu primeiro favorecido!"
        />
    );
}
