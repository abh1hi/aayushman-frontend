<template>
  <section class="facilities-section py-20">
    <div class="container mx-auto px-4">
      
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        
        <!-- Left Column: Interactive List -->
        <div class="flex flex-col space-y-2">
           <div v-for="(facility, index) in facilities" :key="index"
                @click="setActive(index)"
                :class="['facility-item py-6 text-xl md:text-2xl font-medium select-none', 
                         activeIndex === index ? 'active' : 'text-gray-500']">
              {{ facility.title }}
           </div>
        </div>

        <!-- Right Column: Reusable Detail Card -->
        <div class="flex justify-center lg:justify-end">
           <transition name="fade" mode="out-in">
              <FacilityCard 
                 :key="activeIndex"
                 :title="facilities[activeIndex].title"
                 :image="facilities[activeIndex].image"
                 :description="facilities[activeIndex].description"
                 :alt="facilities[activeIndex].alt"
              />
           </transition>
        </div>

      </div>

    </div>
  </section>
</template>

<script src="./FacilitiesSection.js"></script>
<style scoped src="./FacilitiesSection.css"></style>
