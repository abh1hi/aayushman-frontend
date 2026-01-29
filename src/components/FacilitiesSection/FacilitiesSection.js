import { ref } from 'vue'
import FacilityCard from '../FacilityCard/FacilityCard.vue'

export default {
    components: { FacilityCard },
    setup() {
        const activeIndex = ref(0)

        const facilities = [
            {
                title: 'Inter-Hospital Transfers',
                description: 'Coordinated patient movement between healthcare facilities with medical continuity.',
                image: 'https://placehold.co/800x600/222/FFF?text=Inter-Hospital'
            },
            {
                title: 'Enterprise Medical Support',
                description: 'Comprehensive medical solutions for corporate campuses and industrial sites.',
                image: 'https://placehold.co/800x600/333/FFF?text=Enterprise+Support'
            },
            {
                title: 'Event Medical Coverage',
                description: 'On-site ambulance and paramedic support for large-scale public and private events.',
                image: 'https://placehold.co/800x600/444/FFF?text=Event+Coverage'
            },
            {
                title: 'Public Authority Healthcare',
                description: 'Partnering with government bodies to strengthen public emergency response infrastructure.',
                image: 'https://placehold.co/800x600/555/FFF?text=Public+Authority'
            },
            {
                title: 'Home Medical Care',
                description: 'Professional medical care delivered at home including nursing and equipment support.',
                image: 'https://placehold.co/800x600/666/FFF?text=Home+Care'
            },
            {
                title: 'Education & Training',
                description: 'First aid and BLS training programs for schools, offices, and communities.',
                image: 'https://placehold.co/800x600/777/FFF?text=Training'
            }
        ]

        const setActive = (index) => {
            activeIndex.value = index
        }

        return {
            facilities,
            activeIndex,
            setActive
        }
    }
}
