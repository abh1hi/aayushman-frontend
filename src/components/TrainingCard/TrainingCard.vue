<template>
  <div class="training-card w-full flex flex-col md:flex-row min-h-[500px]">
    
    <!-- Text Content -->
    <div class="flex-1 p-8 md:p-16 flex flex-col justify-center"
         :class="layout === 'text-right' ? 'md:order-2' : 'md:order-1'">
      <h3 class="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight uppercase tracking-wide">
        {{ title }}
      </h3>
      <p class="text-gray-300 text-lg leading-relaxed mb-10 max-w-xl">
        {{ description }}
      </p>
      <button class="action-btn text-white font-bold py-3 px-8 rounded-full flex items-center gap-3 w-max">
         <span class="border border-white/50 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">↗</span>
         {{ buttonText }}
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
