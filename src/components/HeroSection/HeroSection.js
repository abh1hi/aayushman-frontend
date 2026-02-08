import { ref } from 'vue'
import { EnquiryService } from '../../services/EnquiryService'

export default {
    setup() {
        const pickup = ref('')
        const destination = ref('')
        const mobileNumber = ref('')
        const ambulanceType = ref('')

        const loading = ref(false)
        const errorMessage = ref('')
        const successMessage = ref('')

        const ambulanceTypes = [
            'Basic Life Support (BLS)',
            'Advanced Life Support (ALS)',
            'ICU Ambulance',
            'Patient Transport',
            'Mortuary Van'
        ]

        const getGeolocation = () => {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error('Geolocation not supported'));
                } else {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            resolve({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            });
                        },
                        (error) => {
                            console.warn('Geolocation failed, defaulting to 0,0', error);
                            resolve({ latitude: 0.0, longitude: 0.0 }); // Default fallback
                        },
                        { timeout: 5000 }
                    );
                }
            });
        };

        const handleEstimate = async () => {
            loading.value = true;
            errorMessage.value = '';
            successMessage.value = '';

            // Basic Validation
            if (!mobileNumber.value) {
                errorMessage.value = 'Please enter your mobile number.';
                loading.value = false;
                alert('Please enter your mobile number.');
                return;
            }

            try {
                // Get Location
                const location = await getGeolocation();

                // Construct Payload
                const enquiryData = {
                    callerId: mobileNumber.value.startsWith('+') ? mobileNumber.value : `+91${mobileNumber.value}`, // Basic formatting
                    location: {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        address: `Pickup: ${pickup.value}, Drop: ${destination.value}, Type: ${ambulanceType.value}`
                    }
                };

                // Call Service
                await EnquiryService.submitEnquiry(enquiryData);

                successMessage.value = 'Enquiry submitted successfully! We will call you shortly.';
                alert('Enquiry submitted successfully! We will call you shortly.');
                handleReset();

            } catch (error) {
                errorMessage.value = error.message || 'Failed to submit enquiry.';
                alert(`Error: ${errorMessage.value}`);
            } finally {
                loading.value = false;
            }
        }

        const handleReset = () => {
            pickup.value = ''
            destination.value = ''
            mobileNumber.value = ''
            ambulanceType.value = ''
            errorMessage.value = ''
            successMessage.value = ''
        }

        const handleCall = () => {
            window.location.href = 'tel:8802020245'
        }

        return {
            pickup,
            destination,
            mobileNumber,
            ambulanceType,
            ambulanceTypes,
            handleEstimate,
            handleReset,
            handleCall,
            loading
        }
    }
}
