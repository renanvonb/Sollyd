'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Wallet as WalletIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
    Wallet,
    getWallets,
    createWallet,
    updateWallet,
    deleteWallet,
} from '@/lib/supabase/cadastros';

export function WalletsContent() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', logo_url: '' });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const fetchWallets = async () => {
        setLoading(true);
        try {
            const data = await getWallets();
            setWallets(data);
        } catch (error) {
            console.error('Erro ao carregar carteiras:', error);
            toast.error('Erro ao carregar carteiras');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    useEffect(() => {
        if (!isDialogOpen) {
            setFormData({ name: '', logo_url: '' });
            setFormErrors({});
            setEditingWallet(null);
        }
    }, [isDialogOpen]);

    useEffect(() => {
        if (editingWallet) {
            setFormData({
                name: editingWallet.name,
                logo_url: editingWallet.logo_url || '',
            });
        }
    }, [editingWallet]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        if (!formData.name.trim()) {
            errors.name = 'Nome é obrigatório';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            if (editingWallet) {
                await updateWallet(editingWallet.id, formData);
                toast.success('Carteira atualizada com sucesso!');
            } else {
                await createWallet(formData);
                toast.success('Carteira criada com sucesso!');
            }
            setIsDialogOpen(false);
            await fetchWallets();
        } catch (error: any) {
            toast.error(error.message || 'Erro ao salvar carteira');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingId) return;

        setSubmitting(true);
        try {
            await deleteWallet(deletingId);
            toast.success('Carteira excluída com sucesso!');
            setIsDeleteDialogOpen(false);
            setDeletingId(null);
            await fetchWallets();
        } catch (error: any) {
            toast.error(error.message || 'Erro ao excluir carteira');
        } finally {
            setSubmitting(false);
        }
    };

    const openCreateDialog = () => {
        setEditingWallet(null);
        setFormData({ name: '', logo_url: '' });
        setIsDialogOpen(true);
    };

    const openEditDialog = (wallet: Wallet) => {
        setEditingWallet(wallet);
        setIsDialogOpen(true);
    };

    const openDeleteDialog = (id: string) => {
        setDeletingId(id);
        setIsDeleteDialogOpen(true);
    };

    return (
        <>
            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#00665C]" />
                </div>
            ) : wallets.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="rounded-full bg-blue-100 p-3 mb-4">
                            <WalletIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-zinc-500 text-center">
                            Nenhuma carteira cadastrada.<br />
                            Adicione sua primeira carteira!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wallets.map((wallet) => (
                        <Card
                            key={wallet.id}
                            className="hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="rounded-full bg-blue-100 p-2.5">
                                            <Avatar className="h-8 w-8">
                                                {wallet.logo_url && (
                                                    <AvatarImage src={wallet.logo_url} alt={wallet.name} />
                                                )}
                                                <AvatarFallback className="bg-blue-600 text-white font-semibold text-sm">
                                                    {wallet.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-zinc-900 truncate">
                                                {wallet.name}
                                            </h3>
                                            <p className="text-sm text-zinc-500">
                                                {wallet.logo_url ? 'Com logotipo' : 'Sem logotipo'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openEditDialog(wallet)}
                                            className="h-8 w-8"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openDeleteDialog(wallet.id)}
                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="font-jakarta">
                            {editingWallet ? 'Editar Carteira' : 'Nova Carteira'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingWallet
                                ? 'Atualize as informações da carteira.'
                                : 'Preencha os dados para criar uma nova carteira.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className={cn(
                                    'text-sm font-medium',
                                    formErrors.name && 'text-red-600'
                                )}
                            >
                                Nome <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="Ex: Conta Corrente, Poupança"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className={cn(
                                    formErrors.name && 'border-red-500 focus-visible:ring-red-500'
                                )}
                            />
                            {formErrors.name && (
                                <p className="text-sm text-red-600">{formErrors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="logo_url">URL do Logotipo</Label>
                            <Input
                                id="logo_url"
                                type="url"
                                placeholder="https://exemplo.com/logo.png"
                                value={formData.logo_url}
                                onChange={(e) =>
                                    setFormData({ ...formData, logo_url: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={submitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="bg-[#00665C] hover:bg-[#00665C]/90"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                'Salvar'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-jakarta">
                            Confirmar exclusão
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir esta carteira? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={submitting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={submitting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Excluindo...
                                </>
                            ) : (
                                'Excluir'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
