import { ref, onMounted } from 'vue'

export default {
    setup() {
        const isVisible = ref(false)
        const sectionRef = ref(null)

        onMounted(() => {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    isVisible.value = true
                    // Keep observing if we want it to trigger again on re-entry? 
                    // Usually for entrance animations, `once` is better, but user said "scroll effects".
                    // I'll keep it simple for now, maybe add logic to prevent flickering.
                    observer.disconnect()
                }
            }, { threshold: 0.2 })

            if (sectionRef.value) {
                observer.observe(sectionRef.value)
            }
        })

        return {
            isVisible,
            sectionRef
        }
    }
}
