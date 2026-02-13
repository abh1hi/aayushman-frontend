export default {
    props: {
        title: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: 'https://placehold.co/600x600/222/FFF?text=Blog+Post'
        },
        alt: {
            type: String,
            default: ''
        }
    }
}
