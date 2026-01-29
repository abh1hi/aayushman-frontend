<template>
  <section class="alsa-network-section flex flex-col items-center justify-start py-20 relative">
    <canvas ref="canvasRef"></canvas>
    
    <div class="container mx-auto px-4 z-10 text-center pointer-events-none">
       <span class="live-badge text-red-500 font-mono text-sm tracking-widest border border-red-900 bg-red-900/20 px-3 py-1 rounded mb-4 inline-block">
          ● LIVE NETWORK STATUS
       </span>
       
       <h2 class="text-3xl md:text-5xl font-bold uppercase tracking-widest mb-4">
         ALSA Service Network
       </h2>
       
       <p class="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
         A <span class="text-white bg-red-700 px-2 font-bold">nationwide emergency response</span> network 
         designed for speed, coverage, and clinical reliability.
       </p>
    </div>

    <!-- Decorative HUD elements (Corners) -->
    <div class="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-red-800 opacity-50"></div>
    <div class="absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-red-800 opacity-50"></div>
    
  </section>
</template>

<script src="./AlsaNetworkSection.js"></script>
<style scoped src="./AlsaNetworkSection.css"></style>
