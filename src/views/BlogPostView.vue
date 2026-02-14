<template>
    <div class="blog-post" v-if="post">
        <h1>{{ post.title }}</h1>
        <div class="meta">Published on {{ formatDate(post.publishedDate) }}</div>
        <div class="content" v-html="post.content"></div>
    </div>
    <div v-else>Loading...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useHead } from '@vueuse/head';

const route = useRoute();
const post = ref(null);

onMounted(async () => {
    const slug = route.params.slug;
    const q = query(collection(db, 'blogs'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        post.value = querySnapshot.docs[0].data();
        
        // Update Head for SEO
        useHead({
            title: post.value.title,
            meta: [
                { name: 'description', content: post.value.summary },
                { property: 'og:title', content: post.value.title },
                { property: 'og:description', content: post.value.summary },
                { property: 'og:image', content: post.value.coverImage || 'https://www.ayushmaanambulance.com/alsalogo.png' }
            ],
            script: [
                {
                    type: 'application/ld+json',
                    children: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: post.value.title,
                        image: post.value.coverImage || 'https://www.ayushmaanambulance.com/alsalogo.png',
                        datePublished: post.value.publishedDate ? new Date(post.value.publishedDate.seconds * 1000).toISOString() : '',
                        author: {
                            '@type': 'Organization',
                            name: 'Ayushmaan Life Support Team'
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'Ayushmaan Life Support Ambulance',
                            logo: {
                                '@type': 'ImageObject',
                                url: 'https://www.ayushmaanambulance.com/logo.png'
                            }
                        },
                        description: post.value.summary
                    })
                }
            ]
        });
    }
});

const formatDate = (timestamp) => {
    if (!timestamp) return '';
    // Handle both Firestore Timestamp and JS Date strings
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
};
</script>

<style scoped>
.blog-post {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}
</style>
