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
            default: 'https://placehold.co/800x600/222/FFF?text=Training+Image'
        },
        buttonText: {
            type: String,
            default: 'Explore'
        },
        layout: {
            type: String,
            default: 'text-left', // 'text-left' or 'text-right'
            validator: (value) => ['text-left', 'text-right'].includes(value)
        }
    }
}
