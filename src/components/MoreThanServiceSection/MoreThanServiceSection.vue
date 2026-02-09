<template>
  <div ref="sectionRef" class="w-full">
    
    <!-- ========================================== -->
    <!--          MOBILE VIEW (md:hidden)           -->
    <!-- ========================================== -->
    <div class="md:hidden relative min-h-screen w-full flex flex-col justify-between pt-20 pb-8 px-6 bg-cover bg-center overflow-hidden"
         style="background-image: url('/about-section/second-section.jpeg');">
         
         <!-- Dark Overlay for Readability -->
         <div class="absolute inset-0 bg-black/70 z-0"></div>

         <!-- Top Content: Branding & Title -->
         <div class="relative z-10 text-center space-y-4 mt-4">
            <!-- Icon/Logo Placeholder -->
            <div class="flex justify-center mb-4">
                <img src="/ALSA_LOGO.svg" alt="Ayushman Logo" class="h-16 w-auto opacity-100 drop-shadow-md" />
            </div>
            
            <!-- Title -->
            <h2 class="text-2xl font-black text-white tracking-widest uppercase leading-tight drop-shadow-lg">
              MORE THAN A <br/>
              <span class="text-red-500">SERVICE PROVIDER</span>
            </h2>
            
            <!-- Description -->
            <p class="text-gray-300 text-xs px-2 leading-relaxed max-w-xs mx-auto drop-shadow-md font-medium">
              ALSA is a Delhi NCR based private EMS provider offering medical transport, emergency response, and critical care solutions, since 2008.
            </p>

             <!-- Certifications -->
            <div class="flex justify-center gap-4 mt-6 opacity-90">
                 <!-- Using existing assets if available or placeholders -->
                 <!-- These paths are checking against what was in the desktop view -->
               <img src="/info_section_icon_png/196a9f63abb30df5665582bde48905320514a824.png" alt="Certification 1" class="h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
               <img src="/info_section_icon_png/b719259431920ab9c9ed371105c7e8a0f7ed4845.png" alt="Certification 2" class="h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
            </div>
         </div>

         <!-- Bottom Content: Cards -->
         <div class="relative z-10 space-y-3 mt-auto w-full max-w-[360px] mx-auto">
            
            <!-- Card 1 -->
            <div class="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
               <div class="bg-white/5 p-2 rounded-full shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
               </div>
               <div>
                  <h3 class="text-white font-bold text-sm leading-tight mb-1">Pan-India Medical Response network</h3>
                  <p class="text-gray-400 text-[10px] leading-snug">
                    Emergency and planned medical response across cities, highways, and intercity routes.
                  </p>
               </div>
            </div>

            <!-- Card 2 -->
             <div class="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
               <div class="bg-white/5 p-2 rounded-full shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="M9 12l2 2 4-4"></path>
                  </svg>
               </div>
               <div>
                  <h3 class="text-white font-bold text-sm leading-tight mb-1">End to End Emergency & Care Solutions</h3>
                  <p class="text-gray-400 text-[10px] leading-snug">
                    Emergency response, critical transfers, hospital coordination, and home care services.
                  </p>
               </div>
            </div>

         </div>
    </div>


    <!-- ========================================== -->
    <!--          DESKTOP VIEW (hidden md:flex)     -->
    <!-- ========================================== -->
    <section class="hidden md:flex mts-section min-h-[80vh] items-center py-20 relative overflow-hidden text-left" style="background-image: url('/about-section/second-section.jpeg');">
        
        <div class="container mx-auto px-4 relative z-10 flex justify-end">
          
          <!-- Right Content Area (50% width on Desktop) -->
          <div class="w-full md:w-1/2 space-y-8 pl-0 md:pl-12" :class="{ 'animate-slide-up': isVisible }">
            
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
               <img src="/info_section_icon_png/196a9f63abb30df5665582bde48905320514a824.png" alt="Certification 1" class="h-16 w-auto object-contain" />
               <!-- Other badges mockup -->
               <img src="/info_section_icon_png/b719259431920ab9c9ed371105c7e8a0f7ed4845.png" alt="Certification 2" class="h-16 w-auto object-contain" />
            </div>
    
          </div>
        </div>
    </section>

  </div>
</template>

<script src="./MoreThanServiceSection.js"></script>
<style scoped src="./MoreThanServiceSection.css"></style>
