'use client';

import { useState, useEffect } from 'react';
import { CrudBase } from './crud-base';
import { TableCell } from '@/components/ui/table';
import {
    Classification,
    getClassifications,
    createClassification,
    updateClassification,
    deleteClassification,
} from '@/lib/supabase/cadastros';

export function ClassificationsTab() {
    const [classifications, setClassifications] = useState<Classification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchClassifications = async () => {
        setLoading(true);
        try {
            const data = await getClassifications();
            setClassifications(data);
        } catch (error) {
            console.error('Erro ao carregar classificações:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassifications();
    }, []);

    return (
        <CrudBase<Classification>
            title="Classificação"
            description="Gerencie as classificações das suas despesas"
            fields={[
                {
                    name: 'name',
                    label: 'Nome',
                    type: 'text',
                    placeholder: 'Ex: Essencial, Necessário, Supérfluo',
                    required: true,
                },
            ]}
            data={classifications}
            loading={loading}
            onRefresh={fetchClassifications}
            onCreate={createClassification}
            onUpdate={updateClassification}
            onDelete={deleteClassification}
            getItemId={(classification) => classification.id}
            renderRow={(classification) => (
                <>
                    <TableCell>
                        <span className="font-medium">{classification.name}</span>
                    </TableCell>
                </>
            )}
            emptyMessage="Nenhuma classificação cadastrada. Adicione sua primeira classificação!"
        />
    );
}
