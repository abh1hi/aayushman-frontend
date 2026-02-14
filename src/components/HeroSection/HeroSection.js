import { ref } from 'vue'
import { EnquiryService } from '../../services/EnquiryService'

export default {
    setup() {
        const name = ref('')
        const mobileNumber = ref('')

        const loading = ref(false)
        const errorMessage = ref('')
        const successMessage = ref('')

        const handleSubmit = async () => {
            loading.value = true;
            errorMessage.value = '';
            successMessage.value = '';

            // Basic Validation
            if (!name.value) {
                errorMessage.value = 'Please enter your name.';
                loading.value = false;
                alert('Please enter your name.');
                return;
            }
            if (!mobileNumber.value) {
                errorMessage.value = 'Please enter your contact number.';
                loading.value = false;
                alert('Please enter your contact number.');
                return;
            }

            try {
                // Construct Payload
                const enquiryData = {
                    name: name.value,
                    contact: mobileNumber.value.startsWith('+') ? mobileNumber.value : `+91${mobileNumber.value}`, // Basic formatting
                    type: 'Quick Call Request',
                    source: 'Hero Section'
                };

                // Call Service
                await EnquiryService.submitEnquiry(enquiryData);

                successMessage.value = 'Request submitted! We will call you within seconds.';
                alert('Request submitted! We will call you within seconds.');
                handleReset();

            } catch (error) {
                errorMessage.value = error.message || 'Failed to submit request.';
                alert(`Error: ${errorMessage.value}`);
            } finally {
                loading.value = false;
            }
        }

        const handleReset = () => {
            name.value = ''
            mobileNumber.value = ''
            errorMessage.value = ''
            successMessage.value = ''
        }

        const handleCall = () => {
            window.location.href = 'tel:8802020245'
        }

        return {
            name,
            mobileNumber,
            handleSubmit,
            handleReset,
            handleCall,
            loading
        }
    }
}
