<template>
  <div class="service-card w-full group hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden relative h-[400px]">
    <!-- Background Image -->
    <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
         :style="{ backgroundImage: `url(${image})` }">
    </div>

    <!-- Content Overlay (Top Gradient) -->
    <div class="card-overlay absolute inset-0 p-8 flex flex-col items-start justify-end text-left pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent group-hover:-translate-y-2 transition-transform duration-300">
       <h3 class="card-title text-xl md:text-2xl font-bold text-white uppercase mb-3 border-b-2 border-transparent group-hover:border-red-500 pb-1 transition-colors">
         {{ title }}
       </h3>
       <p class="card-desc text-sm text-gray-300 leading-relaxed max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-4 group-hover:translate-y-0">
         {{ description }}
       </p>
    </div>
  </div>
</template>

<script src="./ServiceCard.js"></script>
<style scoped src="./ServiceCard.css"></style>
