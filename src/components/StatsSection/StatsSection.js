import { ref, onMounted, onUnmounted, computed } from 'vue'

export default {
    setup() {
        const sectionRef = ref(null)
        const progress = ref(0)
        const activeIndex = ref(0)

        const milestones = [

            { date: '2005', label: 'Inception' },
            { date: '2010', label: 'Expansion' },
            { date: '2015', label: 'Coverage' },
            { date: '2020', label: 'Milestone' },
            { date: '2025', label: 'Target' },
        ]

        // Dynamic SVG Path for the "Bulge" effect
        const pathData = computed(() => {
            const h = 600 // Fixed height of the SVG track
            const xBase = 50
            const bulgeSize = 60 // Vertical spread of bulge
            const bulgeDepth = 30 // Horizontal protrusion

            // Calculate current Y position based on progress (clamped)
            // We want the bulge to move from top (10%) to bottom (90%)
            const currentY = Math.max(50, Math.min(h - 50, progress.value * h))

            // Construct Path: Line down -> Curve Out -> Curve In -> Line down
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

            // Calculate progress: 0 when section enters, 1 when it leaves (or centered logic)
            // Let's make it so the bulge travels down as the user scrolls through the section
            const start = winH * 0.8
            const end = winH * 0.2

            // Normalize scroll to 0-1 range relative to viewport crossing
            // rect.top goes from winH to -height
            const totalTravel = winH + rect.height
            const currentPos = winH - rect.top

            let p = currentPos / totalTravel * 1.5 - 0.2 // Tweaked for visual timing
            p = Math.max(0, Math.min(1, p))

            // Smooth lerp could be added, but direct mapping feels responsive
            progress.value = p

            // Update active Stats based on P
            // e.g., if p > 0.5 show "1M+" else "500k"
        }

        onMounted(() => {
            window.addEventListener('scroll', handleScroll)
            handleScroll() // Init
        })

        onUnmounted(() => {
            window.removeEventListener('scroll', handleScroll)
        })

        return {
            sectionRef,
            pathData,
            activeY,
            milestones,
            progress
        }
    }
}
