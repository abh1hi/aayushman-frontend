<template>
  <section class="about-section py-20 text-white">
    <div class="container mx-auto px-4 z-10 relative">
      
      <!-- Main Grid -->
      <div class="grid md:grid-cols-2 gap-12 items-center mb-16">
        
        <!-- Text Content -->
        <div class="space-y-6">
          <div class="inline-block px-3 py-1 bg-red-900/30 border border-red-800 rounded-full text-red-500 text-xs font-bold uppercase tracking-wider">
            Who We Are
          </div>
          <h2 class="text-3xl md:text-5xl font-bold leading-tight">
            Saving Lives with <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Speed & Compassion</span>
          </h2>
          <p class="text-gray-400 text-lg leading-relaxed">
            Ayushmaan Life Support Ambulance is India's most trusted emergency response network. 
            We combine state-of-the-art medical technology with a compassionate human touch to ensure 
            every patient receives the best possible care during critical moments.
          </p>
          
          <ul class="space-y-3 text-gray-300">
             <li class="flex items-center gap-3">
               <span class="w-5 h-5 rounded-full bg-green-900/50 flex items-center justify-center text-green-500 text-xs">✓</span>
               GPS-Enabled Tracking
             </li>
             <li class="flex items-center gap-3">
               <span class="w-5 h-5 rounded-full bg-green-900/50 flex items-center justify-center text-green-500 text-xs">✓</span>
               Highly Trained Paramedics
             </li>
             <li class="flex items-center gap-3">
               <span class="w-5 h-5 rounded-full bg-green-900/50 flex items-center justify-center text-green-500 text-xs">✓</span>
               Affordable & Transparent Pricing
             </li>
          </ul>
        </div>

        <!-- Image Grid / Visual -->
        <div class="relative">
           <!-- Placeholder for an image collage or single robust image -->
           <div class="aspect-video bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl relative group">
              <div class="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent z-10"></div>
              <!-- Using a reliable placeholder or just a div representation -->
              <div class="w-full h-full bg-[url('https://images.unsplash.com/photo-1587745416684-47953f16f02f?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition duration-700 group-hover:scale-105"></div>
              
              <div class="absolute bottom-6 left-6 z-20">
                 <p class="text-3xl font-bold text-white">24/7</p>
                 <p class="text-sm text-gray-300">Emergency Support</p>
              </div>
           </div>
        </div>

      </div>

      <!-- Stats Row (Restored from Hero) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="(stat, index) in stats" :key="index" 
             class="stat-card bg-gray-800/50 backdrop-blur border border-gray-700 p-6 rounded-xl text-center">
           <div class="text-3xl mb-2">{{ stat.icon }}</div>
           <div class="text-2xl md:text-3xl font-bold text-white mb-1">{{ stat.value }}</div>
           <div class="text-xs text-gray-400 uppercase tracking-wide">{{ stat.label }}</div>
        </div>
      </div>

    </div>
  </section>
</template>

<script src="./AboutSection.js"></script>
<style scoped src="./AboutSection.css"></style>
