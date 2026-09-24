export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 bg-surface-container-lowest">
      <div className="mb-10 border-b border-outline-variant/60 pb-6">
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-bold mb-2">Privacy Policy</h1>
        <p className="font-body-md text-on-surface-variant">Last updated: August 15, 2026</p>
      </div>

      <div className="prose prose-sm md:prose-base max-w-none text-on-surface space-y-6">
        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">1. Introduction</h2>
          <p className="font-body-md leading-relaxed">
            Welcome to QuickCourt. This Privacy Policy explains how we collect, use, and protect your personal information. Note that this application operates as a demonstration prototype.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">2. Information We Collect</h2>
          <p className="font-body-md leading-relaxed mb-2">We collect the following types of information when you use the platform:</p>
          <ul className="list-disc pl-5 font-body-md leading-relaxed space-y-1">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone/contact information if provided</li>
            <li>Account information (such as roles and credentials)</li>
            <li>Booking information and history</li>
            <li>Facility information for registered owners</li>
            <li>Information voluntarily submitted through forms</li>
          </ul>
          <p className="font-body-md leading-relaxed mt-2 text-on-surface-variant italic">
            Note: We do not collect information that this application is not programmed to handle in its current prototype state.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">3. How We Use Information</h2>
          <p className="font-body-md leading-relaxed">
            We use the collected information to facilitate court bookings, authenticate user sessions, manage facility listings, and enable the core functionalities of the QuickCourt platform.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">4. Booking & Facility Information</h2>
          <p className="font-body-md leading-relaxed">
            When a player books a court, necessary information (such as name and booking time) is shared with the respective facility owner to fulfill the reservation.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">5. Payment Information</h2>
          <p className="font-body-md leading-relaxed">
            <strong>Prototype Notice:</strong> The current prototype uses simulated payments and does not process real financial transactions. We do not collect, store, or transmit real credit card numbers or actual payment provider data.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">6. Data Storage</h2>
          <p className="font-body-md leading-relaxed">
            In this prototype version, data is stored locally in your browser (client-side LocalStorage). We do not currently transmit this data to a remote production database, though a production version would implement secure server-side storage.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">7. Cookies / Local Storage</h2>
          <p className="font-body-md leading-relaxed">
            We use browser LocalStorage and SessionStorage to persist your authentication state, bookings, and facility data across sessions.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">8. Information Sharing</h2>
          <p className="font-body-md leading-relaxed">
            We do not sell your personal information. Data is only shared between users and facility owners to the extent necessary to manage bookings.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">9. Data Security</h2>
          <p className="font-body-md leading-relaxed">
            Because this is a prototype, we do not claim enterprise-grade or server-side security. Please do not enter sensitive real-world information (like actual passwords you use elsewhere) into this demonstration application.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">10. Data Retention</h2>
          <p className="font-body-md leading-relaxed">
            Your data is retained in your browser&apos;s local storage until cleared. Resetting the prototype state will permanently erase this data.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">11. User Rights / Data Requests</h2>
          <p className="font-body-md leading-relaxed">
            You can modify or delete your data directly within the application or by clearing your browser&apos;s local storage data for this site.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">12. Children&apos;s Privacy</h2>
          <p className="font-body-md leading-relaxed">
            QuickCourt is not intended for use by children under 13. We do not knowingly collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">13. Changes to This Privacy Policy</h2>
          <p className="font-body-md leading-relaxed">
            We may update this policy as the platform evolves from prototype to production. Check this page for the latest version.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">14. Contact Information</h2>
          <p className="font-body-md leading-relaxed">
            For questions about privacy, please contact us at privacy@quickcourt.in.
          </p>
        </section>
      </div>
    </div>
  );
}

