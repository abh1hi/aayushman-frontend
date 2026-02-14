import SeoAnalyzer from 'seo-analyzer';
import fs from 'fs';
import path from 'path';

// Helper to get all HTML files recursively
function getHtmlFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getHtmlFiles(filePath, fileList);
        } else {
            if (file.endsWith('.html')) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

const distPath = path.resolve('./dist');
console.log(`Scanning for HTML files in: ${distPath}`);
const files = getHtmlFiles(distPath);
console.log(`Found ${files.length} HTML files.`);

if (files.length === 0) {
    console.error("No HTML files found in dist! Aborting.");
    process.exit(1);
}

new SeoAnalyzer()
    .inputFiles(files)
    .useRule('titleLengthRule', { min: 10, max: 70 })
    .useRule('metaBaseRule', { list: ['description', 'viewport'] })
    .useRule('metaSocialRule', { properties: ['og:title', 'og:description', 'og:image'] })
    .useRule('imgTagWithAltAttributeRule')

    .useRule('canonicalLinkRule')
    .outputConsole()
    .run();
