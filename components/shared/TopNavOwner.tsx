"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { UserCircle, ShieldAlert } from 'lucide-react';

export function TopNavOwner() {
  const pathname = usePathname();

  const links = [
    { label: 'Dashboard', href: '/owner' },
    { label: 'Facilities', href: '/owner/facilities' },
    { label: 'Schedule', href: '/owner/schedule' },
    { label: 'Bookings', href: '/owner/bookings' },
  ];

  return (
    <header className="w-full h-16 px-margin md:px-margin-md lg:px-margin-lg flex items-center justify-between border-b border-outline-variant/40 bg-surface-container-lowest z-30 sticky top-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">QuickCourt Facility OS</Link>
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/50">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Arena Network
          </div>
        </div>
        <div className="h-6 w-px bg-outline-variant/50 hidden md:block"></div>
        
        <nav className="hidden md:flex items-center gap-space-lg">
          {links.map(link => {
            const isActive = link.href === '/owner' ? pathname === '/owner' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-label-lg text-label-lg transition-colors",
                  isActive
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-on-surface pb-1"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/owner/profile" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer transition-transform hover:scale-105">
          <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </Link>
      </div>
    </header>
  )
}
