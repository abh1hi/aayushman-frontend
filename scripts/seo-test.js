
import SeoAnalyzer from 'seo-analyzer';

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputDir = './test-results';

// Ensure output directory exists (handled by Node usually, but good to check)
import fs from 'fs';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

new SeoAnalyzer()
    .inputFolders(['dist']) // Scan the dist folder directly for HTML files
    .addRule('titleLength', { min: 10, max: 60 })
    .addRule('metaDescription', { min: 10, max: 160 })
    .addRule('h1Tag', { min: 1, max: 1 })
    .addRule('noTooManyStrongTags', { threshold: 2 })
    .addRule('imgTagWithAltAttribute')
    .addRule('aTagWithRelAttribute')
    .addRule('canonicalLink')
    // Output results to console and file
    .outputConsole()
    .outputJson(`${outputDir}/seo-result-${timestamp}.json`)
    .run();
