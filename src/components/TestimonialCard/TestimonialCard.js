export default {
    props: {
        name: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'Patient'
        },
        review: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            default: 5
        },
        image: {
            type: String,
            default: 'https://placehold.co/100x100/333/FFF?text=User'
        }
    }
}
