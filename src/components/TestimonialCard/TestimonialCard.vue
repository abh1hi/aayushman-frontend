<template>
  <div class="testimonial-card p-8 flex flex-col justify-between h-full">
    
    <div>
      <!-- Stars -->
      <div class="stars flex gap-1 mb-4 text-lg">
        <span v-for="n in 5" :key="n">
           {{ n <= rating ? '★' : '☆' }}
        </span>
      </div>

      <!-- Review Text -->
      <p class="text-gray-300 text-sm leading-relaxed italic mb-6">
        "{{ review }}"
      </p>
    </div>

    <!-- User Info -->
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full overflow-hidden border border-gray-600">
        <img :src="image" alt="User Avatar" class="w-full h-full object-cover" />
      </div>
      <div>
        <h4 class="text-white font-bold text-sm">{{ name }}</h4>
        <p class="text-gray-500 text-xs">{{ role }}</p>
      </div>
    </div>

  </div>
</template>

<script src="./TestimonialCard.js"></script>
<style scoped src="./TestimonialCard.css"></style>
