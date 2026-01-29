import { ref } from 'vue'

export default {
    setup() {
        const activeDropdown = ref(null)
        const isMobileMenuOpen = ref(false)

        const toggleMobileMenu = () => {
            isMobileMenuOpen.value = !isMobileMenuOpen.value
        }

        const navItems = ref([
            { name: 'About us', link: '#' },
            { name: 'Services', link: '#' },
            { name: 'Solutions', link: '#' },
            { name: 'Network', link: '#' },
            { name: 'Explore', link: '#' },
        ])

        const toggleDropdown = (index) => {
            activeDropdown.value = activeDropdown.value === index ? null : index
        }

        return {
            navItems,
            activeDropdown,
            toggleDropdown,
            isMobileMenuOpen,
            toggleMobileMenu
        }
    }
}
