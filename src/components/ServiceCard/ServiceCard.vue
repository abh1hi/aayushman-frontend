<template>
  <div class="service-card w-full group transition-all duration-300 rounded-3xl overflow-hidden relative h-[420px] shadow-xl hover:shadow-2xl">
    <!-- Background Image (SEO Optimized) -->
    <img :src="image" 
         :alt="alt || (title + ' - Ayushmaan Life Support Ambulance')"
         class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

    <!-- Dark Overlay for better text readability -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

    <!-- Content Overlay (Top Positioned) -->
    <div class="absolute inset-0 p-6 md:p-8 flex flex-col justify-start text-left">
       <h3 class="text-2xl md:text-3xl font-bold text-white uppercase mb-3 tracking-wide leading-tight">
         {{ title }}
       </h3>
       <p class="text-sm md:text-base text-gray-200 leading-relaxed max-w-md">
         {{ description }}
       </p>
    </div>
  </div>
</template>

<script src="./ServiceCard.js"></script>
<style scoped src="./ServiceCard.css"></style>
