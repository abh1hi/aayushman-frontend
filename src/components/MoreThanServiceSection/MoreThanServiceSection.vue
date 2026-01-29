<template>
  <section class="mts-section min-h-[80vh] flex items-center py-20 relative overflow-hidden" style="background-image: url('/morethanservice.webp');">
    
    <div class="container mx-auto px-4 relative z-10 flex justify-end">
      
      <!-- Right Content Area (50% width on Desktop) -->
      <div class="w-full md:w-1/2 space-y-8 pl-0 md:pl-12">
        
        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-gray-200 tracking-[0.2em] uppercase mb-4">
            More Than a Service Provider
          </h2>
          <p class="text-gray-400 leading-relaxed text-sm md:text-base">
            ALSA is a Trusted Life Support Ambulance Provider in Delhi NCR, offering rapid response emergency medical transport and critical care solutions since 2008.
          </p>
        </div>

        <!-- Feature Cards -->
        <div class="space-y-4">
          
          <!-- Card 1 -->
          <div class="mts-card p-4 md:p-6 rounded-2xl flex items-start gap-4">
             <div class="bg-transparent p-2">
                <!-- Network Icon SVG -->
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
             </div>
             <div>
               <h3 class="text-white font-bold text-lg mb-1">Pan-India Medical Response network</h3>
               <p class="text-gray-400 text-sm">
                 Emergency and planned medical response across cities, highways, and intercity routes.
               </p>
             </div>
          </div>

          <!-- Card 2 -->
          <div class="mts-card p-4 md:p-6 rounded-2xl flex items-start gap-4">
             <div class="bg-transparent p-2">
                <!-- Shield Icon SVG -->
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="M9 12l2 2 4-4"></path>
                </svg>
             </div>
             <div>
               <h3 class="text-white font-bold text-lg mb-1">End to End Emergency & Care Solutions</h3>
               <p class="text-gray-400 text-sm">
                 Emergency response, critical transfers, hospital coordination, and home care services.
               </p>
             </div>
          </div>

        </div>

        <!-- Certifications -->
        <div class="flex items-center gap-6 pt-4 opacity-80">
           <!-- ISO Mockup -->
           <div class="text-blue-400 font-bold border-2 border-blue-400 rounded-full w-12 h-12 flex items-center justify-center text-[10px] text-center leading-tight">ISO<br>9001</div>
           <!-- Other badges mockup -->
           <div class="w-10 h-10 rounded-full border border-green-500 flex items-center justify-center text-green-500 text-[8px]">PCMS</div>
           <div class="w-12 h-8 border border-blue-600 flex items-center justify-center text-blue-600 text-[8px]">JAS-ANZ</div>
        </div>

      </div>
    </div>
  </section>
</template>

<script src="./MoreThanServiceSection.js"></script>
<style scoped src="./MoreThanServiceSection.css"></style>
