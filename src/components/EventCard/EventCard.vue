<template>
  <div class="event-card h-full flex flex-col bg-gray-900/50 rounded-3xl overflow-hidden border border-gray-800">
    
    <!-- Content Section: Title, Description, Button -->
    <div class="p-6 md:p-8 flex-shrink-0">
      <h3 class="text-lg md:text-xl font-bold text-white mb-3 leading-tight">{{ title }}</h3>
      <p class="text-gray-400 text-xs md:text-sm leading-relaxed mb-6">{{ description }}</p>
      <button class="book-now-btn text-white font-bold py-2.5 px-6 rounded-full flex items-center gap-2 text-sm">
         <span class="border border-white/50 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">↗</span>
         Book Now
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
