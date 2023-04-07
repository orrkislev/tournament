import { useEffect, useState } from "react"

export default function useResponsive() {
    const [isMobile, setIsMobile] = useState(false)
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true)
                setIsDesktop(false)
            } else {
                setIsMobile(false)
                setIsDesktop(true)
            }
        }

        window.addEventListener('resize', handleResize)

        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return { isMobile, isDesktop }
}