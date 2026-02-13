import BlogCard from '../BlogCard/BlogCard.vue'

export default {
    components: { BlogCard },
    setup() {
        const blogs = [
            {
                title: 'When is an Air Ambulance a Right Choice?',
                date: '12 DEC 2025',
                image: '/media/BLOGS/blog-1.jpg',
                alt: 'Air Ambulance service in India transferring a critical patient'
            },
            {
                title: 'Emergency Medical Support for Large Scale Events...',
                date: '05 DEC 2025',
                image: '/media/BLOGS/BLOG-2.jpg',
                alt: 'Medical support team at a large scale event in India'
            },
            {
                title: 'Road vs Rail: Which is Better for Long Distance?',
                date: '30 NOV 2025',
                image: '/media/BLOGS/blog-3.jpg',
                alt: 'Comparison of road and rail ambulance services for long distance transport'
            },
            {
                title: 'What Happens Inside an ICU Ambulance...',
                date: '15 OCT 2025',
                image: '/media/BLOGS/blog-4.jpg',
                alt: 'Interior view of an ICU equipped ambulance with medical equipment'
            },
            {
                title: 'ICU Setup at Home: Bringing ICU Care Home',
                date: '22 AUG 2025',
                image: '/media/BLOGS/blog-5.jpg',
                alt: 'ICU setup at home with patient monitor and medical equipment'
            },
            {
                title: 'Improving Emergency Access Across India',
                date: '12 JUL 2025',
                image: '/media/BLOGS/bog-6.jpg',
                alt: 'Emergency ambulance service improving healthcare access in rural India'
            }
        ]

        return {
            blogs
        }
    }
}
