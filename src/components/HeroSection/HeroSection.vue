<template>
  <section class="hero-section relative w-full overflow-hidden text-white">
    
    <!-- ========================================== -->
    <!--          MOBILE VIEW (md:hidden)           -->
    <!-- ========================================== -->
    <div class="md:hidden relative min-h-screen flex flex-col pt-24 pb-8 bg-[#0B1215]">
      <!-- Mobile Background -->
      <div class="absolute inset-0 z-0 opacity-30 bg-cover bg-center" 
           style="background-image: url('/media/hero-page-background-image-2.jpg');">
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
        <div class="bg-[#1A2320]/80 border border-white/10 p-6 rounded-[2rem] w-full max-w-[340px] shadow-2xl backdrop-blur-xl relative overflow-hidden animate-fade-in-up">
            <!-- Green glow effect (Liquid feel) -->
            <div class="absolute top-0 right-0 w-40 h-40 bg-green-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none mix-blend-screen"></div>

            <h3 class="text-xl font-bold mb-6 uppercase tracking-wider leading-tight text-white/90">
              Response Within <br/>
              <span class="text-white font-black">Seconds...</span>
            </h3>

            <form @submit.prevent="handleSubmit" class="space-y-5">
              <!-- Name Input -->
              <div class="bg-white/5 border border-white/10 flex items-center px-5 h-[56px] rounded-full focus-within:border-green-500/50 focus-within:bg-white/10 transition-all duration-300 group">
                <input v-model="name" type="text" placeholder="Name" 
                  class="w-full outline-none text-sm placeholder-gray-500 bg-transparent text-gray-100 group-hover:placeholder-gray-400 transition-colors" />
              </div>

               <!-- Contact Input -->
              <div class="bg-white/5 border border-white/10 flex items-center px-5 h-[56px] rounded-full focus-within:border-green-500/50 focus-within:bg-white/10 transition-all duration-300 group">
                <input v-model="mobileNumber" type="tel" placeholder="Contact Number" 
                  class="w-full outline-none text-sm placeholder-gray-500 bg-transparent text-gray-100 group-hover:placeholder-gray-400 transition-colors" />
              </div>

              <!-- Call Now Button -->
              <button type="submit" :disabled="loading"
                class="bg-[#4b8445] hover:brightness-110 text-white font-bold h-[48px] rounded-full shadow-lg transition flex items-center justify-between px-2 group min-w-[200px] border border-green-600/50 w-auto">
                <div class="w-8 h-8 rounded-full bg-[#1a3125] flex items-center justify-center shrink-0 group-hover:bg-[#234232] transition-colors">
                   <img src="/info_section_icon_png/Arrow-1.svg" alt="Arrow" class="w-4 h-4 object-contain group-hover:rotate-45 transition-transform duration-300" />
                </div>
                <span class="text-xl tracking-wide font-sans flex-1 text-center">Call Now</span>
              </button>

            </form>
            
             <!-- Bottom Text inside card for liquid feel integration -->
             <div class="mt-6 pt-4 border-t border-white/5 text-center">
                 <p class="text-[10px] text-gray-400/80 tracking-widest uppercase">Racing Time. Delivering Care.</p>
             </div>
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
    
          <!-- Right Form: Quick Request -->
          <div class="glass-card bg-[#1A2320]/60 p-8 rounded-[2.5rem] w-full max-w-[400px] mx-auto relative animate-fade-in-up backdrop-blur-xl border border-white/10 shadow-2xl">
            <!-- 24/7 Badge -->
            <div class="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#0B1215] border border-white/10 text-gray-200 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-xl z-20">
               <span class="relative flex h-2 w-2">
                 <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span class="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
               </span>
               24/7 Available
            </div>
             
            <!-- Liquid Glow -->
            <div class="absolute -top-10 -right-10 w-48 h-48 bg-green-500/20 rounded-full blur-3xl pointer-events-none mix-blend-screen opacity-60"></div>

            <h3 class="text-2xl font-bold mb-8 uppercase tracking-wider leading-tight text-white/90 text-center mt-2">
              Response Within <br/>
              <span class="text-white font-black">Seconds...</span>
            </h3>
            
            <form @submit.prevent="handleSubmit" class="space-y-5 px-2">
              
              <!-- Name -->
              <div class="group relative">
                <div class="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-white/5 rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                <div class="relative flex items-center px-5 h-[60px] bg-[#0B1215]/50 border border-white/10 rounded-full focus-within:border-green-500/50 focus-within:bg-[#0B1215]/80 transition-all duration-300">
                   <input v-model="name" type="text" placeholder="Name" 
                    class="w-full outline-none text-base placeholder-gray-500 bg-transparent text-gray-100 group-hover:placeholder-gray-400 transition-colors" />
                </div>
              </div>
              
              <!-- Contact -->
               <div class="group relative">
                <div class="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-white/5 rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                 <div class="relative flex items-center px-5 h-[60px] bg-[#0B1215]/50 border border-white/10 rounded-full focus-within:border-green-500/50 focus-within:bg-[#0B1215]/80 transition-all duration-300">
                    <input v-model="mobileNumber" type="tel" placeholder="Contact Number" 
                      class="w-full outline-none text-base placeholder-gray-500 bg-transparent text-gray-100 group-hover:placeholder-gray-400 transition-colors" />
                 </div>
               </div>

              <div class="pt-4">
                <button type="submit" :disabled="loading"
                  class="bg-[#4b8445] hover:brightness-110 text-white font-bold h-[48px] rounded-full shadow-lg transition flex items-center justify-between px-2 group min-w-[200px] border border-green-600/50 w-auto relative overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  
                  <div class="w-8 h-8 rounded-full bg-[#1a3125] flex items-center justify-center shrink-0 group-hover:bg-[#234232] transition-colors z-10">
                     <img src="/info_section_icon_png/Arrow-1.svg" alt="Arrow" class="w-4 h-4 object-contain group-hover:rotate-45 transition-transform duration-300" />
                  </div>
                  <span class="text-xl tracking-wide font-sans flex-1 text-center z-10">Call Now</span>
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
