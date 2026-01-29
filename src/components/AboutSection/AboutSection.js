import { ref } from 'vue'

export default {
    setup() {
        const stats = ref([
            { label: 'Lives Saved', value: '5,00,000+', icon: '❤', color: 'text-red-500' },
            { label: 'Ambulances', value: '2,000+', icon: '🚑', color: 'text-green-500' },
            { label: 'Cities Covered', value: '50+', icon: '🏙', color: 'text-blue-500' },
            { label: 'Response Time', value: '15 Mins', icon: '⚡', color: 'text-yellow-500' }
        ])

        return {
            stats
        }
    }
}
