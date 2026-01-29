<template>
  <div class="service-card w-full group">
    <!-- Background Image -->
    <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
         :style="{ backgroundImage: `url(${image})` }">
    </div>

    <!-- Content Overlay (Top Gradient) -->
    <div class="card-overlay absolute inset-0 p-8 flex flex-col items-start justify-start text-left pointer-events-none">
       <h3 class="card-title text-xl md:text-2xl font-bold text-white uppercase mb-3 border-b-2 border-transparent group-hover:border-red-500 pb-1 transition-colors">
         {{ title }}
       </h3>
       <p class="card-desc text-sm text-gray-300 leading-relaxed max-w-xs">
         {{ description }}
       </p>
    </div>
  </div>
</template>

<script src="./ServiceCard.js"></script>
<style scoped src="./ServiceCard.css"></style>
