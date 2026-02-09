import ServiceCard from '../ServiceCard/ServiceCard.vue'
import { ref } from 'vue'

export default {
    components: { ServiceCard },
    setup() {
        const services = ref([
            {
                title: 'Road Ambulance',
                description: 'Fully equipped ambulances with trained medical staff, ready to respond when every minute matters.',
                image: '/third-section/road-ambulance.jpg'
            },
            {
                title: 'Air Ambulance',
                description: 'Seamless road to air medical transfers with critical care teams and advanced support.',
                image: '/third-section/air-ambulance.jpg'
            },
            {
                title: 'Rail Ambulance',
                description: 'Long-distance medical transfers with onboard care, monitoring, and trained medical support.',
                image: '/third-section/rail-ambulance.jpg'
            },
            {
                title: 'Mortuary Transfer',
                description: 'Safe and respectful transfers, with trained personnel guiding every moment.',
                image: '/third-section/morturary-van.jpg'
            },
            {
                title: 'VIP Transfers',
                description: 'Personalized medical assistance designed for smooth, comfortable patient transfers.',
                image: '/third-section/vip-transfer.jpg'
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
