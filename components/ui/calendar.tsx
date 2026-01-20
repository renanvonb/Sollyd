"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

// Helpers e Constantes Compartilhadas
const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
}

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    mode,
    selected,
    onSelect,
    ...props
}: CalendarProps) {

    // ==========================================
    // Implementação Customizada para Single Date (Dia)
    // ==========================================
    if (mode !== "range") {
        const [currentDate, setCurrentDate] = React.useState<Date>(
            (selected instanceof Date ? selected : new Date())
        )

        React.useEffect(() => {
            if (selected instanceof Date) {
                setCurrentDate(selected)
            }
        }, [selected])

        const generateCalendarDays = () => {
            const daysInMonth = getDaysInMonth(currentDate)
            const firstDay = getFirstDayOfMonth(currentDate)
            const days = []

            const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
            const daysInPrevMonth = getDaysInMonth(prevMonth)

            for (let i = firstDay - 1; i >= 0; i--) {
                days.push({
                    day: daysInPrevMonth - i,
                    isCurrentMonth: false,
                    isPrevMonth: true,
                    date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i)
                })
            }

            for (let i = 1; i <= daysInMonth; i++) {
                days.push({
                    day: i,
                    isCurrentMonth: true,
                    isPrevMonth: false,
                    date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
                })
            }

            const remainingDays = 42 - days.length
            for (let i = 1; i <= remainingDays; i++) {
                days.push({
                    day: i,
                    isCurrentMonth: false,
                    isPrevMonth: false,
                    date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
                })
            }
            return days
        }

        const isSameDay = (date1: Date, date2: any) => {
            if (!(date2 instanceof Date)) return false
            return date1.getDate() === date2.getDate() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getFullYear() === date2.getFullYear()
        }

        const handlePrevMonth = (e: React.MouseEvent) => {
            e.preventDefault(); e.stopPropagation()
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
        }

        const handleNextMonth = (e: React.MouseEvent) => {
            e.preventDefault(); e.stopPropagation()
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
        }

        const handleDayClick = (e: React.MouseEvent, dayInfo: any) => {
            e.preventDefault(); e.stopPropagation()
            if (onSelect) (onSelect as any)(dayInfo.date)
            if (!dayInfo.isCurrentMonth) {
                setCurrentDate(new Date(dayInfo.date.getFullYear(), dayInfo.date.getMonth(), 1))
            }
        }

        const calendarDays = generateCalendarDays()

        return (
            <div className={cn("w-[280px] bg-white rounded-lg border shadow-sm p-4", className)}>
                <div className="flex items-center justify-between mb-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-100" onClick={handlePrevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium capitalize">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-100" onClick={handleNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="text-xs text-zinc-500 text-center font-medium h-8 flex items-center justify-center">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((dayInfo, index) => {
                        const isSelected = isSameDay(dayInfo.date, selected)
                        return (
                            <button
                                key={index}
                                onClick={(e) => handleDayClick(e, dayInfo)}
                                className={cn(
                                    "h-8 w-8 text-sm rounded-md flex items-center justify-center transition-colors",
                                    !dayInfo.isCurrentMonth ? 'text-zinc-300' : 'text-zinc-900',
                                    isSelected
                                        ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                                        : dayInfo.isCurrentMonth ? 'hover:bg-zinc-100' : ''
                                )}
                            >
                                {dayInfo.day}
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }

    // ==========================================
    // Implementação Customizada para Range (Período) - 2 Meses
    // ==========================================

    // Casting seguro para DateRange, assumindo que se mode === 'range', selected é DateRange
    const rangeSelected = selected as DateRange | undefined
    const [currentRangeDate, setCurrentRangeDate] = React.useState<Date>(
        rangeSelected?.from || new Date()
    )
    const [selectingStart, setSelectingStart] = React.useState<boolean>(!rangeSelected?.to)

    // Sync state with props
    React.useEffect(() => {
        // Opcional: Se selected mudar externamente, atualizamos a visão?
        // Talvez não seja necessário mudar a visão (mês), apenas o range vizualizado.
    }, [selected])

    const generateRangeCalendarDays = (monthOffset = 0) => {
        const targetDate = new Date(currentRangeDate.getFullYear(), currentRangeDate.getMonth() + monthOffset, 1)
        const daysInMonth = getDaysInMonth(targetDate)
        const firstDay = getFirstDayOfMonth(targetDate)
        const days = []

        const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() - 1, 1)
        const daysInPrevMonth = getDaysInMonth(prevMonth)

        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                isPrevMonth: true,
                date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i)
            })
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                isPrevMonth: false,
                date: new Date(targetDate.getFullYear(), targetDate.getMonth(), i)
            })
        }

        const remainingDays = 42 - days.length
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                isPrevMonth: false,
                date: new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, i)
            })
        }
        return days
    }

    const isSameDay = (date1?: Date, date2?: Date) => {
        if (!date1 || !date2) return false
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
    }

    const isInRange = (date: Date) => {
        const start = rangeSelected?.from
        const end = rangeSelected?.to
        if (!start || !end) return false
        const time = date.getTime()
        return time > start.getTime() && time < end.getTime()
    }

    const handleRangePrevMonth = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation()
        setCurrentRangeDate(new Date(currentRangeDate.getFullYear(), currentRangeDate.getMonth() - 1, 1))
    }

    const handleRangeNextMonth = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation()
        setCurrentRangeDate(new Date(currentRangeDate.getFullYear(), currentRangeDate.getMonth() + 1, 1))
    }

    const handleRangeDayClick = (e: React.MouseEvent, dayInfo: any) => {
        e.preventDefault(); e.stopPropagation()

        let newRange: DateRange = { ...rangeSelected }

        if (selectingStart) {
            newRange = { from: dayInfo.date, to: undefined }
            setSelectingStart(false)
        } else {
            const start = newRange.from
            if (start && dayInfo.date < start) {
                newRange = { from: dayInfo.date, to: start }
            } else {
                newRange = { from: start, to: dayInfo.date }
            }
            setSelectingStart(true)
        }

        if (onSelect) (onSelect as any)(newRange)
    }

    const getDayClassName = (dayInfo: any) => {
        const isStart = isSameDay(dayInfo.date, rangeSelected?.from)
        const isEnd = isSameDay(dayInfo.date, rangeSelected?.to)
        const inRange = isInRange(dayInfo.date)

        let classes = "h-8 w-8 text-sm flex items-center justify-center transition-colors relative"

        if (!dayInfo.isCurrentMonth) {
            classes += " text-zinc-300"
        } else {
            classes += " text-zinc-900"
        }

        if (isStart || isEnd) {
            classes += " bg-zinc-900 text-white rounded-md z-10 hover:bg-zinc-800"
        } else if (inRange) {
            classes += " bg-zinc-100" // Cor do range
        } else {
            classes += " hover:bg-zinc-50 rounded-md"
        }
        return classes
    }

    const firstMonthDays = generateRangeCalendarDays(0)
    const secondMonthDays = generateRangeCalendarDays(1)

    // Calcular data do segundo mês para o header (pode virar ano)
    const secondMonthDate = new Date(currentRangeDate.getFullYear(), currentRangeDate.getMonth() + 1, 1)

    return (
        <div className={cn("bg-white rounded-lg border shadow-sm p-6 w-[580px]", className)}>
            {/* Largura ajustada para caber 2 meses */}
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-100" onClick={handleRangePrevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-16">
                    <div className="text-sm font-medium capitalize w-[140px] text-center">
                        {monthNames[currentRangeDate.getMonth()]} {currentRangeDate.getFullYear()}
                    </div>
                    <div className="text-sm font-medium capitalize w-[140px] text-center">
                        {monthNames[secondMonthDate.getMonth()]} {secondMonthDate.getFullYear()}
                    </div>
                </div>

                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-100" onClick={handleRangeNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex gap-8">
                {/* First Month */}
                <div className="flex-1">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {daysOfWeek.map((day) => (
                            <div key={day} className="text-xs text-zinc-500 text-center font-medium h-8 flex items-center justify-center">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {firstMonthDays.map((dayInfo, index) => (
                            <button
                                key={index}
                                onClick={(e) => handleRangeDayClick(e, dayInfo)}
                                className={getDayClassName(dayInfo)}
                            >
                                {dayInfo.day}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Second Month */}
                <div className="flex-1">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {daysOfWeek.map((day) => (
                            <div key={day} className="text-xs text-zinc-500 text-center font-medium h-8 flex items-center justify-center">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {secondMonthDays.map((dayInfo, index) => (
                            <button
                                key={index}
                                onClick={(e) => handleRangeDayClick(e, dayInfo)}
                                className={getDayClassName(dayInfo)}
                            >
                                {dayInfo.day}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

Calendar.displayName = "Calendar"

export { Calendar }
