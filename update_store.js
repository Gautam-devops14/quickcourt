const fs = require('fs');

let content = fs.readFileSync('contexts/StoreContext.tsx', 'utf8');

// Replace the imports
content = content.replace(
  `import { mockFacilities } from '@/data/mock';`,
  `import { demoUsers, demoFacilities, demoCourts, demoSlots, demoBookings } from '@/data/demoData';`
);

// We need to replace the blocks from 'const extendedFacilities' down to 'export const defaultUsers: User[] = [...];'
// Using regex to replace the entire chunk
const replaceRegex = /const extendedFacilities: Facility\[\] = \[\];[\s\S]*?export const defaultUsers: User\[\] = \[[\s\S]*?\];/;

const replacement = `
const extendedFacilities: Facility[] = demoFacilities;
const initialCourts: Court[] = demoCourts;
const initialSlots: TimeSlot[] = demoSlots;
export const defaultUsers: User[] = demoUsers;
`;

content = content.replace(replaceRegex, replacement);

fs.writeFileSync('contexts/StoreContext.tsx', content);
console.log('Updated StoreContext.tsx');
