<script setup>
import Header from './components/Header/Header.vue'
import { useHead } from '@vueuse/head'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

useHead({
  link: [
    {
      rel: 'alternate',
      hreflang: 'en-IN',
      href: computed(() => {
        const path = route.path.endsWith('/') ? route.path : `${route.path}/`
        return `https://www.ayushmaanambulance.com${path}`
      })
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: computed(() => {
        const path = route.path.endsWith('/') ? route.path : `${route.path}/`
        return `https://www.ayushmaanambulance.com${path}`
      })
    },
    {
      rel: 'canonical',
      href: computed(() => {
        const path = route.path.endsWith('/') ? route.path : `${route.path}/`
        return `https://www.ayushmaanambulance.com${path}`
      })
    }
  ]
})
</script>

<template>
  <div class="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
    <!-- New Glassmorphic Header -->
    <Header />

    <router-view />
  </div>
</template>

<style>
/* Global resets if needed */
body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, sans-serif;
  background-color: #111827;
}
</style>
