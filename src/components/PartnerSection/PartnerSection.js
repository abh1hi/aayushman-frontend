import { ref } from 'vue'

export default {
    setup() {
        const partners = ref([
            { logo: '/Partners Logo/Gemini_Generated_Image_10je8t10je8t10je-Photoroom.webp', alt: 'Partner Hospital Logo 1' },
            { logo: '/Partners Logo/Gemini_Generated_Image_fykcl8fykcl8fykc-Photoroom.webp', alt: 'Partner Hospital Logo 2' },
            { logo: '/Partners Logo/Gemini_Generated_Image_jiyjoyjiyjoyjiyj-Photoroom.webp', alt: 'Partner Hospital Logo 3' },
            { logo: '/Partners Logo/Gemini_Generated_Image_jt8dkjjt8dkjjt8d-Photoroom.webp', alt: 'Partner Hospital Logo 4' },
            { logo: '/Partners Logo/Gemini_Generated_Image_n4xuoyn4xuoyn4xu-Photoroom.webp', alt: 'Partner Hospital Logo 5' },
            { logo: '/Partners Logo/Gemini_Generated_Image_ojihsxojihsxojih-Photoroom.webp', alt: 'Partner Hospital Logo 6' },
            { logo: '/Partners Logo/Gemini_Generated_Image_vi3ui8vi3ui8vi3u-Photoroom.webp', alt: 'Partner Hospital Logo 7' },
            { logo: '/Partners Logo/Gemini_Generated_Image_xl3jo8xl3jo8xl3j-Photoroom.webp', alt: 'Partner Hospital Logo 8' }
        ])

        return {
            partners
        }
    }
}
