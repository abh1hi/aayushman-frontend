<template>
  <section class="event-support-section py-20">
    <div class="container mx-auto px-4">
      
      <!-- Optional Section Heading -->
      <!-- <h2 class="text-3xl md:text-5xl font-bold text-center text-white mb-16 uppercase tracking-wider">Event Support</h2> -->

      <div class="grid md:grid-cols-3 gap-8">
         <EventCard 
            v-for="(event, index) in events"
            :key="index"
            :title="event.title"
            :description="event.description"
            :image="event.image"
            :imagePosition="event.imagePosition"
         />
      </div>

    </div>
  </section>
</template>

<script src="./EventSupportSection.js"></script>
<style scoped src="./EventSupportSection.css"></style>
