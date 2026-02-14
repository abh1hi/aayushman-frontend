<template>
  <section class="five-g-section h-[500px] md:h-[600px] relative flex items-center overflow-hidden">
    
    <!-- Darkening Overlay -->
    <div class="five-g-overlay absolute inset-0 z-0"></div>

    <div class="container mx-auto px-4 relative z-10 h-full flex items-center">
      <div class="max-w-xl">
        <h2 class="font-bold text-white mb-6 uppercase leading-tight tracking-wide" style="font-size: 28px;">
          Powering Emergency <br/> Response With <br/> <span class="text-white">5G Connectivity</span>
        </h2>
        <p class="text-gray-300 text-base md:text-lg mb-10 leading-relaxed max-w-lg">
          Seamless real time connectivity enabling faster coordination and uninterrupted emergency care on the move.
        </p>
        <button class="bg-[#4b8445] hover:brightness-110 text-white font-bold h-[48px] rounded-full shadow-lg transition flex items-center justify-between px-2 group min-w-[200px] border border-green-600/50">
           <div class="w-8 h-8 rounded-full bg-[#1a3125] flex items-center justify-center group-hover:bg-[#254233] transition-colors">
              <!-- Diagonal Arrow Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" transform="rotate(-45 12 12)" /></svg>
           </div>
           <span class="text-sm flex-1 text-center pr-2">Book Now</span>
        </button>
      </div>
    </div>

  </section>
</template>

<script src="./FiveGSection.js"></script>
<style scoped src="./FiveGSection.css"></style>
