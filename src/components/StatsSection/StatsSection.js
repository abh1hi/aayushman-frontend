import { ref, onMounted, onUnmounted, computed } from 'vue'

export default {
    setup() {
        const sectionRef = ref(null)
        const progress = ref(0) // Timeline scroll progress
        const countProgress = ref(0) // Number counting progress

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
        const handleScroll = () => {
            if (!sectionRef.value) return

            const rect = sectionRef.value.getBoundingClientRect()
            const winH = window.innerHeight

            // Scroll Logic for Timeline
            // Determine how far the section has travelled through the viewport
            // 0 = section top just enters viewport bottom
            // 1 = section bottom just leaves viewport top? Or section center passes middle?
            // Let's refine for a nice reveal:

            const totalTravel = winH + rect.height
            const currentPos = winH - rect.top

            // Normalize: 0 to 1
            let p = currentPos / totalTravel

            // Adjust range to make the animation span a bit wider or centered better
            // e.g., multiply by 1.5 and offset to start earlier/later
            p = p * 1.5 - 0.2

            p = Math.max(0, Math.min(1, p))

            progress.value = p
        }

        // --- COUNT UP ANIMATION ---
        const startCounting = () => {
            let start = 0
            const duration = 2000
            const startTime = performance.now()

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime
                const progress = Math.min(elapsed / duration, 1)

                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3)

                countProgress.value = easeOut

                if (progress < 1) {
                    requestAnimationFrame(animate)
                }
            }

            requestAnimationFrame(animate)
        }

        onMounted(() => {
            window.addEventListener('scroll', handleScroll, { passive: true })
            // Initial call to set state
            handleScroll()

            // Observer for counting animation triggering once
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    startCounting()
                    observer.disconnect()
                }
            }, { threshold: 0.3 })

            if (sectionRef.value) {
                observer.observe(sectionRef.value)
            }
        })

        onUnmounted(() => {
            window.removeEventListener('scroll', handleScroll)
        })

        return {
            sectionRef,
            pathDataDesktop,
            activeYDesktop,
            pathDataMobile,
            activeYMobile,
            milestones,
            progress,
            countProgress
        }
    }
}
