const fs = require('fs');

let content = fs.readFileSync('app/(public)/payment/page.tsx', 'utf8');

// 1. Update PaymentMethod type
content = content.replace(
  `type PaymentMethod = 'upi' | 'card' | 'netbanking';`,
  `type PaymentMethod = 'upi' | 'card';`
);

// 2. Remove selectedBank state
content = content.replace(
  `  const [selectedBank, setSelectedBank] = useState('SBI Netbanking');\n`,
  ``
);

// 3. Update TAB_CONFIG to remove netbanking
content = content.replace(
  `    { key: 'netbanking', icon: 'account_balance', label: 'Net Banking', sub: 'SBI, HDFC, ICICI' },\n`,
  ``
);

// 4. Update grid from grid-cols-3 to grid-cols-2 for tabs
content = content.replace(
  `<div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">`,
  `<div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">`
);

// 5. Remove Net Banking form
const netBankingFormRegex = /\{\/\* Net Banking Form \*\/\}\s*\{method === 'netbanking' && \([\s\S]*?\}\)\}/;
content = content.replace(netBankingFormRegex, '');

// 6. Fix mobile layout: swap orders
content = content.replace(
  `<div className="order-1 lg:col-span-7 flex flex-col gap-4 lg:gap-6 w-full">`,
  `<div className="order-2 lg:order-1 lg:col-span-7 flex flex-col gap-4 lg:gap-6 w-full max-w-full overflow-hidden">`
);

content = content.replace(
  `<div className="order-2 lg:col-span-5 flex flex-col gap-4 lg:gap-5 lg:sticky top-24 w-full">`,
  `<div className="order-1 lg:order-2 lg:col-span-5 flex flex-col gap-4 lg:gap-5 lg:sticky top-24 w-full max-w-full overflow-hidden">`
);

// 7. Remove hidden lg:block wrapper around the CTA
const hiddenLgRegex = /\{\/\* Primary Action \(Desktop\) \*\/\}\s*<div className="hidden lg:block">\s*(<div className="pt-6 mt-6 border-t border-outline-variant space-y-3">[\s\S]*?<\/div>)\s*<\/div>/;
content = content.replace(hiddenLgRegex, `<!-- Primary Action -->\n            $1`);

// 8. Fix any overarching padding or overflow issues on the main container
content = content.replace(
  `<main className="flex-grow max-w-7xl w-full mx-auto px-3 py-4 sm:px-6 lg:px-12 sm:py-8">`,
  `<main className="flex-grow max-w-7xl w-full mx-auto px-3 py-4 sm:px-6 lg:px-12 sm:py-8 overflow-x-hidden">`
);

fs.writeFileSync('app/(public)/payment/page.tsx', content);
console.log('Payment page updated successfully.');
