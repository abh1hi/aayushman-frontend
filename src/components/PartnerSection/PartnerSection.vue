<template>
  <section class="partner-section py-16">
    <div class="container mx-auto px-4 text-center">
      <h3 class="text-xl md:text-2xl text-gray-400 font-semibold tracking-[0.2em] uppercase mb-12 leading-tight">
        Our Valued Partners
      </h3>
      
      <div class="slider">
        <div class="slide-track">
          <!-- First Set of Logos -->
           <div v-for="(partner, index) in partners" :key="index" class="partner-logo-wrapper">
             <img :src="partner.logo" :alt="partner.alt" class="partner-logo" />
           </div>
           <!-- Duplicate for infinite scroll -->
           <div v-for="(partner, index) in partners" :key="'dup-'+index" class="partner-logo-wrapper">
             <img :src="partner.logo" :alt="partner.alt" class="partner-logo" />
           </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script src="./PartnerSection.js"></script>
<style scoped src="./PartnerSection.css"></style>
