import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const destDir = path.join(__dirname, '../client/public/images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Bypasses the corporate cert block
const agent = new https.Agent({ rejectUnauthorized: false });

const images = [
  { url: 'https://picsum.photos/seed/laptop11/800/800', name: 'laptop.jpg' },
  { url: 'https://picsum.photos/seed/earbuds11/800/800', name: 'earbuds.jpg' },
  { url: 'https://picsum.photos/seed/jacket11/800/800', name: 'jacket.jpg' },
  { url: 'https://picsum.photos/seed/coffee11/800/800', name: 'coffee.jpg' },
  { url: 'https://picsum.photos/seed/monitor11/800/800', name: 'monitor.jpg' },
  { url: 'https://picsum.photos/seed/game11/800/800', name: 'controller.jpg' }
];

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { agent }, (res) => {
      // Handle redirects (picsum does 302 redirects)
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading images bypassing corporate SSL proxy...');
  for (const img of images) {
    console.log(`Downloading ${img.name}...`);
    try {
      await downloadImage(img.url, path.join(destDir, img.name));
      console.log(`Saved ${img.name}`);
    } catch (err) {
      console.error(`Error downloading ${img.name}:`, err.message);
    }
  }
}

main();
