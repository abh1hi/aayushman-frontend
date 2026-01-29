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
]

export const createApp = ViteSSG(
    App,
    { routes },
    ({ app, router, routes, isClient, initialState }) => {
        // Custom logic if needed
    },
)
