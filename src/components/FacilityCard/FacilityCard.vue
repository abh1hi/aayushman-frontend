<template>
  <div class="facility-card p-6 md:p-8 flex flex-col items-center text-center h-full max-w-lg mx-auto">
    <!-- Image Container with Rounded Corners -->
    <div class="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-gray-800">
       <img :src="image" :alt="alt || title" class="w-full h-full object-cover" />
    </div>

    <!-- Description -->
    <p class="text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
      {{ description }}
    </p>

    <!-- Know More Button -->
    <button class="bg-[#4b8445] hover:brightness-110 text-white font-bold h-[48px] rounded-full shadow-lg transition flex items-center justify-between px-2 group min-w-[200px] border border-green-600/50">
       <div class="w-8 h-8 rounded-full bg-[#1a3125] flex items-center justify-center group-hover:bg-[#254233] transition-colors">
          <!-- Diagonal Arrow Icon -->
         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" transform="rotate(-45 12 12)" /></svg>
       </div>
       <span class="text-sm flex-1 text-center pr-2">Know More</span>
    </button>
  </div>
</template>

<script src="./FacilityCard.js"></script>
<style scoped src="./FacilityCard.css"></style>
