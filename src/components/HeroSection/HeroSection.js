import { ref } from 'vue'

export default {
    setup() {
        const pickup = ref('')
        const destination = ref('')
        const ambulanceType = ref('')

        const ambulanceTypes = [
            'Basic Life Support (BLS)',
            'Advanced Life Support (ALS)',
            'ICU Ambulance',
            'Patient Transport',
            'Mortuary Van'
        ]

        const handleEstimate = () => {
            console.log('Estimating Fare:', {
                pickup: pickup.value,
                destination: destination.value,
                type: ambulanceType.value
            })
            alert('Estimated Fare: ₹1500 (Demo)')
        }

        const handleReset = () => {
            pickup.value = ''
            destination.value = ''
            ambulanceType.value = ''
        }

        const handleCall = () => {
            window.location.href = 'tel:8802020245'
        }

        return {
            pickup,
            destination,
            ambulanceType,
            ambulanceTypes,
            handleEstimate,
            handleReset,
            handleCall
        }
    }
}
