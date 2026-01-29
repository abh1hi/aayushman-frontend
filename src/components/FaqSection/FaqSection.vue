<template>
  <section class="faq-section py-24 px-4">
    <div class="container mx-auto">
      
      <!-- Main Glass Card Container -->
      <div class="faq-container p-8 md:p-16 flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        <!-- Left Content -->
        <div class="lg:w-1/3 flex flex-col justify-center">
            <h2 class="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                All your questions, <br />
                <span class="text-gray-400">clearly answered</span>
            </h2>
            <p class="text-gray-400 text-lg mb-10 max-w-sm">
                Transparent answers for patients, families, and partners.
            </p>
            <button class="call-btn w-max text-white font-bold py-3 px-8 rounded-full flex items-center gap-3 shadow-lg">
                <span class="border border-white/50 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">↗</span>
                Call Now
            </button>
        </div>

        <!-- Right Accordion -->
        <div class="lg:w-2/3 flex flex-col gap-4">
            <div 
                v-for="(item, index) in faqs" 
                :key="index"
                class="faq-item cursor-pointer px-8 py-5"
                :class="{ 'is-active': activeIndex === index }"
                @click="toggle(index)"
            >
                <!-- Header -->
                <div class="flex items-center justify-between">
                    <h3 class="faq-question text-white/90 font-medium text-lg select-none">
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
