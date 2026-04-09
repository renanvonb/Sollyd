'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface SidebarContextType {
    isOpen: boolean
    isMobile: boolean
    toggle: () => void
    setMobileSheetOpen: (open: boolean) => void
    isMobileSheetOpen: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const [isMobileSheetOpen, setMobileSheetOpen] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const toggle = () => {
        if (isMobile) {
            setMobileSheetOpen((prev) => !prev)
        } else {
            setIsOpen((prev) => !prev)
        }
    }

    return (
        <SidebarContext.Provider value={{ isOpen, isMobile, toggle, isMobileSheetOpen, setMobileSheetOpen }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return context
}
