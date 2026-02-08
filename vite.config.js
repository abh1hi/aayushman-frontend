import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Sitemap({
      hostname: 'https://ayushman-ambulance.web.app',
      dynamicRoutes: [
        '/services/air-ambulance-india',
        '/services/rail-ambulance',
        '/services/road-ambulance',
        '/locations/ambulance-service-gurgaon-delhi-ncr',
        '/services/event-medical-support',
      ]
    })
  ],
  ssgOptions: {
    includedRoutes(paths, routes) {
      return [
        ...paths,
        '/services/air-ambulance-india',
        '/services/rail-ambulance',
        '/services/road-ambulance',
        '/locations/ambulance-service-gurgaon-delhi-ncr',
        '/services/event-medical-support',
      ]
    }
  }
})
