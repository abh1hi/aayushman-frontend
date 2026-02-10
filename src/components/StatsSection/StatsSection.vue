<template>
  <section ref="sectionRef" class="stats-section py-24 min-h-[800px] flex items-center relative">
    
    <div class="container mx-auto px-4 relative">
      
      <!-- ========================================== -->
      <!--             MOBILE VIEW (md:hidden)      -->
      <!-- ========================================== -->
      <div class="md:hidden flex flex-col items-center pt-8 pb-16">
          
          <!-- Top Stats: Patients Supported -->
          <div class="text-center mb-12">
              <p class="text-gray-300 text-sm mb-4">
                  <span class="font-bold text-white">5,00,000+</span> patients supported in critical moments
              </p>
              <div class="flex justify-center -space-x-3">
                 <img src="https://placehold.co/40x40/333/FFF?text=U1" class="w-10 h-10 rounded-full border-2 border-black" />
                 <img src="https://placehold.co/40x40/444/FFF?text=U2" class="w-10 h-10 rounded-full border-2 border-black" />
                 <img src="https://placehold.co/40x40/555/FFF?text=U3" class="w-10 h-10 rounded-full border-2 border-black" />
              </div>
          </div>

          <!-- Timeline Container (FIXED HEIGHT 500px) -->
          <div class="relative w-full h-[500px] flex">
              
              <!-- Left Column: Dates -->
              <div class="w-1/3 flex flex-col justify-between py-8 text-right pr-6 text-gray-400 text-sm font-mono">
                  <div v-for="(m, i) in milestones" :key="i" class="h-8 flex items-center justify-end">
                      {{ m.date }}
                      <span class="w-2 h-[2px] bg-gray-600 ml-2"></span>
                  </div>
              </div>

              <!-- Center Line (SVG) -->
              <div class="absolute left-1/3 top-0 bottom-0 w-1 flex flex-col items-center overflow-visible">
                   <svg class="h-[500px] w-40 overflow-visible -ml-20" viewBox="0 0 100 500">
                      <!-- Base Track -->
                      <path :d="pathDataMobile" class="timeline-path" /> 
                      
                      <!-- Glow Overlay -->
                      <defs>
                        <linearGradient id="lineGradientMobile" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stop-color="#166534" />
                          <stop :offset="progress * 100 + '%'" stop-color="#4ade80" />
                          <stop offset="100%" stop-color="#166534" />
                        </linearGradient>
                      </defs>
                      
                      <path :d="pathDataMobile" stroke="url(#lineGradientMobile)" stroke-width="4" fill="none" filter="drop-shadow(0 0 5px rgba(74, 222, 128, 0.5))" />
                   </svg>
              </div>

              <!-- Center Icon (Positioned Absolute) -->
              <div class="absolute left-1/3 -translate-x-1/2 z-10"
                   :style="{ top: activeYMobile + 'px', transform: 'translate(-50%, -50%)' }">
                  <div class="w-16 h-16 rounded-full bg-[#1da352] border-4 border-black flex items-center justify-center shadow-[0_0_20px_rgba(74,222,128,0.5)]">
                      <span class="text-white text-3xl font-bold">↑</span>
                  </div>
              </div>

              <!-- Right Column: Content -->
              <div class="flex-1 pl-12 flex flex-col justify-center">
                  <p class="text-gray-400 text-xs mb-2">
                       A reflection of expanding access to emergency and medical services.
                  </p>
                  <h2 class="text-4xl font-bold text-white tracking-tighter">
                    {{ Math.floor(500000 * progress).toLocaleString() }}+
                  </h2>
                  <p class="text-gray-400 text-sm uppercase tracking-widest mt-1">Lives Saved</p>
              </div>

          </div>

      </div>

      <!-- ========================================== -->
      <!--          DESKTOP VIEW (hidden md:flex)   -->
      <!-- ========================================== -->
      <div class="hidden md:flex flex-row w-full">
      
        <!-- Left: Timeline Visualization (FIXED HEIGHT 600px) -->
        <div class="w-1/4 relative h-[600px] flex justify-end pr-12">
           <!-- Date Markers -->
           <div class="absolute right-20 top-0 h-full flex flex-col justify-between py-12 text-right opacity-50 text-base font-mono text-green-200">
              <div v-for="(m, i) in milestones" :key="i" 
                   :style="{ opacity: Math.abs(progress - (i/(milestones.length-1))) < 0.2 ? 1 : 0.3, transform: `scale(${Math.abs(progress - (i/(milestones.length-1))) < 0.2 ? 1.2 : 1})`, transition: 'all 0.3s' }">
                  {{ m.date }}
              </div>
           </div>

           <!-- The Line SVG -->
           <svg class="h-full w-40 overflow-visible" viewBox="0 0 100 600">
              <!-- Base Track -->
              <path :d="pathDataDesktop" class="timeline-path" /> 
              
              <!-- Glow Overlay -->
              <defs>
                <linearGradient id="lineGradientDesktop" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#166534" />
                  <stop :offset="progress * 100 + '%'" stop-color="#4ade80" />
                  <stop offset="100%" stop-color="#166534" />
                </linearGradient>
              </defs>
              
              <path :d="pathDataDesktop" stroke="url(#lineGradientDesktop)" stroke-width="4" fill="none" filter="drop-shadow(0 0 5px rgba(74, 222, 128, 0.5))" />
           </svg>

           <!-- The Active Knob -->
           <div class="absolute right-[28px] w-6 h-6 rounded-full bg-black border-2 border-green-400 z-10 icon-pulse"
                :style="{ top: activeYDesktop + 'px', transform: 'translate(50%, -50%)' }">
           </div>
        </div>

        <!-- Right: Main Content -->
        <div class="flex-1 pl-16 flex flex-col justify-center items-start text-left">
          
          <!-- Top Pill -->
          <div class="stat-pill self-start rounded-full px-6 py-2 flex items-center gap-4 mb-12">
             <div class="flex -space-x-3">
                <img src="https://placehold.co/40x40/333/FFF?text=U1" class="w-8 h-8 rounded-full border border-gray-700" />
                <img src="https://placehold.co/40x40/444/FFF?text=U2" class="w-8 h-8 rounded-full border border-gray-700" />
                <img src="https://placehold.co/40x40/555/FFF?text=U3" class="w-8 h-8 rounded-full border border-gray-700" />
             </div>

             <span class="text-sm text-gray-300">5,00,000+ patients supported in critical moments</span>
          </div>

          <!-- Main Stats Block -->
          <div class="relative">
             <p class="text-green-300/80 text-xl mb-4 max-w-lg">
               A reflection of expanding access to emergency and medical services.
             </p>
             
             <div class="flex items-center gap-8">
                <!-- Animated Icon -->
                <div class="w-20 h-20 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center shadow-2xl">
                   <span class="text-green-500 text-4xl font-bold animate-bounce">↑</span>
                </div>
                
                <!-- Giant Number -->
                <div class="animate-fade-in-up">
                   <h2 class="stat-number text-8xl font-bold text-white tracking-tighter">
                     {{ Math.floor(500000 * progress).toLocaleString() }}+
                   </h2>
                   <p class="text-gray-400 text-sm uppercase tracking-[0.2em] mt-2">Lives Saved</p>
                </div>
             </div>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>

<script src="./StatsSection.js"></script>
<style scoped src="./StatsSection.css"></style>
