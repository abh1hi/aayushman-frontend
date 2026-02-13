import EventCard from '../EventCard/EventCard.vue'

export default {
    components: { EventCard },
    setup() {
        const events = [
            {
                title: 'Concert & Festival Medical Coverage',
                description: 'On ground medical teams and ICU ambulances supporting large live events.',
                imagePosition: 'bottom',
                image: '/media/EVENTS/events 1.jpg',
                alt: 'Medical team providing support at a large concert festival'
            },
            {
                title: 'Sports & Stadium Medical Support',
                description: 'Prepared medical coverage for competitive sports and athletic events.',
                imagePosition: 'top',
                image: '/media/EVENTS/events 2.jpg',
                alt: 'Ambulance and medical staff on standby at a sports stadium'
            },
            {
                title: 'Private Event Medical Coverage',
                description: 'Discreet medical readiness for hotels, resorts, and private gatherings.',
                imagePosition: 'bottom',
                image: '/media/EVENTS/events 3.jpg',
                alt: 'Private event medical coverage setup at a luxury venue'
            }
        ]

        return {
            events
        }
    }
}
