import { defineConfig } from 'unlighthouse'

export default defineConfig({
    // interactive mode off for CI/automated testing
    ci: {
        budget: {
            performance: 50,
            accessibility: 90,
            'best-practices': 90,
            seo: 90,
        },
    },
    scanner: {
        device: 'mobile',
        skipAfter: 10, // Limit pages to avoid long runs
    },
    hooks: {
        'worker-before': async () => {
            // Optional hooks
        }
    }
})
