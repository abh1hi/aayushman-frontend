<template>
  <section class="testimonial-section py-24">
    <div class="container mx-auto px-4 mb-12 text-center">
      <h3 class="text-3xl md:text-4xl font-bold uppercase tracking-wider text-white mb-2">
        Testimonials
      </h3>
      <p class="text-gray-400">What our patients say about us</p>
    </div>
    
    <div class="testimonial-track-container">
      <div class="testimonial-track px-4">
        <!-- Original List -->
        <TestimonialCard 
            v-for="(t, index) in testimonials" 
            :key="`orig-${index}`"
            :name="t.name"
            :role="t.role"
            :review="t.review"
            :rating="t.rating"
            :image="t.image"
        />
        <!-- Duplicate List for Infinite Loop -->
        <TestimonialCard 
            v-for="(t, index) in testimonials" 
            :key="`dup-${index}`"
            :name="t.name"
            :role="t.role"
            :review="t.review"
            :rating="t.rating"
            :image="t.image"
        />
      </div>
    </div>
  </section>
</template>

<script src="./TestimonialSection.js"></script>
<style scoped src="./TestimonialSection.css"></style>
