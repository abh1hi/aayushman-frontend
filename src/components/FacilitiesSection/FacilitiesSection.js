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
                image: '/media/SOLUTIONS-AFTER-SERVICES/hospital solutions.jpg',
                alt: 'Doctor and nurse coordinating inter-hospital patient transfer'
            },
            {
                title: 'Enterprise Medical Support',
                description: 'Comprehensive medical solutions for corporate campuses and industrial sites.',
                image: '/media/SOLUTIONS-AFTER-SERVICES/SOLUTIONS 2.jpg',
                alt: 'Corporate medical room setup for employee health support'
            },
            {
                title: 'Event Medical Coverage',
                description: 'On-site ambulance and paramedic support for large-scale public and private events.',
                image: '/media/SOLUTIONS-AFTER-SERVICES/SOLUTIONS 3.jpg',
                alt: 'Medical emergency tent at a public event'
            },
            {
                title: 'Public Authority Healthcare',
                description: 'Partnering with government bodies to strengthen public emergency response infrastructure.',
                image: '/media/SOLUTIONS-AFTER-SERVICES/SOLUTIONS 4.jpg',
                alt: 'Public health emergency response team in action'
            },
            {
                title: 'Home Medical Care',
                description: 'Professional medical care delivered at home including nursing and equipment support.',
                image: '/media/SOLUTIONS-AFTER-SERVICES/SOLTIONS 4.jpg',
                alt: 'Nurse providing home medical care to a patient'
            },
            {
                title: 'Education & Training',
                description: 'First aid and BLS training programs for schools, offices, and communities.',
                image: '/media/SOLUTIONS-AFTER-SERVICES/SOLTIONS 5.jpg',
                alt: 'First aid training session for CPR and emergency response'
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
