<template>
  <section class="contact-us-section py-24 font-sans">
    <div class="container mx-auto px-4 flex flex-col lg:flex-row gap-16 items-start lg:items-center">
      
      <!-- Left: Contact Details -->
      <div class="lg:w-1/2 text-white">
         
         <div class="mb-12">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Official Address</h3>
            <p class="text-base md:text-lg leading-relaxed text-gray-200">
                Plot No. 1114<br />
                Sector 38, Near Medanta, The Medicity<br />
                Gurugram, Haryana 122001
            </p>
         </div>

         <div class="mb-12">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Call Us</h3>
            <div class="space-y-2">
                <p class="text-base md:text-lg">
                    <span class="text-gray-400 w-32 inline-block">Emergency:</span> 
                    <span class="font-bold tracking-wide">+91 88 02 02 02 45</span>
                </p>
                <p class="text-lg">
                    <span class="text-gray-400 w-32 inline-block">General Enquires:</span> 
                    <span class="font-bold tracking-wide">+91 99 11 700 900</span>
                </p>
            </div>
         </div>

         <div>
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Email</h3>
            <p class="text-base md:text-lg text-gray-200">
                alsagurgaon@gmail.com
            </p>
         </div>

      </div>

      <!-- Right: Form Card -->
      <div class="lg:w-1/2 w-full">
         <div class="form-card p-8 md:p-12">
            <h3 class="text-lg text-white mb-2">Have a question or need assistance?</h3>
            <p class="text-gray-400 text-sm mb-8">Share your details below and we'll respond at the earliest.</p>
            
            <form @submit.prevent="submitForm" class="space-y-6">
                
                <!-- Name -->
                <div>
                   <input v-model="form.name" type="text" placeholder="Name" class="glass-input w-full px-6 py-4" required />
                </div>

                <!-- Contact -->
                <div>
                   <input v-model="form.contact" type="text" placeholder="Contact" class="glass-input w-full px-6 py-4" required />
                </div>

                <!-- Message -->
                <div>
                   <textarea v-model="form.message" rows="4" placeholder="Tell us how we can assist you.." class="glass-input glass-textarea w-full px-6 py-4 resize-none" required></textarea>
                </div>

                <!-- Submit -->
                <div class="flex justify-start">
                    <button type="submit" class="bg-[#4b8445] hover:brightness-110 text-white font-bold h-[48px] rounded-full shadow-lg transition flex items-center justify-between px-2 group min-w-[200px] border border-green-600/50">
                        <div class="w-8 h-8 rounded-full bg-[#1a3125] flex items-center justify-center group-hover:bg-[#254233] transition-colors">
                            <!-- Diagonal Arrow Icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" transform="rotate(-45 12 12)" /></svg>
                        </div>
                        <span class="text-sm flex-1 text-center pr-2">Submit</span>
                    </button>
                </div>

            </form>
         </div>
      </div>

    </div>
  </section>
</template>

<script src="./ContactUsSection.js"></script>
<style scoped src="./ContactUsSection.css"></style>
