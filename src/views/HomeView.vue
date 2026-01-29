<script setup>
import { useHead } from '@vueuse/head'
import HeroSection from '../components/HeroSection/HeroSection.vue'
import MoreThanServiceSection from '../components/MoreThanServiceSection/MoreThanServiceSection.vue'
import PartnerSection from '../components/PartnerSection/PartnerSection.vue'
import OurServicesSection from '../components/OurServicesSection/OurServicesSection.vue'
import FacilitiesSection from '../components/FacilitiesSection/FacilitiesSection.vue'
import TestimonialSection from '../components/TestimonialSection/TestimonialSection.vue'
import AlsaNetworkSection from '../components/AlsaNetworkSection/AlsaNetworkSection.vue'
import EventSupportSection from '../components/EventSupportSection/EventSupportSection.vue'
import StatsSection from '../components/StatsSection/StatsSection.vue'
import TrainingSection from '../components/TrainingSection/TrainingSection.vue'
import BlogSection from '../components/BlogSection/BlogSection.vue'
import FiveGSection from '../components/FiveGSection/FiveGSection.vue'
import FaqSection from '../components/FaqSection/FaqSection.vue'
import ContactUsSection from '../components/ContactUsSection/ContactUsSection.vue'
import AppFooter from '../components/AppFooter/AppFooter.vue'

useHead({
  title: 'Ayushman Life Support Ambulance | Air, Road & Rail Emergency Services 24/7',
  meta: [
    { name: 'description', content: 'Leading trusted life support ambulance provider in India. Offering 24/7 emergency medical transport via Air, Road, and Rail. ICU, Ventilator, and Critical Care services available in Delhi, Gurgaon, and Pan-India.' },
    { name: 'keywords', content: 'ambulance service, life support ambulance, air ambulance India, road ambulance Gurgaon, rail ambulance services, emergency medical transport, ICU ambulance, patient transport, 24/7 ambulance Delhi NCR, Ayushman Life Support' },
    { property: 'og:title', content: 'Ayushman Life Support Ambulance | Rapid Response Expert Care' },
    { property: 'og:description', content: '24/7 Emergency Medical Services (EMS) provider. Best Air, Road & Rail Ambulance services in India with ICU setup.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'en_IN' },
    { name: 'geo.region', content: 'IN-DL' }, // Targeting Delhi/NCR region signal
    { name: 'geo.placename', content: 'New Delhi' },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'MedicalOrganization',
        name: 'Ayushman Life Support Ambulance',
        url: 'https://ayushman-ambulance.web.app',
        logo: 'https://ayushman-ambulance.web.app/logo.png', // Replace with actual logo URL if available
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-8802020245',
          contactType: 'emergency',
          areaServed: 'IN',
          availableLanguage: ['en', 'hi']
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Plot No. 1114, Sector 38',
          addressLocality: 'Gurugram',
          addressRegion: 'Haryana',
          postalCode: '122001',
          addressCountry: 'IN'
        },
        sameAs: [
          'https://www.facebook.com/AyushmanAmbulance',
          'https://twitter.com/AyushmanEMS',
          'https://www.instagram.com/AyushmanEMS'
        ],
        makesOffer: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Air Ambulance Service',
              description: 'ICU equipped air ambulance for critical patient transfer.'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Road Ambulance Service',
              description: 'Advanced Life Support (ALS) and Basic Life Support (BLS) road ambulances.'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Rail Ambulance Service',
              description: 'Cost-effective long-distance medical transport via train.'
            }
          }
        ]
      })
    }
  ]
})
</script>

<template>
  <main class="text-white min-h-screen">
    <HeroSection />
    <MoreThanServiceSection />
    <PartnerSection />
    <OurServicesSection />
    <FacilitiesSection />
    <TestimonialSection />
    <AlsaNetworkSection />
    <EventSupportSection />
    <StatsSection />
    <TrainingSection />
    <BlogSection />
    <FiveGSection />
    <FaqSection />
    <ContactUsSection />
    <AppFooter />
  </main>
</template>
