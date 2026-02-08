<template>
  <section class="hero-section relative min-h-screen flex items-center justify-center overflow-hidden text-white pt-24 pb-12">
    <!-- Background overlay/effects -->
    <div class="absolute inset-0 z-0 opacity-40 bg-cover bg-center animate-scale-in" style="background-image: url('/Hero_page_gif.webp');"></div>

    <div class="container mx-auto px-4 z-10 grid md:grid-cols-2 gap-12 items-center">
      
      <!-- Left Content -->
      <div class="space-y-6 text-center md:text-left pt-12 md:pt-0">
        <h1 class="text-4xl md:text-6xl font-black tracking-widest leading-tight text-white/90 animate-slide-up">
          RACING TIME. <br/>
          <span class="text-white">DELIVERING CARE.</span>
        </h1>
      </div>

      <!-- Right Form: Get Quick Ambulance Cost -->
      <div class="glass-card p-6 md:p-8 rounded-[2rem] w-full max-w-md mx-auto relative animate-fade-in-up">
        <!-- 24/7 Badge -->
        <div class="absolute -top-4 left-8 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
           <span class="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
           24/7 Available
        </div>

        <h3 class="text-xl md:text-2xl font-black mb-6 uppercase tracking-wide leading-tight mt-2">
          Get Quick Ambulance <br/>
          <span class="text-gray-300">Cost Instantly...</span>
        </h3>
        
        <form @submit.prevent="handleEstimate" class="space-y-4">
          
          <!-- Pickup -->
          <div class="input-pill flex items-center px-4 py-3 rounded-full">
            <input v-model="pickup" type="text" placeholder="Enter Pickup Address or area" 
              class="input-field w-full outline-none text-sm placeholder-gray-400 bg-transparent py-1" />
            <span class="text-green-500 cursor-pointer">➔</span>
          </div>
          
          <!-- Destination -->
          <div class="input-pill flex items-center px-4 py-3 rounded-full">
            <input v-model="destination" type="text" placeholder="Enter Destination" 
              class="input-field w-full outline-none text-sm placeholder-gray-400 bg-transparent py-1" />
            <span class="text-green-500 cursor-pointer">➔</span>
          </div>

          <!-- Mobile Number -->
          <div class="input-pill flex items-center px-4 py-3 rounded-full">
            <input v-model="mobileNumber" type="tel" placeholder="Enter Mobile Number" 
              class="input-field w-full outline-none text-sm placeholder-gray-400 bg-transparent py-1" />
            <span class="text-green-500">📞</span>
          </div>

          <!-- Ambulance Type -->
          <div class="input-pill px-4 py-3 rounded-full">
             <select v-model="ambulanceType" class="input-field w-full outline-none text-sm bg-transparent custom-select cursor-pointer text-gray-300">
                <option value="" disabled selected>Ambulance Type</option>
                <option v-for="type in ambulanceTypes" :key="type" :value="type" class="text-black">{{ type }}</option>
             </select>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-3 pt-2">
            <button type="submit" :disabled="loading"
              class="flex-1 btn-green text-white font-bold py-3 pr-6 pl-2 rounded-full shadow-lg transition flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed border border-green-600/50">
              <div class="w-10 h-10 rounded-full bg-[#1a3125] flex items-center justify-center shrink-0">
                <img src="/info_section_icon_png/Arrow-1.svg" alt="Arrow" class="w-5 h-5 object-contain" />
              </div>
              <span class="whitespace-nowrap">{{ loading ? 'Sending...' : 'See Estimated Fare' }}</span>
            </button>
            
            <button type="button" @click="handleReset"
              class="px-6 py-3 rounded-full border border-gray-600 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 font-semibold transition flex items-center gap-2">
              Reset <span class="text-green-500 text-lg">↻</span>
            </button>
          </div>

          <!-- Note -->
          <p class="text-[10px] text-gray-400 leading-relaxed mt-2">
            <strong class="text-gray-300">Note:</strong> This is an estimated fare as per your requirements. For exact pricing, Call us at <a href="tel:8802020245" class="text-blue-400 hover:underline">88 02 02 02 45</a>.
          </p>

          <!-- Call Us Button -->
          <div class="pt-2">
             <button type="button" @click="handleCall" class="bg-[#C81E1E] hover:bg-[#A01818] text-white font-bold px-10 py-3 rounded-full shadow-lg transition-transform hover:-translate-y-1">
               Call Us
             </button>
          </div>

        </form>
      </div>

    </div>
  </section>
</template>

<script src="./HeroSection.js"></script>
<style scoped src="./HeroSection.css"></style>
