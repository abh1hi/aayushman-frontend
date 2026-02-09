<template>
  <section class="our-services-section py-20">
    <div class="container mx-auto px-4">
      
      <!-- Grid/Scroll Layout -->
      <!-- Mobile: Horizontal Scroll (Flex) | Desktop: Grid -->
      <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:pb-0 md:mx-0 md:px-0 scrollbar-hide">
        
        <!-- Loop through Services -->
        <div v-for="(service, index) in services" :key="index" class="min-w-[85vw] sm:min-w-[350px] snap-center md:min-w-0 md:w-auto flex-shrink-0 md:flex-shrink">
            <ServiceCard 
                :title="service.title"
                :description="service.description"
                :image="service.image"
            />
        </div>

        <!-- Last Card: Call to Action -->
        <div class="min-w-[85vw] sm:min-w-[350px] snap-center md:min-w-0 md:w-auto flex-shrink-0 md:flex-shrink">
            <div class="cta-card p-8 text-white text-center md:text-left relative h-full rounded-2xl">
               <div class="relative z-10 h-full flex flex-col justify-center items-center md:items-start">
                 <h3 class="text-3xl font-bold mb-4">Not Sure What You Need?</h3>
                 <p class="text-gray-200 mb-8 max-w-sm">
                    Our experts will guide you to the right medical transfer, 
                    <a href="tel:8802020245" class="underline hover:text-white">88 02 02 02 45</a>.
                 </p>
                 
                 <button @click="handleCall" 
                   class="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full inline-flex items-center gap-2 w-max transition-colors shadow-xl">
                   <span class="bg-white text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-sm">↗</span>
                   Call Now
                 </button>
               </div>
            </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script src="./OurServicesSection.js"></script>
<style scoped src="./OurServicesSection.css"></style>
