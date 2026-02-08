import { ref, onMounted, onUnmounted, computed } from 'vue'

export default {
    setup() {
        const sectionRef = ref(null)
        const progress = ref(0) // Timeline scroll progress
        const countProgress = ref(0) // Number counting progress

        // Milestones data...
        const milestones = [
            { date: '2005', label: 'Inception' },
            { date: '2010', label: 'Expansion' },
            { date: '2015', label: 'Coverage' },
            { date: '2020', label: 'Milestone' },
            { date: '2025', label: 'Target' },
        ]

        // Dynamic SVG Path for the "Bulge" effect
        const pathData = computed(() => {
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

        const activeY = computed(() => {
            return Math.max(50, Math.min(600 - 50, progress.value * 600))
        })

        const handleScroll = () => {
            if (!sectionRef.value) return

            const rect = sectionRef.value.getBoundingClientRect()
            const winH = window.innerHeight

            // Scroll Logic for Timeline
            // Normalize scroll to 0-1 range relative to viewport crossing
            const totalTravel = winH + rect.height
            const currentPos = winH - rect.top

            let p = currentPos / totalTravel * 1.5 - 0.2
            p = Math.max(0, Math.min(1, p))

            progress.value = p
        }

        // Count Up Animation Logic
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
            handleScroll() // Init timeline position

            // Observer for counting animation
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
            pathData,
            activeY,
            milestones,
            progress,
            countProgress
        }
    }
}
