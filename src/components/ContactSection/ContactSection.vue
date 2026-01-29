<template>
  <footer class="contact-section text-gray-300 py-12">
    <div class="container mx-auto px-4 grid md:grid-cols-4 gap-8">
      
      <!-- Logo & About -->
      <div>
        <h2 class="text-2xl font-bold text-white mb-4">AYUSHMAN <span class="text-red-600">AMBULANCE</span></h2>
        <p class="text-sm text-gray-400 mb-6">
          Providing world-class emergency medical services with a fleet of advanced ambulances and trained professionals.
        </p>
        <div class="flex gap-4">
          <!-- Social Icons Placeholder -->
          <a href="#" class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-red-600 transition">Fb</a>
          <a href="#" class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-red-600 transition">Tw</a>
          <a href="#" class="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-red-600 transition">In</a>
        </div>
      </div>

      <!-- Quick Links -->
      <div>
        <h3 class="text-white font-bold mb-4 uppercase">Quick Links</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="#" class="hover:text-red-500 transition">Home</a></li>
          <li><a href="#" class="hover:text-red-500 transition">About Us</a></li>
          <li><a href="#" class="hover:text-red-500 transition">Services</a></li>
          <li><a href="#" class="hover:text-red-500 transition">Contact</a></li>
        </ul>
      </div>

      <!-- Contact Info -->
      <div>
        <h3 class="text-white font-bold mb-4 uppercase">Contact Us</h3>
        <ul class="space-y-4 text-sm">
          <li class="flex items-start gap-3">
            <span class="text-red-500">📍</span>
            <span>123 Emergency Lane, New Delhi, India 110001</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="text-red-500">📞</span>
            <span class="text-white font-bold text-lg">+91 98765 43210</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="text-red-500">✉</span>
            <span>help@ayushman.com</span>
          </li>
        </ul>
      </div>

      <!-- Newsletter -->
      <div>
        <h3 class="text-white font-bold mb-4 uppercase">Newsletter</h3>
        <p class="text-xs text-gray-400 mb-4">Subscribe for health updates.</p>
        <form @submit.prevent="subscribe" class="flex flex-col gap-2">
          <input v-model="email" type="email" placeholder="Your Email" 
            class="bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:border-red-500" />
          <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
            Subscribe
          </button>
        </form>
      </div>

    </div>
    <div class="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
      &copy; 2024 Ayushman Life Support Ambulance. All rights reserved.
    </div>
  </footer>
</template>

<script src="./ContactSection.js"></script>
<style scoped src="./ContactSection.css"></style>
