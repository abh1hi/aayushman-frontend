<template>
  <div class="blog-card aspect-square cursor-pointer group">
    
    <!-- Image -->
    <div class="w-full h-full relative z-0">
        <img :src="image" :alt="alt || title" class="blog-image w-full h-full object-cover" />
    </div>

    <!-- Overlay Content -->
    <div class="blog-overlay absolute inset-0 flex flex-col justify-end p-6 md:p-8 opacity-90 group-hover:opacity-100 transition-opacity">
        <h4 class="text-white font-bold text-lg md:text-xl leading-snug mb-2 uppercase tracking-wide group-hover:text-green-400 transition-colors">
            {{ title }}
        </h4>
        <p class="text-gray-400 text-xs md:text-sm font-mono">
            {{ date }}
        </p>
    </div>

  </div>
</template>

<script src="./BlogCard.js"></script>
<style scoped src="./BlogCard.css"></style>
