<template>
  <div class="event-card h-full flex flex-col">
    
    <!-- Top Content (if image is bottom) -->
    <div v-if="imagePosition === 'bottom'" class="p-8 pb-4 flex-1">
      <h3 class="text-xl md:text-2xl font-bold text-gray-100 mb-3">{{ title }}</h3>
      <p class="text-gray-400 text-sm leading-relaxed mb-6">{{ description }}</p>
      <button class="book-now-btn text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 text-sm w-max">
         <span class="border border-white/50 rounded-full w-4 h-4 flex items-center justify-center text-[8px]">↗</span>
         Book Now
      </button>
    </div>

    <!-- Image -->
    <div class="w-full relative h-[400px] md:h-[450px] overflow-hidden">
        <img :src="image" :alt="title" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
    </div>

    <!-- Bottom Content (if image is top) -->
    <div v-if="imagePosition === 'top'" class="p-8 pt-6 flex-1 flex flex-col justify-end">
      <h3 class="text-xl md:text-2xl font-bold text-gray-100 mb-3">{{ title }}</h3>
      <p class="text-gray-400 text-sm leading-relaxed mb-6">{{ description }}</p>
      <button class="book-now-btn text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 text-sm w-max">
         <span class="border border-white/50 rounded-full w-4 h-4 flex items-center justify-center text-[8px]">↗</span>
         Book Now
      </button>
    </div>

  </div>
</template>

<script src="./EventCard.js"></script>
<style scoped src="./EventCard.css"></style>
