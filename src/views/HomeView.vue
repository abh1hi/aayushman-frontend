<script setup>
import { useHead } from '@vueuse/head'
import HeroSection from '../components/HeroSection/HeroSection.vue'
import MoreThanServiceSection from '../components/MoreThanServiceSection/MoreThanServiceSection.vue'
import PartnerSection from '../components/PartnerSection/PartnerSection.vue'
import OurServicesSection from '../components/OurServicesSection/OurServicesSection.vue'
import FacilitiesSection from '../components/FacilitiesSection/FacilitiesSection.vue'
import TestimonialSection from '../components/TestimonialSection/TestimonialSection.vue'
import AlsaNetworkSection from '../components/AlsaNetworkSection/AlsaNetworkSection.vue'
import AirAmbulanceSection from '../components/AirAmbulanceSection/AirAmbulanceSection.vue'
import EventSupportSection from '../components/EventSupportSection/EventSupportSection.vue'
import StatsSection from '../components/StatsSection/StatsSection.vue'
import TrainingSection from '../components/TrainingSection/TrainingSection.vue'
import BlogSection from '../components/BlogSection/BlogSection.vue'
import FiveGSection from '../components/FiveGSection/FiveGSection.vue'
import FaqSection from '../components/FaqSection/FaqSection.vue'
import ContactUsSection from '../components/ContactUsSection/ContactUsSection.vue'
import AppFooter from '../components/AppFooter/AppFooter.vue'

import { faqs } from '../components/FaqSection/FaqSection.js'

useHead({
  title: 'Ayushmaan Life Support | Air, Road & Rail Ambulance',
  meta: [
    { name: 'description', content: 'Trusted 24/7 emergency medical transport in India. ICU Air, Road & Rail Ambulance services in Delhi, Gurgaon & Pan-India.' },
    { name: 'keywords', content: 'ambulance service, life support ambulance, air ambulance India, road ambulance Gurgaon, rail ambulance services, emergency medical transport, ICU ambulance, patient transport, 24/7 ambulance Delhi NCR, Ayushmaan Life Support' },
    { property: 'og:title', content: 'Ayushmaan Life Support Ambulance | Rapid Response Expert Care' },
    { property: 'og:description', content: '24/7 Emergency Medical Services (EMS) provider. Best Air, Road & Rail Ambulance services in India with ICU setup.' },
    { property: 'og:image', content: 'https://www.ayushmaanambulance.com/alsalogo.png' },
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
        '@graph': [
          {
            '@type': 'MedicalOrganization',
            '@id': 'https://www.ayushmaanambulance.com/#organization',
            name: 'Ayushmaan Life Support Ambulance',
            url: 'https://www.ayushmaanambulance.com',
            logo: 'https://www.ayushmaanambulance.com/logo.png',
            sameAs: [
              'https://www.facebook.com/airambulancegurgaon',
              'https://x.com/alsaambulance',
              'https://www.instagram.com/alsaambulance'
            ],
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
            areaServed: [
               { '@type': 'City', name: 'Gurugram' },
               { '@type': 'City', name: 'New Delhi' },
               { '@type': 'City', name: 'Noida' },
               { '@type': 'Country', name: 'India' }
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
          },
          {
            '@type': 'FAQPage',
            '@id': 'https://www.ayushmaanambulance.com/#faq',
            mainEntity: faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer
              }
            }))
          }
        ]
      })
    }
  ]
})
</script>

<template>
  <main class="text-white min-h-screen flex flex-col">
    <HeroSection />
    <MoreThanServiceSection />
    <PartnerSection />
    <OurServicesSection />
    <FacilitiesSection />
    <TestimonialSection />
    <AlsaNetworkSection />
    <AirAmbulanceSection />
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
