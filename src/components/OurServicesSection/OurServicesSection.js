import ServiceCard from '../ServiceCard/ServiceCard.vue'
import { ref } from 'vue'

export default {
    components: { ServiceCard },
    setup() {
        const services = ref([
            {
                title: 'Road Ambulance',
                description: 'Fully equipped ambulances with trained medical staff, ready to respond when every minute matters.',
                image: '/media/SERVICES/photo.jpg',
                alt: 'Advanced Life Support Road Ambulance responding to an emergency'
            },
            {
                title: 'Air Ambulance',
                description: 'Seamless road to air medical transfers with critical care teams and advanced support.',
                image: '/media/SERVICES/air ambu.jpg',
                alt: 'Air Ambulance aircraft ready for patient transfer on runway'
            },
            {
                title: 'Rail Ambulance',
                description: 'Long-distance medical transfers with onboard care, monitoring, and trained medical support.',
                image: '/media/SERVICES/train ambu.jpg',
                alt: 'Rail Ambulance compartment with medical equipment and staff'
            },
            {
                title: 'Mortuary Transfer',
                description: 'Safe and respectful transfers, with trained personnel guiding every moment.',
                image: '/media/SERVICES/mortuary.jpg',
                alt: 'Respectful mortuary van for deceased transport'
            },
            {
                title: 'VIP Transfers',
                description: 'Personalized medical assistance designed for smooth, comfortable patient transfers.',
                image: '/media/SERVICES/vip.jpg',
                alt: 'Luxury medical transport for VIP patient transfer'
            }
        ])

        const handleCall = () => {
            window.location.href = 'tel:8802020245'
        }

        return {
            services,
            handleCall
        }
    }
}
