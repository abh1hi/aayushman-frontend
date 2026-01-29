export default {
    props: {
        image: {
            type: String,
            default: 'https://placehold.co/600x400/222/FFF?text=Facility+Image'
        },
        description: {
            type: String,
            required: true
        }
    }
}
