import { useEffect, useRef } from 'react'

/**
 * Attaches IntersectionObserver to a container ref.
 * All .reveal children inside it animate in when visible.
 */
export function useScrollReveal(deps = []) {
    const ref = useRef(null)

    useEffect(() => {
        if (!ref.current) return

        const els = ref.current.querySelectorAll('.reveal')
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')]
                        const idx = siblings.indexOf(entry.target)
                        entry.target.style.transitionDelay = `${idx * 0.07}s`
                        entry.target.classList.add('visible')
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
        )

        els.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    return ref
}
