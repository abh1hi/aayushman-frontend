<template>
  <section class="blog-section py-24">
    <div class="container mx-auto px-4">
      
      <!-- Heading -->
      <h2 class="text-4xl md:text-5xl font-bold text-white mb-16 text-center">LATEST NEWS</h2>

      <!-- Scroll/Grid Layout -->
      <div class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:pb-0 md:mx-0 md:px-0 scrollbar-hide">
        <div v-for="(blog, index) in blogs" :key="index" class="w-[300px] min-w-[300px] sm:w-[320px] sm:min-w-[320px] snap-center md:min-w-0 md:w-auto flex-shrink-0 md:flex-shrink">
            <BlogCard 
               :title="blog.title"
               :date="blog.date"
               :image="blog.image"
               :alt="blog.alt"
            />
        </div>
      </div>

    </div>
  </section>
</template>

<script src="./BlogSection.js"></script>
<style scoped src="./BlogSection.css"></style>
