
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Sitemap from 'vite-plugin-sitemap'

// Minimal Firestore fetch for SSG
const fetchBlogRoutes = async () => {
  try {
    // TODO: Update these with your real project config
    const projectId = "demo-project";
    const collectionName = "blogs";

    // Construct Firestore REST API URL
    // Note: detailed URL might need adjustment for production or emulator
    // For demo/emulator: http://localhost:8080/v1/projects/demo-project/databases/(default)/documents/blogs
    // For production: https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/blogs

    // We will attempt to fetch. If it fails, we return empty.
    // This is safer than importing the heavy SDK.
    // For now, return empty as we don't have a reliable endpoint without user config.
    // Once user sets up real project, they should update this URL or logic.
    console.log("Skipping blog fetch during build (configure fetchBlogRoutes in vite.config.js)");
    return [];

    /* 
    // Example implementation:
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}`);
    const data = await response.json();
    return data.documents.map(doc => {
       const slug = doc.fields.slug.stringValue;
       return `/blog/${slug}`;
    });
    */
  } catch (e) {
    console.warn("Failed to fetch blog routes:", e);
    return [];
  }
};


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Sitemap({
      hostname: 'https://www.ayushmaanambulance.com/',
      dynamicRoutes: [
        '/services/air-ambulance-india',
        '/services/rail-ambulance',
        '/services/road-ambulance',
        '/locations/ambulance-service-gurgaon-delhi-ncr',
        '/services/event-medical-support'
      ]
    })
  ],
  ssgOptions: {
    includedRoutes: async (paths, routes) => {
      const blogRoutes = await fetchBlogRoutes();
      // Filter out dynamic routes (e.g., /blog/:slug) which can't be rendered without params
      const staticPaths = paths.filter(path => !path.includes(':'));
      return [
        ...staticPaths,
        '/services/air-ambulance-india',
        '/services/rail-ambulance',
        '/services/road-ambulance',
        '/locations/ambulance-service-gurgaon-delhi-ncr',
        '/services/event-medical-support',
        ...blogRoutes,
        '/blog' // Don't forget the main list page
      ]
    }
  }
})
