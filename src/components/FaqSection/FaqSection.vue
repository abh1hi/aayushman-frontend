<template>
  <section class="faq-section py-16 md:py-24 px-4 font-sans">
    <div class="container mx-auto">
      
      <!-- Main Glass Card Container -->
      <div class="faq-container p-6 md:p-16 flex flex-col lg:flex-row gap-8 lg:gap-24">
        
        <!-- Left Content -->
        <div class="lg:w-1/3 flex flex-col justify-center">
            <h2 class="text-2xl md:text-5xl font-bold text-white mb-6 leading-tight font-sans">
                All your questions, <br />
                <span class="text-gray-400">clearly answered</span>
            </h2>
            <p class="text-gray-400 text-lg mb-10 max-w-sm">
                Transparent answers for patients, families, and partners.
            </p>
            <a href="tel:+918802020245" class="bg-[#4b8445] hover:brightness-110 text-white font-bold h-[48px] rounded-full shadow-lg transition flex items-center justify-between px-2 group min-w-[200px] border border-green-600/50">
               <div class="w-8 h-8 rounded-full bg-[#1a3125] flex items-center justify-center group-hover:bg-[#254233] transition-colors">
                  <!-- Diagonal Arrow Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" transform="rotate(-45 12 12)" /></svg>
               </div>
               <span class="text-sm flex-1 text-center pr-2">Call Now</span>
            </a>
        </div>

        <!-- Right Accordion -->
        <div class="lg:w-2/3 flex flex-col">
            <div 
                v-for="(item, index) in faqs" 
                :key="index"
                class="faq-item cursor-pointer px-6 py-4 md:px-8 md:py-5"
                :class="{ 'is-active': activeIndex === index }"
                @click="toggle(index)"
            >
                <!-- Header -->
                <div class="flex items-center justify-between">
                    <h3 class="faq-question text-white/90 font-medium text-lg select-none font-sans">
                        {{ item.question }}
                    </h3>
                    <span class="faq-icon text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </span>
                </div>

                <!-- Expanded Content -->
                <div class="faq-answer-wrapper">
                    <p class="text-gray-400 pt-2 pb-1 leading-relaxed">
                        {{ item.answer }}
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script src="./FaqSection.js"></script>
<style scoped src="./FaqSection.css"></style>
