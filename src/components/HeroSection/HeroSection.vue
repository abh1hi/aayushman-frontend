<template>
  <section class="hero-section relative w-full overflow-hidden text-white">
    
    <!-- ========================================== -->
    <!--          MOBILE VIEW (md:hidden)           -->
    <!-- ========================================== -->
    <div class="md:hidden relative min-h-screen flex flex-col pt-24 pb-8 bg-[#0B1215]">
      <!-- Mobile Background: Dark Map Theme -->
      <!-- Using a dark gradient/map placeholder for now. 
           In a real scenario, this would be a map image. -->
      <div class="absolute inset-0 z-0 opacity-30 bg-cover bg-center" 
           style="background-image: url('/media/hero-page-background-image-2.jpg'); filter: grayscale(100%) contrast(1.2) brightness(0.5);">
      </div>
      
      <!-- Content Container -->
      <div class="container mx-auto px-4 z-10 flex-1 flex flex-col justify-center items-center gap-6">
        
        <!-- 24/7 Badge (Mobile Position - Centered or Top) -->
        <div class="flex items-center gap-2 mb-2">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span class="text-gray-200 text-sm font-bold tracking-wide">24/7 Available</span>
        </div>

        <!-- Form Card (Mobile) -->
        <div class="bg-[#1A2320] border border-white/10 p-5 rounded-[2rem] w-full max-w-[340px] shadow-2xl backdrop-blur-md relative overflow-hidden animate-fade-in-up">
            <!-- Green glow effect -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <h3 class="text-xl font-black mb-6 uppercase tracking-wide leading-tight text-white">
              Get Quick Ambulance <br/>
              <span class="text-white">Cost Instantly...</span>
            </h3>

            <form @submit.prevent="handleEstimate" class="space-y-4">
              <!-- Pickup -->
              <div class="bg-white/5 border border-white/10 flex items-center px-4 h-[50px] rounded-full focus-within:border-green-500/50 transition-colors">
                <input v-model="pickup" type="text" placeholder="Enter Pickup Address or area" 
                  class="w-full outline-none text-xs placeholder-gray-500 bg-transparent text-gray-200" />
                <span class="text-green-500 ml-2">
                   <!-- Location Icon -->
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </span>
              </div>

              <!-- Destination -->
              <div class="bg-white/5 border border-white/10 flex items-center px-4 h-[50px] rounded-full focus-within:border-green-500/50 transition-colors">
                <input v-model="destination" type="text" placeholder="Enter Destination" 
                  class="w-full outline-none text-xs placeholder-gray-500 bg-transparent text-gray-200" />
                <span class="text-green-500 ml-2">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </span>
              </div>

               <!-- Mobile Number -->
              <div class="bg-white/5 border border-white/10 flex items-center px-4 h-[50px] rounded-full focus-within:border-green-500/50 transition-colors">
                <input v-model="mobileNumber" type="tel" placeholder="Enter Mobile Number" 
                  class="w-full outline-none text-xs placeholder-gray-500 bg-transparent text-gray-200" />
                <span class="text-green-500 ml-2">
                   <!-- Phone Icon -->
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                   </svg>
                </span>
              </div>

               <!-- Ambulance Type -->
              <div class="bg-white/5 border border-white/10 px-4 h-[50px] flex items-center rounded-full relative">
                <select v-model="ambulanceType" class="w-full outline-none text-xs bg-transparent border-none text-gray-400 appearance-none cursor-pointer">
                    <option value="" disabled selected>Ambulance Type</option>
                    <option v-for="type in ambulanceTypes" :key="type" :value="type" class="text-black">{{ type }}</option>
                </select>
                <div class="pointer-events-none absolute right-4 flex items-center text-gray-500">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>

              <!-- Buttons Row -->
              <div class="flex gap-3 pt-2">
                <button type="submit" :disabled="loading"
                  class="flex-1 bg-[#4b8445] hover:brightness-110 text-white font-bold h-[48px] rounded-full shadow-lg transition flex items-center gap-2 px-2 disabled:opacity-70 group border border-green-600/50">
                  <div class="w-8 h-8 rounded-full bg-[#1a3125] flex items-center justify-center shrink-0">
                    <img src="/info_section_icon_png/Arrow-1.svg" alt="Arrow" class="w-4 h-4 object-contain" />
                  </div>
                  <span class="text-sm flex-1 text-center whitespace-nowrap">See Estimated Fare</span>
                </button>
                
                <button type="button" @click="handleReset"
                  class="w-[90px] h-[48px] rounded-full border border-gray-600 bg-transparent hover:bg-white/5 text-gray-300 font-semibold transition flex items-center justify-center gap-2">
                  <span class="text-xs">Reset</span> 
                  <span class="text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </span>
                </button>
              </div>

               <!-- Note -->
              <p class="text-[10px] text-center text-gray-500 mt-3 leading-tight px-1">
                <span class="text-gray-400 font-bold">Note:</span> This is an estimated fare as per your requirements. For exact pricing, Call us at <a href="tel:8802020245" class="text-blue-400">88 02 02 02 45</a>.
              </p>

               <!-- Call Us Button -->
              <button type="button" @click="handleCall" 
                class="w-full bg-[#C81E1E] hover:bg-[#A01818] text-white font-bold h-[48px] rounded-full shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center mt-2 text-sm">
                 Call Us
              </button>
            </form>
        </div>
        
        <!-- Bottom Text (Mobile) -->
        <div class="text-center mt-auto pb-4 pt-4">
             <h1 class="text-xl font-black tracking-[0.2em] leading-tight text-white/50">
              RACING TIME.<br/>
              <span class="text-white">DELIVERING CARE.</span>
            </h1>
        </div>

      </div>
    </div>


    <!-- ========================================== -->
    <!--          DESKTOP VIEW (hidden md:block)    -->
    <!-- ========================================== -->
    <div class="hidden md:flex relative min-h-screen items-center justify-center pt-24 pb-12">
        <!-- Background overlay/effects -->
        <div class="absolute inset-0 z-0 opacity-40 bg-cover bg-center animate-scale-in" style="background-image: url('/media/hero-page-background-image-2.jpg');"></div>
    
        <div class="container mx-auto px-4 z-10 grid md:grid-cols-2 gap-12 items-center">
          
          <!-- Left Content -->
          <div class="space-y-6 text-center md:text-left pt-12 md:pt-0">
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-black tracking-widest leading-tight text-white/90 animate-slide-up pl-8 md:pl-12">
              RACING TIME. <br/>
              <span class="text-white">DELIVERING CARE.</span>
            </h1>
          </div>
    
          <!-- Right Form: Get Quick Ambulance Cost -->
          <div class="glass-card p-5 md:p-6 rounded-[2rem] w-full max-w-[360px] mx-auto relative animate-fade-in-up">
            <!-- 24/7 Badge -->
            <div class="absolute -top-4 left-8 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
               <span class="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
               24/7 Available
            </div>
    
            <h3 class="text-xl md:text-2xl font-black mb-5 uppercase tracking-wide leading-tight mt-2">
              Get Quick Ambulance <br/>
              <span class="text-gray-300">Cost Instantly...</span>
            </h3>
            
            <form @submit.prevent="handleEstimate" class="space-y-3">
              
              <!-- Pickup -->
              <div class="input-pill flex items-center px-4 h-[48px] rounded-full">
                <input v-model="pickup" type="text" placeholder="Enter Pickup Address or area" 
                  class="input-field w-full outline-none text-xs placeholder-gray-400 bg-transparent py-1" />
                <span class="text-green-500 cursor-pointer">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </span>
              </div>
              
              <!-- Destination -->
              <div class="input-pill flex items-center px-4 h-[48px] rounded-full">
                <input v-model="destination" type="text" placeholder="Enter Destination" 
                  class="input-field w-full outline-none text-xs placeholder-gray-400 bg-transparent py-1" />
                <span class="text-green-500 cursor-pointer">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </span>
              </div>
    
              <!-- Mobile Number -->
              <div class="input-pill flex items-center px-4 h-[48px] rounded-full">
                <input v-model="mobileNumber" type="tel" placeholder="Enter Mobile Number" 
                  class="input-field w-full outline-none text-xs placeholder-gray-400 bg-transparent py-1" />
                <span class="text-green-500">
                   <!-- Phone Icon -->
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                   </svg>
                </span>
              </div>
    
              <!-- Ambulance Type -->
              <div class="input-pill px-4 h-[48px] flex items-center rounded-full">
                 <select v-model="ambulanceType" class="input-field w-full outline-none text-xs bg-transparent custom-select cursor-pointer text-gray-300">
                    <option value="" disabled selected>Ambulance Type</option>
                    <option v-for="type in ambulanceTypes" :key="type" :value="type" class="text-black">{{ type }}</option>
                 </select>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex gap-2 pt-2">
                <button type="submit" :disabled="loading"
                  class="w-[65%] btn-green text-white font-bold h-[48px] pr-2 pl-2 rounded-full shadow-lg transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-green-600/50">
                  <div class="w-8 h-8 rounded-full bg-[#1a3125] flex items-center justify-center shrink-0">
                    <img src="/info_section_icon_png/Arrow-1.svg" alt="Arrow" class="w-4 h-4 object-contain" />
                  </div>
                  <span class="whitespace-nowrap text-sm flex-1 text-center">See Estimated Fare</span>
                </button>
                
                <button type="button" @click="handleReset"
                  class="flex-1 h-[48px] rounded-full border border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 font-semibold transition flex items-center justify-center gap-2 px-2">
                  <span class="text-sm">Reset</span>
                  <span class="text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </span>
                </button>
              </div>
    
              <!-- Note -->
              <p class="text-[12px] text-gray-400 leading-relaxed mt-1">
                <strong class="text-gray-300">Note:</strong> This is an estimated fare as per your requirements. For exact pricing, Call us at <a href="tel:8802020245" class="text-blue-400 hover:underline">88 02 02 02 45</a>.
              </p>
    
              <!-- Call Us Button -->
              <div class="pt-1 flex justify-start">
                 <button type="button" @click="handleCall" class="bg-[#C81E1E] hover:bg-[#A01818] text-white font-bold px-6 h-[48px] rounded-full shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center text-sm">
                   Call Us
                 </button>
              </div>
    
            </form>
          </div>
        </div>
    </div>
  </section>
</template>

<script src="./HeroSection.js"></script>
<style scoped src="./HeroSection.css"></style>
