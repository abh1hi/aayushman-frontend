<template>
  <section class="air-ambulance-section relative min-h-[280px] md:min-h-[700px] flex items-center justify-start overflow-hidden">
    
    <!-- Background Image -->
    <div class="absolute inset-0 z-0 bg-black">
      <img src="/media/section-other/air-ambulance-hero-section.jpg" alt="Air Ambulance Service" class="w-full h-full object-contain md:object-cover" />
      <!-- Dark Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 md:px-8 relative z-10 py-8 md:py-24">
      <div class="max-w-3xl">
        
        <!-- Title -->
        <h2 class="font-black text-white mb-4 md:mb-6 leading-tight uppercase tracking-wide text-[22px] md:text-[28px]">
          INDIA'S MOST TRUSTED<br />AIR AMBULANCE NETWORK
        </h2>

        <!-- Subtitle -->
        <p class="text-gray-200 text-base md:text-xl lg:text-2xl mb-6 md:mb-10 leading-relaxed">
          Advanced critical care. Nationwide reach.<br />24×7 readiness.
        </p>

        <!-- CTA Button -->
        <a href="tel:+918802020245" class="bg-[#4b8445] hover:brightness-110 text-white font-bold h-[48px] md:h-[64px] rounded-full shadow-lg transition flex items-center justify-between px-3 group w-fit min-w-[220px] border border-green-600/50">
          <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1a3125] flex items-center justify-center group-hover:bg-[#254233] transition-colors">
            <!-- Diagonal Arrow Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" transform="rotate(-45 12 12)" /></svg>
          </div>
          <span class="text-base md:text-lg flex-1 text-center pr-3 font-bold">Know More</span>
        </a>

      </div>
    </div>

  </section>
</template>

<style scoped src="./AirAmbulanceSection.css"></style>
