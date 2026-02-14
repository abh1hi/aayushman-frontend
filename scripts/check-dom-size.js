
import puppeteer from 'puppeteer';
import { pathToFileURL } from 'url';
import path from 'path';

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const filePath = path.resolve('./dist/index.html');
        await page.goto(pathToFileURL(filePath).href);

        const domSize = await page.evaluate(() => {
            return document.getElementsByTagName('*').length;
        });

        console.log(`DOM Size for index.html: ${domSize}`);

        if (domSize > 1500) {
            console.warn('WARNING: DOM size exceeds recommended limit of 1500 nodes.');
        } else {
            console.log('DOM size is within recommended limits (< 1500 nodes).');
        }

        await browser.close();
    } catch (error) {
        console.error('Error checking DOM size:', error);
        process.exit(1);
    }
})();
