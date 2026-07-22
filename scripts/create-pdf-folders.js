const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'private', 'guides');

const languages = ['en', 'ko', 'zh', 'fr', 'ja'];
const categories = ['1_esim', '2_prepaid', '3_major_device', '4_major_sim', '5_mvno'];

// Create base directory
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// Create language and category folders
languages.forEach(lang => {
  const langDir = path.join(baseDir, lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir);
  }
  
  categories.forEach(category => {
    const catDir = path.join(langDir, category);
    if (!fs.existsSync(catDir)) {
      fs.mkdirSync(catDir);
    }
  });
});

console.log('PDF folder hierarchy created successfully at /private/guides/');
