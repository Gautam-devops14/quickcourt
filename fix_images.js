const fs = require('fs');

const SAFE_IMAGES_DECLARATION = `
const SAFE_SPORTS_IMAGES = [
  'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1558365849-6ebd8b0454b2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1622279457486-69d73ce28b09?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800'
];
`;

const replaceImagesInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Inject declaration after imports
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
        const nextNewLine = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, nextNewLine + 1) + SAFE_IMAGES_DECLARATION + content.slice(nextNewLine + 1);
    } else {
        content = SAFE_IMAGES_DECLARATION + content;
    }

    // Replace all loremflickr usages
    content = content.replace(
        /`https:\/\/loremflickr\.com\/[^`]+lock=\$\{([^}]+)\}`/g,
        `SAFE_SPORTS_IMAGES[Number($1) % SAFE_SPORTS_IMAGES.length]`
    );

    fs.writeFileSync(filePath, content);
};

['app/page.tsx', 'app/(public)/explore/page.tsx', 'app/(public)/venue/[id]/page.tsx'].forEach(replaceImagesInFile);
console.log('Images fixed');
