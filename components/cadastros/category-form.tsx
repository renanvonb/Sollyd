'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { ColorPicker, getColorClass } from "./color-picker"
import { IconPicker, getIconByName } from "./icon-picker"
import { Classification } from "@/types/entities"
import { useEffect, useState } from "react"
import { createCategory, updateCategory } from "@/lib/supabase/cadastros"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(50, "Máximo 50 caracteres"),
    type: z.enum(['Receita', 'Despesa']),
    icon: z.string().min(1, "Ícone é obrigatório"),
    color: z.string().min(1, "Cor é obrigatória"),
})

export type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    defaultValues?: Partial<CategoryFormValues>;
    categoryId?: string;
    classifications: Classification[];
    onSuccess: () => void;
    onCancel: () => void;
    onDelete?: () => void;
}

export function CategoryForm({
    defaultValues,
    categoryId,
    classifications,
    onSuccess,
    onCancel,
    onDelete,
}: CategoryFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: 'Despesa',
            icon: 'cart',
            color: 'zinc',
            ...defaultValues
        },
    })

    const { watch } = form;
    const watchName = watch('name');
    const watchColor = watch('color');
    const watchIcon = watch('icon');

    // Reset form when defaultValues change (e.g. switching between edit/create)
    useEffect(() => {
        if (defaultValues) {
            form.reset({
                name: '',
                type: 'Despesa',
                icon: 'cart',
                color: 'zinc',
                ...defaultValues
            });
        }
    }, [defaultValues, form]);

    const handleSubmit = async (values: CategoryFormValues) => {
        try {
            setIsSubmitting(true);

            // Sanitize payload: convert empty strings to undefined to avoid UUID errors or empty text
            const payload = {
                ...values,
            };

            // Helper functions handle user_id injection via auth.getUser() implicitly/explicitly
            if (categoryId) {
                await updateCategory(categoryId, payload);
                toast.success('Categoria atualizada com sucesso!');
            } else {
                await createCategory(payload);
                toast.success('Categoria cadastrada com sucesso!');
            }
            onSuccess();
        } catch (error: any) {
            console.error('Error saving category:', error);
            if (error?.code === '23505') {
                toast.error('Você já possui uma categoria com este nome. Por favor, escolha outro.');
            } else {
                toast.error('Erro ao salvar categoria');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const PreviewBadge = () => {
        const IconComp = getIconByName(watchIcon);
        const colorClass = getColorClass(watchColor);

        return (
            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border mb-4">
                <div className={cn('rounded-full p-2', colorClass)}>
                    <IconComp className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">
                    {watchName || 'Nome da categoria'}
                </span>
            </div>
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <PreviewBadge />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Tabs value={field.value} onValueChange={field.onChange} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="Despesa">Despesa</TabsTrigger>
                                        <TabsTrigger value="Receita">Receita</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={form.formState.errors.name ? "text-red-600" : ""}>
                                Nome <span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Informe o nome da categoria" className="font-inter" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />





                <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ícone</FormLabel>
                            <FormControl>
                                <IconPicker value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cor</FormLabel>
                            <FormControl>
                                <ColorPicker value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className={onDelete ? "flex justify-between gap-2 pt-4" : "flex justify-end gap-2 pt-4"}>
                    {onDelete && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onDelete}
                            disabled={isSubmitting}
                            className="text-red-600 hover:text-red-700 hover:bg-destructive/10 font-inter"
                        >
                            Excluir
                        </Button>
                    )}
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                'Salvar'
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
