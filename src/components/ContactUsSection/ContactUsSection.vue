<template>
  <section class="contact-us-section py-24">
    <div class="container mx-auto px-4 flex flex-col lg:flex-row gap-16 items-start lg:items-center">
      
      <!-- Left: Contact Details -->
      <div class="lg:w-1/2 text-white">
         
         <div class="mb-12">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Official Address</h3>
            <p class="text-lg leading-relaxed text-gray-200">
                Plot No. 1114<br />
                Sector 38, Near Medanta, The Medicity<br />
                Gurugram, Haryana 122001
            </p>
         </div>

         <div class="mb-12">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Call Us</h3>
            <div class="space-y-2">
                <p class="text-lg">
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
            <p class="text-lg text-gray-200">
                alsagurgaon@gmail.com
            </p>
         </div>

      </div>

      <!-- Right: Form Card -->
      <div class="lg:w-1/2 w-full">
         <div class="form-card p-8 md:p-12">
            <h3 class="text-xl text-white mb-2">Have a question or need assistance?</h3>
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
                    <button type="submit" class="submit-btn text-white font-bold py-3 px-10 rounded-full flex items-center gap-3">
                        <span class="border border-white/50 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">↗</span>
                        Submit
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
