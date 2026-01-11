'use client';

import { useState, useEffect } from 'react';
import { CrudBase } from './crud-base';
import { TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Wallet,
    getWallets,
    createWallet,
    updateWallet,
    deleteWallet,
} from '@/lib/supabase/cadastros';

export function WalletsTab() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWallets = async () => {
        setLoading(true);
        try {
            const data = await getWallets();
            setWallets(data);
        } catch (error) {
            console.error('Erro ao carregar carteiras:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    return (
        <CrudBase<Wallet>
            title="Carteira"
            description="Gerencie suas carteiras e contas financeiras"
            fields={[
                {
                    name: 'name',
                    label: 'Nome',
                    type: 'text',
                    placeholder: 'Ex: Conta Corrente, Poupança',
                    required: true,
                },
                {
                    name: 'logo_url',
                    label: 'URL do Logotipo',
                    type: 'text',
                    placeholder: 'https://exemplo.com/logo.png',
                    required: false,
                },
            ]}
            data={wallets}
            loading={loading}
            onRefresh={fetchWallets}
            onCreate={createWallet}
            onUpdate={updateWallet}
            onDelete={deleteWallet}
            getItemId={(wallet) => wallet.id}
            renderRow={(wallet) => (
                <>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                {wallet.logo_url && <AvatarImage src={wallet.logo_url} alt={wallet.name} />}
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                    {wallet.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{wallet.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-zinc-500">
                        {wallet.logo_url ? 'Com logotipo' : 'Sem logotipo'}
                    </TableCell>
                </>
            )}
            emptyMessage="Nenhuma carteira cadastrada. Adicione sua primeira carteira!"
        />
    );
}
