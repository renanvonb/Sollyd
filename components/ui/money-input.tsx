import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface MoneyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: number
    onValueChange: (value: number) => void
}

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
    ({ className, value, onValueChange, ...props }, ref) => {
        const [displayValue, setDisplayValue] = React.useState("")

        React.useEffect(() => {
            if (value !== undefined && value !== null) {
                // Format initial value
                const formatter = new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                })
                setDisplayValue(formatter.format(value))
            }
        }, [value])

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let inputValue = e.target.value

            // Remove non-digits
            const digits = inputValue.replace(/\D/g, "")

            // Convert to number (divide by 100 for cents)
            const realValue = Number(digits) / 100

            // Update parent with number
            onValueChange(realValue)

            // Format for display
            const formatter = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
            })

            setDisplayValue(formatter.format(realValue))
        }

        return (
            <Input
                type="text"
                inputMode="numeric"
                className={cn("", className)}
                {...props}
                value={displayValue}
                onChange={handleChange}
                ref={ref}
            />
        )
    }
)
MoneyInput.displayName = "MoneyInput"
