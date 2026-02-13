export default {
    props: {
        title: {
            type: String,
            default: 'Facility'
        },
        image: {
            type: String,
            default: 'https://placehold.co/600x400/222/FFF?text=Facility+Image'
        },
        description: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            default: ''
        }
    }
}
