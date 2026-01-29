import BlogCard from '../BlogCard/BlogCard.vue'

export default {
    components: { BlogCard },
    setup() {
        const blogs = [
            {
                title: 'When is an Air Ambulance a Right Choice?',
                date: '12 DEC 2025',
                image: 'https://placehold.co/600x600/111/FFF?text=Air+Ambulance'
            },
            {
                title: 'Emergency Medical Support for Large Scale Events...',
                date: '05 DEC 2025',
                image: 'https://placehold.co/600x600/222/FFF?text=Event+Support'
            },
            {
                title: 'Road vs Rail: Which is Better for Long Distance?',
                date: '30 NOV 2025',
                image: 'https://placehold.co/600x600/333/FFF?text=Road+vs+Rail'
            },
            {
                title: 'What Happens Inside an ICU Ambulance...',
                date: '15 OCT 2025',
                image: 'https://placehold.co/600x600/444/FFF?text=Inside+ICU'
            },
            {
                title: 'ICU Setup at Home: Bringing ICU Care Home',
                date: '22 AUG 2025',
                image: 'https://placehold.co/600x600/555/FFF?text=ICU+At+Home'
            },
            {
                title: 'Improving Emergency Access Across India',
                date: '12 JUL 2025',
                image: 'https://placehold.co/600x600/666/FFF?text=Emergency+Access'
            }
        ]

        return {
            blogs
        }
    }
}
