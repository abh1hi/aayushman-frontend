<template>
  <section class="partner-section py-16">
    <div class="container mx-auto px-4 text-center">
      <h3 class="text-xl md:text-2xl text-gray-400 font-semibold tracking-[0.2em] uppercase mb-12">
        Our Valued Partners
      </h3>
      
      <div class="slider">
        <div class="slide-track">
          <!-- First Set of Logos -->
          <div v-for="(logo, index) in partners" :key="`a-${index}`" class="flex items-center justify-center">
             <img :src="logo" alt="Partner Logo" class="partner-logo" />
          </div>
          <!-- Second Set of Logos (Duplicate for infinite loop) -->
          <div v-for="(logo, index) in partners" :key="`b-${index}`" class="flex items-center justify-center">
             <img :src="logo" alt="Partner Logo" class="partner-logo" />
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script src="./PartnerSection.js"></script>
<style scoped src="./PartnerSection.css"></style>
