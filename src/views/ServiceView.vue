<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import AppFooter from '../components/AppFooter/AppFooter.vue'

const route = useRoute()

// contentMap stores the specific data for each route path
const contentMap = {
  '/services/air-ambulance-india': {
    title: 'Air Ambulance Services India | International Medical Flights',
    metaDesc: 'Best Air Ambulance Service in India. Low cost medical flights, ICU aircraft, and rapid international patient transfer to Nepal, Dubai, and USA.',
    heading: 'Advanced Air Ambulance Services in India',
    subHeading: 'Rapid. Reliable. ICU on Wings.',
    description: 'When time is critical, our Air Ambulance services provide the fastest medical response. Equipped with state-of-the-art ICU setups and specialized medical teams, we ensure seamless bedside-to-bedside transfers across India and internationally.',
    features: ['ICU & Ventilator Setup', 'Expert Medical Team', 'Bed-to-Bed Transfer', 'International Repatriation'],
    bgImage: '/morethanservice.webp' // Reusing existing asset or placeholder
  },
  '/services/rail-ambulance': {
    title: 'Rail Ambulance Services | Cost-Effective Medical Transport',
    metaDesc: 'Affordable Rail Ambulance services in India. AC train medical transport with ICU setup, doctor, and paramedic monitoring for long-distance travel.',
    heading: 'Economical Rail Ambulance Solutions',
    subHeading: 'Safe Long-Distance Transport.',
    description: 'Our Rail Ambulance service transforms AC train compartments into mobile ICUs. It is the most cost-effective solution for stable patients requiring long-distance transport with continuous medical monitoring.',
    features: ['Cost-Effective', 'ICU Setup on Train', 'Doctor on Board', 'Pan-India Network'],
    bgImage: '/morethanservice.webp'
  },
  '/services/road-ambulance': {
    title: 'Road Ambulance Service | ACLS, BLS & ICU Ambulance',
    metaDesc: '24/7 Road Ambulance service near you. ICU, Ventilator, and Oxygen ambulances for local and outstation patient transport. Rapid response guarantee.',
    heading: '24/7 Advanced Road Ambulance Network',
    subHeading: 'Every Minute Counts.',
    description: 'From Basic Life Support (BLS) to Advanced Life Support (ALS) ICU ambulances, our fleet is ready 24/7. We act as mobile hospitals, stabilizing patients during critical transit to the nearest hospital.',
    features: ['Oxygen Support', 'Ventilator & ICU', 'GPS Tracking', '24/7 Availability'],
    bgImage: '/morethanservice.webp'
  },
  '/locations/ambulance-service-gurgaon-delhi-ncr': {
    title: 'Ambulance Service Gurgaon & Delhi NCR | Near Medanta Hospital',
    metaDesc: 'Top-rated Ambulance service in Gurgaon and Delhi NCR. Nearest ambulance to Medanta Hospital. ICU, Cardiac, and Emergency ambulances 24/7.',
    heading: 'Emergency Ambulance Service in Gurgaon & Delhi NCR',
    subHeading: 'Trusted Local Response.',
    description: 'Strategically positioned in Gurgaon near Medanta Medicity, Fortis, and Max hospitals. We provide the fastest emergency response time in Delhi NCR for cardiac arrests, accidents, and critical care transfers.',
    features: ['Near Medanta Hospital', '15 Minute Response', 'Trauma Care Experts', 'Corporate & Event Support'],
    bgImage: '/morethanservice.webp'
  },
  '/services/event-medical-support': {
    title: 'Event Medical Support & Ambulance Standby Services',
    metaDesc: 'Professional medical support for corporate events, marathons, weddings, and sports in Delhi NCR. On-site ambulance and doctor standby.',
    heading: 'Event Medical Support & Standby',
    subHeading: 'Safety for Your Guests.',
    description: 'Ensure the safety of your attendees with our on-site medical standby services. From corporate meets to large-scale sports events, our unparalleled medical coverage gives you peace of mind.',
    features: ['On-Site Doctor', 'ALS Ambulance Standby', 'First Aid Stations', 'Rapid Evacuation Plan'],
    bgImage: '/morethanservice.webp'
  }
}

// Fallback content
const defaultContent = {
  title: 'All Services | Ayushmaan Life Support',
  heading: 'Our Medical Services',
  description: 'Comprehensive emergency medical solutions.',
  features: []
}

const content = computed(() => contentMap[route.path] || defaultContent)

// Dynamic Head
useHead({
  title: computed(() => content.value.title),
  meta: [
    { name: 'description', content: computed(() => content.value.metaDesc) },
    { property: 'og:title', content: computed(() => content.value.title) },
    { property: 'og:description', content: computed(() => content.value.metaDesc) },
    { property: 'og:image', content: 'https://ayushman-ambulance.web.app/alsalogo.png' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: content.value.heading,
        description: content.value.metaDesc,
        provider: {
          '@type': 'MedicalOrganization',
          name: 'Ayushmaan Life Support Ambulance',
          url: 'https://ayushman-ambulance.web.app',
          logo: 'https://ayushman-ambulance.web.app/logo.png' 
        },
        serviceType: content.value.title,
        areaServed: {
          '@type': 'Country',
          name: 'India'
        },
        offers: content.value.features.map(feature => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: feature
          }
        }))
      }))
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white">
    <!-- Hero Banner -->
    <div class="relative h-[60vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center opacity-40" :style="{ backgroundImage: `url(${content.bgImage})` }"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
      
      <div class="container mx-auto px-4 relative z-10 text-center">
        <span class="text-green-500 tracking-widest uppercase text-sm font-bold mb-4 block">{{ content.subHeading }}</span>
        <h1 class="text-4xl md:text-6xl font-black mb-6">{{ content.heading }}</h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">{{ content.description }}</p>
        
        <div class="mt-8 flex gap-4 justify-center">
             <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105">
                Call Now: +91 8802020245
             </button>
        </div>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="py-20 bg-slate-900">
      <div class="container mx-auto px-4">
        <h2 class="text-center text-3xl font-bold mb-12 uppercase tracking-wide">Key Features</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(feature, index) in content.features" :key="index" class="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-green-500 transition-colors">
            <div class="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4 text-xl font-bold">✓</div>
            <h3 class="text-xl font-bold text-white">{{ feature }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="py-16 bg-gradient-to-r from-red-900 to-slate-900 text-center">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
        <p class="text-gray-300 mb-8">Our emergency coordination team is available 24/7 to assist you.</p>
         <a href="tel:+918802020245" class="inline-block bg-white text-red-900 font-black py-4 px-10 rounded-full text-lg shadow-xl hover:bg-gray-100 transition">
           DIAL EMERGENCY: 88-02-02-02-45
         </a>
      </div>
    </div>

    <AppFooter />
  </div>
</template>
