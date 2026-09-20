const fs = require('fs');
const glob = require('glob'); // Not available unless installed, so I'll write a simple recursive function

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        arrayOfFiles.push(dirPath + "/" + file);
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles('./app');

// Tailwind class mappings based on MD3 Stitch DESIGN.md
const mappings = [
  { regex: /\bbg-white\b/g, replacement: 'bg-surface-container-lowest' },
  { regex: /\bbg-gray-50\b/g, replacement: 'bg-surface' },
  { regex: /\bbg-gray-100\b/g, replacement: 'bg-surface-container-low' },
  { regex: /\bbg-gray-200\b/g, replacement: 'bg-surface-container' },
  { regex: /\bbg-green-50\b/g, replacement: 'bg-primary-fixed' },
  { regex: /\bbg-green-100\b/g, replacement: 'bg-primary-fixed-dim' },
  { regex: /\bbg-green-600\b/g, replacement: 'bg-primary text-on-primary' },
  { regex: /\bbg-green-700\b/g, replacement: 'bg-primary-container text-on-primary-container' },
  { regex: /\bbg-red-50\b/g, replacement: 'bg-error-container text-on-error-container' },
  { regex: /\bbg-red-600\b/g, replacement: 'bg-error text-on-error' },
  { regex: /\bbg-blue-50\b/g, replacement: 'bg-secondary-container text-on-secondary-container' },
  { regex: /\bbg-blue-600\b/g, replacement: 'bg-secondary text-on-secondary' },

  { regex: /\btext-gray-900\b/g, replacement: 'text-on-surface' },
  { regex: /\btext-gray-800\b/g, replacement: 'text-on-surface' },
  { regex: /\btext-gray-700\b/g, replacement: 'text-on-surface-variant' },
  { regex: /\btext-gray-600\b/g, replacement: 'text-on-surface-variant' },
  { regex: /\btext-gray-500\b/g, replacement: 'text-on-surface-variant' },
  { regex: /\btext-green-600\b/g, replacement: 'text-primary' },
  { regex: /\btext-red-600\b/g, replacement: 'text-error' },
  { regex: /\btext-blue-600\b/g, replacement: 'text-secondary' },

  { regex: /\bborder-gray-200\b/g, replacement: 'border-outline-variant/50' },
  { regex: /\bborder-gray-300\b/g, replacement: 'border-outline' },
  { regex: /\bborder-green-200\b/g, replacement: 'border-primary/30' },
  { regex: /\bborder-green-500\b/g, replacement: 'border-primary' },
  { regex: /\bborder-red-200\b/g, replacement: 'border-error/30' },
  { regex: /\bborder-red-500\b/g, replacement: 'border-error' },

  { regex: /\btext-3xl\b/g, replacement: 'font-headline-lg text-headline-lg' },
  { regex: /\btext-2xl\b/g, replacement: 'font-headline-md text-headline-md' },
  { regex: /\btext-xl\b/g, replacement: 'font-headline-sm text-headline-sm' },
  { regex: /\btext-lg\b/g, replacement: 'font-body-lg text-body-lg' },
  { regex: /\btext-sm\b/g, replacement: 'font-body-sm text-body-sm' },
  { regex: /\btext-xs\b/g, replacement: 'font-label-sm text-label-sm' },
  
  { regex: /\brounded-md\b/g, replacement: 'rounded-lg' },
  { regex: /\brounded-lg\b/g, replacement: 'rounded-xl' },
  { regex: /\bshadow-sm\b/g, replacement: 'shadow-sm border border-outline-variant/50' },
  { regex: /\bshadow\b/g, replacement: 'shadow-sm border border-outline-variant/50' },
  { regex: /\bshadow-md\b/g, replacement: 'shadow-md border border-outline-variant/50' }
];

let changedFiles = 0;
files.forEach(file => {
  // Skip the ones already migrated or don't need it
  if (file.includes('globals.css') || file.includes('app/page.tsx')) return;

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  mappings.forEach(map => {
    content = content.replace(map.regex, map.replacement);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log(`Updated ${file}`);
  }
});
console.log(`Total files updated: ${changedFiles}`);

