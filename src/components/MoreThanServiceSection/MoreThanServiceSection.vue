<template>
  <div ref="sectionRef" class="w-full">
    
    <!-- ========================================== -->
    <!--          MOBILE VIEW (md:hidden)           -->
    <!-- ========================================== -->
    <div class="md:hidden w-full grid grid-cols-1 place-items-start relative">
         <img src="/media/mobile-mode-second-section.jpeg" class="col-start-1 row-start-1 w-full h-full object-cover min-h-[100%]" alt="Background" />
         
         <!-- Gradient Overlay -->
         <div class="col-start-1 row-start-1 w-full h-full z-0 pointer-events-none bg-gradient-to-t from-[#021000] to-transparent"></div>
         
         <div class="col-start-1 row-start-1 w-full z-10 flex flex-col pt-20 pb-12 px-8">
             <div class="relative z-10 flex flex-col h-full mt-[80%]">
            
            <!-- Top Content: Certifications, Title & Description -->
            <div class="space-y-4">
               
               <!-- Certifications at Top -->
               <div class="flex items-center gap-3">
                  <img src="/info_section_icon_png/phone-logo.png" alt="Ayushmaan Life Support Ambulance 24/7 Helpline Icon" class="h-8 w-auto object-contain" />
               </div>

               <!-- Title -->
               <h2 class="text-lg font-black text-white uppercase leading-tight">
                 MORE THAN A <br/>
                 SERVICE PROVIDER
               </h2>
               
               <!-- Description -->
               <p class="text-gray-300 text-xs leading-relaxed max-w-sm">
                 ALSA is a Delhi NCR based private EMS provider offering medical transport, emergency response, and critical care solutions, since 2008.
               </p>

            </div>

            <!-- Cards Section -->
            <div class="space-y-3 mt-8">
               
               <!-- Card 1 -->
               <div class="bg-black/50 backdrop-blur-sm border border-white/10 p-4 rounded-2xl flex items-start gap-4">
                  <div class="bg-red-500/10 p-2 rounded-full shrink-0">
                     <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                       <circle cx="12" cy="12" r="10"></circle>
                       <line x1="2" y1="12" x2="22" y2="12"></line>
                       <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                     </svg>
                  </div>
                  <div>
                     <h3 class="text-white font-bold text-sm leading-tight mb-1 font-sans">Pan-India medical response network</h3>
                     <p class="text-gray-400 text-[10px] leading-snug">
                       Emergency and planned medical response across cities, highways, and intercity routes.
                     </p>
                  </div>
               </div>

               <!-- Card 2 -->
               <div class="bg-black/50 backdrop-blur-sm border border-white/10 p-4 rounded-2xl flex items-start gap-4">
                  <div class="bg-red-500/10 p-2 rounded-full shrink-0">
                     <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                       <path d="M9 12l2 2 4-4"></path>
                     </svg>
                  </div>
                  <div>
                     <h3 class="text-white font-bold text-sm leading-tight mb-1 font-sans">End to end emergency & care solutions</h3>
                     <p class="text-gray-400 text-[10px] leading-snug">
                       Emergency response, critical transfers, hospital coordination, and home care services.
                     </p>
                  </div>
               </div>

            </div>
         </div>
    </div>
    </div>


    <!-- ========================================== -->
    <!--          DESKTOP VIEW (hidden md:flex)     -->
    <!-- ========================================== -->
    <section class="hidden md:flex mts-section min-h-[80vh] items-center py-20 relative overflow-hidden text-left" style="background-image: url('/media/Aboutus.jpg');">
        
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
                   <h3 class="text-white font-bold text-lg mb-1 font-sans">Pan-India medical response network</h3>
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
                   <h3 class="text-white font-bold text-lg mb-1 font-sans">End to end emergency & care solutions</h3>
                   <p class="text-gray-400 text-sm">
                     Emergency response, critical transfers, hospital coordination, and home care services.
                   </p>
                 </div>
              </div>
    
            </div>
    
            <!-- Certifications -->
            <div class="flex items-center gap-6 pt-4 opacity-80">
               <img src="/info_section_icon_png/desktop-logo.png" alt="Ayushmaan Life Support Ambulance Accredited Service Provider Logo" class="h-16 w-auto object-contain" />
            </div>
    
          </div>
        </div>
    </section>

  </div>
</template>

<script src="./MoreThanServiceSection.js"></script>
<style scoped src="./MoreThanServiceSection.css"></style>
