<template>
  <section class="event-support-section">
    <div class="container mx-auto px-4 py-20">
      
      <!-- Optional Section Heading -->
      <!-- <h2 class="text-3xl md:text-5xl font-bold text-center text-white mb-16 uppercase tracking-wider">Event Support</h2> -->

      <!-- Scroll/Grid Layout -->
      <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 md:grid md:grid-cols-3 md:gap-8 md:pb-0 md:mx-0 md:px-0 scrollbar-hide">
         <div v-for="(event, index) in events" :key="index" class="min-w-[85vw] sm:min-w-[350px] snap-center md:min-w-0 md:w-auto flex-shrink-0 md:flex-shrink">
             <EventCard 
                :title="event.title"
                :description="event.description"
                :image="event.image"
                :imagePosition="event.imagePosition"
             />
         </div>
      </div>

    </div>
  </section>
</template>

<script src="./EventSupportSection.js"></script>
<style scoped src="./EventSupportSection.css"></style>
