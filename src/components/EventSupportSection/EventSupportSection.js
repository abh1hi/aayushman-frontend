import EventCard from '../EventCard/EventCard.vue'

export default {
    components: { EventCard },
    setup() {
        const events = [
            {
                title: 'Concert & Festival Medical Coverage',
                description: 'On ground medical teams and ICU ambulances supporting large live events.',
                imagePosition: 'bottom',
                image: 'https://placehold.co/600x800/222/FFF?text=Concert+Medic'
            },
            {
                title: 'Sports & Stadium Medical Support',
                description: 'Prepared medical coverage for competitive sports and athletic events.',
                imagePosition: 'top',
                image: 'https://placehold.co/600x800/333/FFF?text=Sports+Medic'
            },
            {
                title: 'Private Event Medical Coverage',
                description: 'Discreet medical readiness for hotels, resorts, and private gatherings.',
                imagePosition: 'bottom',
                image: 'https://placehold.co/600x800/444/FFF?text=Private+Event'
            }
        ]

        return {
            events
        }
    }
}
