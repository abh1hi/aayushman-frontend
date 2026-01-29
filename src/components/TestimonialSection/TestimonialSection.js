import { ref } from 'vue'
import TestimonialCard from '../TestimonialCard/TestimonialCard.vue'

export default {
    components: { TestimonialCard },
    setup() {
        const testimonials = ref([
            {
                name: 'Shivani Sharma',
                role: 'Patient\'s Daughter',
                review: 'During one of the most stressful moments for our family, ALSA responded immediately. The team was calm, professional, and extremely supportive.',
                rating: 5,
                image: 'https://placehold.co/150x150/444/FFF?text=Shivani'
            },
            {
                name: 'Manish Chopra',
                role: 'Patient, Delhi NCR',
                review: 'ALSA arrived on time and took excellent control of the emergency. The staff was calm, professional, and reassuring throughout the journey.',
                rating: 5,
                image: 'https://placehold.co/150x150/555/FFF?text=Manish'
            },
            {
                name: 'Rajesh Gupta',
                role: 'Referring Doctor',
                review: 'I regularly entrust my patients to Ayushman for inter-hospital transfers. Their ICU ambulances are perfectly equipped.',
                rating: 5,
                image: 'https://placehold.co/150x150/666/FFF?text=Rajesh'
            },
            {
                name: 'Anita Desai',
                role: 'Patient\'s Wife',
                review: 'The air ambulance service was seamless. They handled all the logistics perfectly from bedside to bedside.',
                rating: 4,
                image: 'https://placehold.co/150x150/777/FFF?text=Anita'
            },
            {
                name: 'Vikram Singh',
                role: 'Event Organizer',
                review: 'Their team provided excellent medical coverage for our marathon. Very reliable and professional presence.',
                rating: 5,
                image: 'https://placehold.co/150x150/888/FFF?text=Vikram'
            }
        ])

        return {
            testimonials
        }
    }
}
