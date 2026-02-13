<template>
  <div class="event-card h-full flex flex-col bg-gray-900/50 rounded-3xl overflow-hidden border border-gray-800">
    
    <!-- Content Section: Title, Description, Button -->
    <div class="p-6 md:p-8 flex-shrink-0">
      <h3 class="text-lg md:text-xl font-bold text-white mb-3 leading-tight">{{ title }}</h3>
      <p class="text-gray-400 text-xs md:text-sm leading-relaxed mb-6">{{ description }}</p>
      <button class="bg-[#4b8445] hover:brightness-110 text-white font-bold h-[48px] rounded-full shadow-lg transition flex items-center justify-between px-2 group min-w-[200px] border border-green-600/50">
         <div class="w-8 h-8 rounded-full bg-[#1a3125] flex items-center justify-center group-hover:bg-[#254233] transition-colors">
            <!-- Diagonal Arrow Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" transform="rotate(-45 12 12)" /></svg>
         </div>
         <span class="text-sm flex-1 text-center pr-2">Book Now</span>
      </button>
    </div>

    <!-- Image Section with Rounded Corners -->
    <div class="w-full relative flex-1 min-h-[280px] overflow-hidden rounded-2xl mx-4 md:mx-6 mb-4 md:mb-6">
        <img :src="image" :alt="alt || title" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
    </div>

  </div>
</template>

<script src="./EventCard.js"></script>
<style scoped src="./EventCard.css"></style>
