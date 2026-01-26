import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const emptyStateVariants = cva(
    "flex flex-col items-center justify-center text-center",
    {
        variants: {
            variant: {
                default: "bg-background",
                outlined: "border border-dashed !border-border !bg-white dark:!bg-card text-card-foreground shadow-sm rounded-lg",
            },
            size: {
                sm: "p-6 min-h-[200px]",
                lg: "p-12 min-h-[400px]",
            },
        },
        defaultVariants: {
            variant: "outlined",
            size: "lg",
        },
    }
)

interface EmptyStateProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof emptyStateVariants> {
    title: string | React.ReactNode
    description?: string
    icon?: LucideIcon
    action?: React.ReactNode
    titleClassName?: string
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
    ({ className, variant, size, title, description, icon: Icon, action, titleClassName, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(emptyStateVariants({ variant, size }), className)}
                {...props}
            >
                <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                    {Icon && (
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Icon className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                    )}
                    <h3 className={cn("text-xl font-bold tracking-tight font-jakarta text-foreground", titleClassName)}>{title}</h3>
                    {description && (
                        <p className="mt-2 text-muted-foreground font-sans max-w-[400px]">
                            {description}
                        </p>
                    )}
                    {action && <div className="mt-8">{action}</div>}
                </div>
            </div>
        )
    }
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
