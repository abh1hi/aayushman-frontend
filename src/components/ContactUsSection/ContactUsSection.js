import { ref } from 'vue'

export default {
    setup() {
        const form = ref({
            name: '',
            contact: '',
            message: ''
        })

        const submitForm = () => {
            alert(`Thank you ${form.value.name}! We will contact you soon.`)
            // Handle actual submission logic here
            form.value = { name: '', contact: '', message: '' }
        }

        return {
            form,
            submitForm
        }
    }
}
