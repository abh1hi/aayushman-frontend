import { ref, onMounted, onUnmounted, computed } from 'vue'

export default {
    setup() {
        const sectionRef = ref(null)
        const progress = ref(0) // Timeline scroll progress (also used for number now)

        // Milestones data
        const milestones = [
            { date: '2005', label: 'Inception' },
            { date: '2010', label: 'Expansion' },
            { date: '2015', label: 'Coverage' },
            { date: '2020', label: 'Milestone' },
            { date: '2025', label: 'Target' },
        ]

        // --- DESKTOP LOGIC (height = 600) ---
        const pathDataDesktop = computed(() => {
            const h = 600
            const xBase = 50
            const bulgeSize = 60
            const bulgeDepth = 30

            // Calculate current Y position based on progress
            const currentY = Math.max(50, Math.min(h - 50, progress.value * h))

            // Construct Path
            return `M ${xBase} 0 
                    L ${xBase} ${currentY - bulgeSize} 
                    C ${xBase} ${currentY - bulgeSize * 0.5}, ${xBase + bulgeDepth} ${currentY - bulgeSize * 0.5}, ${xBase + bulgeDepth} ${currentY} 
                    C ${xBase + bulgeDepth} ${currentY + bulgeSize * 0.5}, ${xBase} ${currentY + bulgeSize * 0.5}, ${xBase} ${currentY + bulgeSize} 
                    L ${xBase} ${h}`
        })

        const activeYDesktop = computed(() => {
            // Constrain desktop active knob movement
            return Math.max(50, Math.min(600 - 50, progress.value * 600))
        })

        // --- MOBILE LOGIC (height = 500) ---
        const pathDataMobile = computed(() => {
            const h = 500
            const xBase = 50
            const bulgeSize = 60
            const bulgeDepth = 30

            // Calculate current Y position based on progress
            const currentY = Math.max(50, Math.min(h - 50, progress.value * h))

            // Construct Path
            return `M ${xBase} 0 
                    L ${xBase} ${currentY - bulgeSize} 
                    C ${xBase} ${currentY - bulgeSize * 0.5}, ${xBase + bulgeDepth} ${currentY - bulgeSize * 0.5}, ${xBase + bulgeDepth} ${currentY} 
                    C ${xBase + bulgeDepth} ${currentY + bulgeSize * 0.5}, ${xBase} ${currentY + bulgeSize * 0.5}, ${xBase} ${currentY + bulgeSize} 
                    L ${xBase} ${h}`
        })

        const activeYMobile = computed(() => {
            // Constrain mobile active knob movement
            return Math.max(50, Math.min(500 - 50, progress.value * 500))
        })


        // --- SCROLL HANDLING ---
        let ticking = false

        const updateProgress = () => {
            if (!sectionRef.value) {
                ticking = false
                return
            }

            const rect = sectionRef.value.getBoundingClientRect()
            const winH = window.innerHeight
            const totalTravel = winH + rect.height
            const currentPos = winH - rect.top

            // Normalize: 0 to 1
            let p = currentPos / totalTravel

            // Adjust range
            p = p * 1.5 - 0.2
            p = Math.max(0, Math.min(1, p))

            progress.value = p
            ticking = false
        }

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateProgress)
                ticking = true
            }
        }

        let observer = null

        onMounted(() => {
            // Initial call
            updateProgress()

            // Intersection Observer to only listen to scroll when visible
            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        window.addEventListener('scroll', handleScroll, { passive: true })
                        // Also update once on entry to ensure correct state
                        updateProgress()
                    } else {
                        window.removeEventListener('scroll', handleScroll)
                    }
                })
            }, { threshold: 0 })

            if (sectionRef.value) {
                observer.observe(sectionRef.value)
            }
        })

        onUnmounted(() => {
            window.removeEventListener('scroll', handleScroll)
            if (observer) observer.disconnect()
        })

        return {
            sectionRef,
            pathDataDesktop,
            activeYDesktop,
            pathDataMobile,
            activeYMobile,
            milestones,
            progress
        }
    }
}
