<template>
  <header class="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center w-full">
    
    <!-- Mobile Header -->
    <div class="md:hidden flex justify-between items-center w-full">
       <!-- Left: Actions -->
       <div class="flex items-center gap-3">
          <!-- Menu Toggle -->
          <button class="w-12 h-12 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex flex-col gap-1.5 items-center justify-center shadow-lg active:scale-95 transition-transform">
             <span class="w-5 h-0.5 bg-gray-200 rounded-full"></span>
             <span class="w-5 h-0.5 bg-gray-200 rounded-full"></span>
             <span class="w-5 h-0.5 bg-gray-200 rounded-full"></span>
          </button>

          <!-- Call Button -->
          <a href="tel:+919777995101" class="w-12 h-12 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg active:scale-95 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 1.23 0 2.45.2 3.57.57.35.13.74.04 1.02-.24l2.2 2.2z"/>
             </svg>
          </a>
       </div>

       <!-- Right: Logo -->
       <a href="/" class="flex items-center gap-3 bg-black/30 px-3 py-1.5 rounded-xl backdrop-blur-sm">
          <img src="/ALSA_LOGO.svg" alt="ALSA" class="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          <div class="text-left leading-none">
             <h1 class="text-white font-bold text-[0.55rem] tracking-wider font-sans">
               AYUSHMAAN<br/>LIFE SUPPORT<br/>AMBULANCE®
             </h1>
          </div>
       </a>
    </div>

    <!-- Desktop Header -->
    <div class="hidden md:flex header-pill rounded-full px-6 py-3 items-center justify-between w-full max-w-6xl">
      
      <!-- Logo Section -->
      <div class="flex items-center gap-3">
        <a href="/" class="flex items-center gap-3">
          <img src="/ALSA_LOGO.svg" alt="Ayushmaan Life Support Ambulance" class="h-12 w-auto object-contain" />
          <div class="text-left leading-tight hidden md:block">
             <h1 class="text-white font-bold text-[0.65rem] tracking-wide font-sans">AYUSHMAAN<br/>LIFE SUPPORT<br/>AMBULANCE®</h1>
          </div>
        </a>
      </div>

      <!-- Navigation Links -->
      <nav class="hidden md:flex items-center gap-8 text-gray-300 text-sm font-medium">
        <div v-for="(item, index) in navItems" :key="index" class="relative group cursor-pointer" @click="toggleDropdown(index)">
          <div class="nav-link flex items-center gap-1 hover:text-white transition-colors duration-300">
            {{ item.name }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 opacity-70 group-hover:opacity-100 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <!-- Dropdown Placeholder -->
          <div v-if="activeDropdown === index" class="absolute top-full left-0 mt-4 w-40 bg-gray-900/90 backdrop-blur-md rounded-xl border border-gray-700 p-2 shadow-xl animate-fade-in">
             <div class="text-xs text-gray-500 p-2">Submenu for {{ item.name }}</div>
          </div>
        </div>
      </nav>

      <!-- Emergency Call Action -->
      <div class="liquid-button cursor-pointer">
        <span class="text-red-600 font-bold tracking-widest text-sm glow-text uppercase">
          Emergency Call
        </span>
      </div>

    </div>
  </header>
</template>

<script src="./Header.js"></script>
<style scoped src="./Header.css"></style>
