<template>
  <div class="training-card w-full flex flex-col md:flex-row h-full">
    
    <!-- Text Content -->
    <div class="flex-1 p-8 md:p-16 flex flex-col justify-center"
         :class="layout === 'text-right' ? 'md:order-2' : 'md:order-1'">
      <h3 class="text-lg md:text-4xl font-bold text-white mb-6 leading-tight uppercase tracking-wide">
        {{ title }}
      </h3>
      <p class="text-gray-300 text-xs md:text-lg leading-relaxed mb-10 max-w-xl">
        {{ description }}
      </p>
      <button class="bg-[#4b8445] hover:brightness-110 text-white font-bold h-[48px] rounded-full shadow-lg transition flex items-center justify-between px-2 group min-w-[200px] border border-green-600/50">
         <div class="w-8 h-8 rounded-full bg-[#1a3125] flex items-center justify-center group-hover:bg-[#254233] transition-colors">
            <!-- Diagonal Arrow Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" transform="rotate(-45 12 12)" /></svg>
         </div>
         <span class="text-sm flex-1 text-center pr-2">{{ buttonText }}</span>
      </button>
    </div>

    <!-- Image Content -->
    <div class="flex-1 relative min-h-[300px] md:min-h-full"
         :class="layout === 'text-right' ? 'md:order-1' : 'md:order-2'">
        <div class="absolute inset-4 md:inset-8 rounded-2xl overflow-hidden">
            <img :src="image" :alt="title" class="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
        </div>
    </div>

  </div>
</template>

<script src="./TrainingCard.js"></script>
<style scoped src="./TrainingCard.css"></style>
