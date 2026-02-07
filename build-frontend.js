// build-frontend.js
const fs = require('fs');
const path = require('path');

console.log('🔨 Building frontend for Netlify...');

// Read all HTML files in public folder
const publicDir = path.join(__dirname, 'public');
const outputDir = path.join(__dirname, 'netlify-build');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Copy all files from public to netlify-build
function copyFolderSync(from, to) {
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach((element) => {
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

copyFolderSync(publicDir, outputDir);

console.log('✅ Frontend files copied to netlify-build/');
