<template>
  <section class="services-section py-20 text-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="font-bold mb-4" style="font-size: 28px;">Our <span class="text-red-600">Services</span></h2>
        <div class="w-24 h-1 bg-red-600 mx-auto rounded"></div>
        <p class="text-gray-400 mt-4 max-w-2xl mx-auto">
          We provide a comprehensive range of medical transport services designed to meet every critical need.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(service, index) in services" :key="index" 
             class="service-card bg-gray-900 rounded-xl overflow-hidden border border-gray-800 group">
          
          <div class="h-48 overflow-hidden relative">
             <img :src="service.image" :alt="service.title" class="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
             <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
          </div>

          <div class="p-6">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-2xl">{{ service.icon }}</span>
              <h3 class="text-xl font-bold group-hover:text-red-500 transition">{{ service.title }}</h3>
            </div>
            <p class="text-gray-400 text-sm mb-4">
              {{ service.description }}
            </p>
            <a href="#" class="text-red-500 font-semibold text-sm hover:text-white transition flex items-center gap-1">
              Read More <span>&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script src="./ServicesSection.js"></script>
<style scoped src="./ServicesSection.css"></style>
