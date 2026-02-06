"use client"

import * as React from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface TruncatedTextWithTooltipProps {
    children: React.ReactNode
    text: string
    className?: string
}

export function TruncatedTextWithTooltip({
    children,
    text,
    className
}: TruncatedTextWithTooltipProps) {
    const textRef = React.useRef<HTMLSpanElement>(null)
    const [isTruncated, setIsTruncated] = React.useState(false)

    React.useEffect(() => {
        const checkTruncation = () => {
            if (textRef.current) {
                setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth)
            }
        }

        checkTruncation()

        // Observar mudanças de tamanho
        const resizeObserver = new ResizeObserver(checkTruncation)
        if (textRef.current) {
            resizeObserver.observe(textRef.current)
        }

        return () => resizeObserver.disconnect()
    }, [text])

    if (!isTruncated) {
        return (
            <span ref={textRef} className={className}>
                {children}
            </span>
        )
    }

    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span ref={textRef} className={className}>
                        {children}
                    </span>
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    className="max-w-[300px] break-words"
                >
                    {text}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
