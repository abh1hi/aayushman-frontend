<template>
  <section class="blog-section py-24">
    <div class="container mx-auto px-4">
      
      <!-- Optional Heading -->
      <!-- <h2 class="text-4xl md:text-5xl font-bold text-white mb-16 text-center">Latest Insights</h2> -->

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <BlogCard 
           v-for="(blog, index) in blogs"
           :key="index"
           :title="blog.title"
           :date="blog.date"
           :image="blog.image"
        />
      </div>

    </div>
  </section>
</template>

<script src="./BlogSection.js"></script>
<style scoped src="./BlogSection.css"></style>
