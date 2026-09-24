const fs = require('fs');

const replaceInFile = (file, replacements) => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    for (const [find, replace] of replacements) {
        if (content.includes(find) || (find instanceof RegExp && find.test(content))) {
            content = content.replace(find, replace);
            changed = true;
        }
    }
    if (changed) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
};

replaceInFile('app/(public)/success/page.tsx', [
    ['TURNSTILE AUTHORIZED', 'BOOKING CONFIRMED'],
    ['Reservation Confirmed & Turnstile Synced!', 'Reservation Confirmed!'],
    ['Your court access PIN and digital pass have been activated.', 'Your booking has been successfully recorded.'],
    ['Enter through <strong>North Entrance B</strong>. Follow court lines toward your assigned court. Gear lockers are located immediately to the right of Turnstile #2.', 'Show your booking confirmation at the venue reception. Follow the signs to your assigned court.']
]);

replaceInFile('app/(public)/bookings/[id]/page.tsx', [
    ['Turnstile Activation', 'Check-in Process'],
    ['Turnstile auto-activates 15 minutes before scheduled match.', 'Please check in at the reception 15 minutes before your scheduled match.']
]);

replaceInFile('app/(public)/bookings/page.tsx', [
    ['Turnstile Confirmed', 'Booking Confirmed'],
    ['Turnstile Arrival Protocol', 'Arrival Protocol'],
    ['sensor_door', 'storefront'],
    ['Gates activate exactly 15 minutes before your scheduled match block.', 'Check in at reception 15 minutes before your scheduled match block.']
]);

replaceInFile('app/(public)/profile/page.tsx', [
    ['Turnstiles unlock upon code entry.', 'Show pass at reception upon arrival.']
]);

replaceInFile('app/(auth)/otp/page.tsx', [
    ['Turnstile Pass Sync', 'Instant Booking Sync'],
    ['Instant gate permissions', 'Fast confirmations']
]);

replaceInFile('app/(auth)/signup/page.tsx', [
    ['Turnstile Pass Sync', 'Instant Booking Sync']
]);

replaceInFile('app/(auth)/login/page.tsx', [
    ['Instant Turnstile Pass Sync', 'Instant Booking Sync']
]);

