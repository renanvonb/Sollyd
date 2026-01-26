"use client"

import { DataTable } from "@/app/(main)/(authenticated)/transacoes/components/data-table"
import { columns } from "@/app/(main)/(authenticated)/transacoes/components/columns"
import { Transaction } from "@/types/transaction"

interface TransactionTableProps {
    data: any[]
    onRowClick?: (transaction: Transaction) => void
    searchQuery?: string
}

export function TransactionTable({ data, onRowClick, searchQuery }: TransactionTableProps) {
    return <DataTable columns={columns} data={data} onRowClick={onRowClick} searchQuery={searchQuery} />
}
