import { ref } from 'vue'

export default {
    setup() {
        const email = ref('')

        const subscribe = () => {
            alert('Subscribed with: ' + email.value)
            email.value = ''
        }

        return {
            email,
            subscribe
        }
    }
}
