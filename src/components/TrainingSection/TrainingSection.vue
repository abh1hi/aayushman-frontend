<template>
  <section class="training-section py-24">
    <div class="container mx-auto px-4 flex flex-col gap-12">
      
      <TrainingCard 
        v-for="(item, index) in items"
        :key="index"
        :title="item.title"
        :description="item.description"
        :image="item.image"
        :buttonText="item.buttonText"
        :layout="item.layout"
      />

    </div>
  </section>
</template>

<script src="./TrainingSection.js"></script>
<style scoped src="./TrainingSection.css"></style>
