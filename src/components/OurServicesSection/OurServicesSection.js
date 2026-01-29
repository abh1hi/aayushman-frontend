import ServiceCard from '../ServiceCard/ServiceCard.vue'
import { ref } from 'vue'

export default {
    components: { ServiceCard },
    setup() {
        const services = ref([
            {
                title: 'Road Ambulance',
                description: 'Fully equipped ambulances with trained medical staff, ready to respond when every minute matters.',
                image: 'https://placehold.co/600x800/222/FFF?text=Road+Ambulance'
            },
            {
                title: 'Air Ambulance',
                description: 'Seamless road to air medical transfers with critical care teams and advanced support.',
                image: 'https://placehold.co/600x800/333/FFF?text=Air+Ambulance'
            },
            {
                title: 'Rail Ambulance',
                description: 'Long-distance medical transfers with onboard care, monitoring, and trained medical support.',
                image: 'https://placehold.co/600x800/444/FFF?text=Rail+Ambulance'
            },
            {
                title: 'Mortuary Transfer',
                description: 'Safe and respectful transfers, with trained personnel guiding every moment.',
                image: 'https://placehold.co/600x800/555/FFF?text=Mortuary+Van'
            },
            {
                title: 'VIP Transfers',
                description: 'Personalized medical assistance designed for smooth, comfortable patient transfers.',
                image: 'https://placehold.co/600x800/666/FFF?text=VIP+Transport'
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
