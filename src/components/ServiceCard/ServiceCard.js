export default {
    props: {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: 'https://placehold.co/400x600/18181b/ffffff?text=Service+Image'
        },
        alt: {
            type: String,
            default: ''
        }
    }
}
