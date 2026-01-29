<script setup>
import Header from './components/Header/Header.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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
  font-family: 'Inter', sans-serif;
  background-color: #111827;
}
</style>
