<template>
  <header class="fixed top-6 left-0 right-0 z-50 px-4 flex justify-center">
    <div class="header-pill rounded-full px-6 py-3 flex items-center justify-between w-full max-w-6xl">
      
      <!-- Logo Section -->
      <div class="flex items-center gap-3">
        <a href="/" class="flex items-center gap-3">
          <img src="/alsalogo.png" alt="Ayushman Life Support Ambulance" class="h-12 w-auto object-contain" />
          <div class="text-left leading-tight hidden md:block">
             <h1 class="text-white font-bold text-[0.65rem] tracking-wide">AYUSHMAN<br/>LIFE SUPPORT<br/>AMBULANCE</h1>
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
