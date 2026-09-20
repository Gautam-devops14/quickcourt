const fs = require('fs');
const path = require('path');

const designPath = '/Users/gautammali/Documents/quickcourt/stitch_ui/stitch_quickcourt_sports_booking_platform/athletic_modern_minimalist/DESIGN.md';
const content = fs.readFileSync(designPath, 'utf8');

const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
if (!frontmatterMatch) {
  console.error("No frontmatter found");
  process.exit(1);
}

const yamlStr = frontmatterMatch[1];
const colors = {};
const spacing = {};
const typography = {};
const rounded = {};
let currentSection = null;
let currentSubSection = null;

yamlStr.split('\n').forEach(line => {
  if (line.startsWith('colors:')) currentSection = 'colors';
  else if (line.startsWith('spacing:')) currentSection = 'spacing';
  else if (line.startsWith('typography:')) { currentSection = 'typography'; currentSubSection = null; }
  else if (line.startsWith('rounded:')) currentSection = 'rounded';
  else if (line.startsWith('  ') && currentSection) {
    if (currentSection === 'typography' && !line.includes(': ')) {
        // e.g. "  display-lg:"
        currentSubSection = line.trim().replace(':', '');
    } else {
        const [key, ...valParts] = line.trim().split(':');
        const val = valParts.join(':').trim().replace(/['"]/g, '');
        if (key && val) {
            if (currentSection === 'typography' && currentSubSection) {
                if (!typography[currentSubSection]) typography[currentSubSection] = {};
                typography[currentSubSection][key] = val;
            } else if (currentSection === 'colors') {
                colors[key] = val;
            } else if (currentSection === 'spacing') {
                spacing[key] = val;
            } else if (currentSection === 'rounded') {
                rounded[key] = val;
            }
        }
    }
  }
});

let tailwindConfig = `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
`;
for (const [k, v] of Object.entries(colors)) {
    tailwindConfig += `        "${k}": "${v}",\n`;
}
tailwindConfig += `      },\n      spacing: {\n`;
for (const [k, v] of Object.entries(spacing)) {
    tailwindConfig += `        "${k}": "${v}",\n`;
}
tailwindConfig += `      },\n      borderRadius: {\n`;
for (const [k, v] of Object.entries(rounded)) {
    let keyName = k === 'DEFAULT' ? 'DEFAULT' : k;
    tailwindConfig += `        "${keyName}": "${v}",\n`;
}
tailwindConfig += `      },\n      fontSize: {\n`;
for (const [k, v] of Object.entries(typography)) {
    // Convert to Tailwind fontSize config: [fontSize, { lineHeight, letterSpacing, fontWeight }]
    tailwindConfig += `        "${k}": ["${v.fontSize}", { lineHeight: "${v.lineHeight}", letterSpacing: "${v.letterSpacing}", fontWeight: "${v.fontWeight}" }],\n`;
}
// font families
const fontFamilies = new Set();
for (const [k, v] of Object.entries(typography)) {
    if (v.fontFamily) fontFamilies.add(v.fontFamily);
}
tailwindConfig += `      },\n      fontFamily: {\n`;
for (const font of fontFamilies) {
    let name = font.toLowerCase().replace(/ /g, '-');
    tailwindConfig += `        "${name}": ["${font}", "sans-serif"],\n`;
}
tailwindConfig += `        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],\n`;
tailwindConfig += `      }\n    },\n  },\n  plugins: [],\n};\nexport default config;\n`;

fs.writeFileSync('/Users/gautammali/Documents/quickcourt/tailwind.config.ts', tailwindConfig);
console.log("Updated tailwind.config.ts");

