<template>
    <div class="blog-list">
        <h1>Our Blog</h1>
        <div v-if="loading">Loading...</div>
        <div v-else class="grid">
            <div v-for="post in posts" :key="post.slug" class="blog-card">
                <h2>{{ post.title }}</h2>
                <p>{{ post.summary }}</p>
                <router-link :to="`/blog/${post.slug}`">Read More</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const posts = ref([]);
const loading = ref(true);
import { useHead } from '@vueuse/head';

useHead({
    title: 'Blog | Ayushmaan Life Support Ambulance',
    meta: [
        { name: 'description', content: 'Latest updates and health information from Ayushmaan Life Support Ambulance.' },
        { property: 'og:title', content: 'Blog | Ayushmaan Life Support Ambulance' },
        { property: 'og:description', content: 'Latest updates and health information from Ayushmaan Life Support Ambulance.' },
        { property: 'og:image', content: 'https://www.ayushmaanambulance.com/alsalogo.png' },
        { property: 'og:type', content: 'website' }
    ]
});

onMounted(async () => {
    try {
        const q = query(collection(db, 'blogs'), orderBy('publishedDate', 'desc'));
        const querySnapshot = await getDocs(q);
        posts.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("Error fetching blogs: ", e);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
/* Basic styling */
.blog-list {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}
.blog-card {
    border: 1px solid #ccc;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 8px;
}
</style>
