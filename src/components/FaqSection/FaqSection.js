import { ref } from 'vue'

export default {
    setup() {
        const activeIndex = ref(null)

        const faqs = [
            { question: 'How can i contact support team?', answer: 'You can reach our 24/7 support team via the "Call Now" button, our hotline 1800-ALSA-HELP, or email support@alsa.com.' },
            { question: 'What types of ambulances do you operate?', answer: 'We operate Basic Life Support (BLS), Advanced Life Support (ALS), ICU Ambulances, and Air Ambulances equipped with critical care facilities.' },
            { question: 'Do you provide inter-hospital transfers?', answer: 'Yes, we specialize in seamless bed-to-bed inter-hospital transfers with continuous medical monitoring.' },
            { question: 'Is the service available 24×7?', answer: 'Absolutely. Our emergency response network is active 24 hours a day, 365 days a year, across all our covered regions.' },
            { question: 'Do you operate across cities and states in India?', answer: 'Yes, we have a nationwide network covering major metros and tier-2 cities, facilitating long-distance medical transport.' },
            { question: 'How early should we book medical support for an event?', answer: 'We recommend booking at least 48 hours in advance for large events to ensure adequate resource allocation and planning.' }
        ]

        const toggle = (index) => {
            activeIndex.value = activeIndex.value === index ? null : index
        }

        return {
            faqs,
            activeIndex,
            toggle
        }
    }
}
