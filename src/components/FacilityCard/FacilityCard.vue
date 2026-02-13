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
    <button class="know-more-btn text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 shadow-lg">
       <span class="border-2 border-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">↗</span>
       Know More
    </button>
  </div>
</template>

<script src="./FacilityCard.js"></script>
<style scoped src="./FacilityCard.css"></style>
