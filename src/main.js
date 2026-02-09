import { ViteSSG } from 'vite-ssg'
import './style.css'
import App from './App.vue'
import HomeView from './views/HomeView.vue'

import ServiceView from './views/ServiceView.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/services/air-ambulance-india', component: ServiceView },
    { path: '/services/rail-ambulance', component: ServiceView },
    { path: '/services/road-ambulance', component: ServiceView },
    { path: '/locations/ambulance-service-gurgaon-delhi-ncr', component: ServiceView },
    { path: '/services/event-medical-support', component: ServiceView },
    { path: '/blog', component: () => import('./views/BlogListView.vue') },
    { path: '/blog/:slug', component: () => import('./views/BlogPostView.vue') },
]

export const createApp = ViteSSG(
    App,
    { routes },
    ({ app, router, routes, isClient, initialState }) => {
        if (isClient) {
            console.log('--- Font Loading Status ---');
            const fontsToCheck = ['16px Balthazar', '16px Copperplate'];
            // Force load the fonts we care about
            const loadPromises = fontsToCheck.map(font => document.fonts.load(font));

            Promise.all(loadPromises).then(() => {
                fontsToCheck.forEach(font => {
                    const isLoaded = document.fonts.check(font);
                    console.log(`[Check] ${font}: ${isLoaded ? 'LOADED ✅' : 'NOT LOADED ❌'}`);
                });
                console.log('--- Detail Loaded Fonts ---');
                document.fonts.forEach((font) => {
                    console.log(`Face: ${font.family}, Status: ${font.status}, Display: ${font.display}`);
                });
            });
        }
    },
)
