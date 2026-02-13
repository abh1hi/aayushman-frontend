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
            default: 'https://placehold.co/600x400/222/FFF?text=Event+Image'
        },
        imagePosition: {
            type: String,
            default: 'bottom', // 'top' or 'bottom'
            validator: (value) => ['top', 'bottom'].includes(value)
        },
        alt: {
            type: String,
            default: ''
        }
    }
}
