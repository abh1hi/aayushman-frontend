import { ref } from 'vue'

export default {
    setup() {
        const services = ref([
            {
                title: 'ICU Ambulance',
                description: 'Advanced Life Support ambulances equipped with ventilators and monitoring systems.',
                image: 'https://placehold.co/400x300/1f2937/red?text=ICU+Ambulance',
                icon: '🏥'
            },
            {
                title: 'Ventilator Ambulance',
                description: 'Specialized for critical patients requiring respiratory support during transit.',
                image: 'https://placehold.co/400x300/1f2937/red?text=Ventilator',
                icon: '💨'
            },
            {
                title: 'Dead Body Carrier',
                description: 'Respectful and refrigerated transport for deceased individuals.',
                image: 'https://placehold.co/400x300/1f2937/red?text=Freezer+Box',
                icon: '❄'
            },
            {
                title: 'Air Ambulance',
                description: 'Rapid medical transport via aircraft for long-distance emergencies.',
                image: 'https://placehold.co/400x300/1f2937/red?text=Air+Ambulance',
                icon: '✈'
            },
            {
                title: 'Train Ambulance',
                description: 'Cost-effective long-distance medical transport with medical escort.',
                image: 'https://placehold.co/400x300/1f2937/red?text=Train+Ambulance',
                icon: '🚆'
            },
            {
                title: 'Emergency Care',
                description: '24/7 distinct emergency response for accidents and trauma.',
                image: 'https://placehold.co/400x300/1f2937/red?text=Emergency',
                icon: '🚑'
            }
        ])

        return {
            services
        }
    }
}
