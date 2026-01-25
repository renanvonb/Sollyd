"use client"

import { Search, Plus, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AdaptiveDatePicker } from "@/components/ui/adaptive-date-picker"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DateRange } from "react-day-picker"
import { TimeRange } from "@/app/actions/transactions-fetch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface TransactionsHeaderProps {
    title: string
    description: string
    searchValue: string
    onSearchChange: (value: string) => void
    range: TimeRange
    date: DateRange | undefined
    onDateChange: (date: DateRange | undefined) => void
    onAddClick: (type: "revenue" | "expense" | "investment") => void
    statusFilter?: string
    onStatusFilterChange?: (value: string) => void
}

export function TransactionsHeader({
    title,
    description,
    searchValue,
    onSearchChange,
    range,
    date,
    onDateChange,
    onAddClick,
    statusFilter = "all",
    onStatusFilterChange,
}: TransactionsHeaderProps) {
    return (
        <div className="flex items-center justify-between flex-none px-1">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground font-jakarta">
                    {title}
                </h1>
            </div>

            <div id="filter-group" className="flex items-center gap-3 font-sans justify-end flex-wrap">
                {/* 1. Adaptive Date Picker (150px) - Maintains specific date selection within the period */}
                <AdaptiveDatePicker
                    mode={range as any}
                    value={date}
                    onChange={onDateChange}
                    className="w-auto"
                />

                {/* 2. Search Bar (250px) */}
                <div className="relative w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar"
                        className="pl-9 h-10 font-inter w-full"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* 3. Status Filter (140px) */}
                <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                    <SelectTrigger className="w-[140px] h-10 font-inter">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="Realizado">Realizadas</SelectItem>
                        <SelectItem value="Pendente">Pendentes</SelectItem>
                    </SelectContent>
                </Select>

                {/* 4. Add Button -> Dropdown */}
                <Button onClick={() => onAddClick('expense')} className="font-inter font-medium">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                </Button>
            </div>
        </div>
    )
}
