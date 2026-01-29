import TrainingCard from '../TrainingCard/TrainingCard.vue'

export default {
    components: { TrainingCard },
    setup() {
        const items = [
            {
                title: 'Infrastructure that Powers Reliable Response',
                description: "ALSA's centralised operations workplace enables real-time coordination and reliable emergency response for hospitals and healthcare enterprises.",
                image: 'https://placehold.co/800x600/111/FFF?text=Operations+Center',
                buttonText: 'Explore Hospital Solutions',
                layout: 'text-left'
            },
            {
                title: 'Education & Training that Empower Excellence',
                description: 'At ALSA, continuous education strengthens emergency readiness. This builds skilled professionals prepared to respond with clarity and precision when it matters most.',
                image: 'https://placehold.co/800x600/111/FFF?text=CPR+Training',
                buttonText: 'Explore Training Programs',
                layout: 'text-right'
            }
        ]

        return {
            items
        }
    }
}
