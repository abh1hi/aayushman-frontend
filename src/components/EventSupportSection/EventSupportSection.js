import EventCard from '../EventCard/EventCard.vue'

export default {
    components: { EventCard },
    setup() {
        const events = [
            {
                title: 'Concert & Festival Medical Coverage',
                description: 'On ground medical teams and ICU ambulances supporting large live events.',
                imagePosition: 'bottom',
                image: '/events/events_1.jpg'
            },
            {
                title: 'Sports & Stadium Medical Support',
                description: 'Prepared medical coverage for competitive sports and athletic events.',
                imagePosition: 'top',
                image: '/events/events_2.jpg'
            },
            {
                title: 'Private Event Medical Coverage',
                description: 'Discreet medical readiness for hotels, resorts, and private gatherings.',
                imagePosition: 'bottom',
                image: '/events/events_3.jpg'
            }
        ]

        return {
            events
        }
    }
}
