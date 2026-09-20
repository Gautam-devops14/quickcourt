"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { UserCircle, ShieldAlert } from 'lucide-react';

export function TopNavAdmin() {
  const pathname = usePathname();

  const links = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Approvals', href: '/admin/approvals' },
    { label: 'Users', href: '/admin/users' },
  ];

  return (
    <header className="sticky top-0 z-40 flex justify-between items-center w-full px-margin md:px-margin-md lg:px-margin-lg h-16 bg-surface-container-lowest border-b border-outline-variant/40 transition-colors duration-150 ease-in-out">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">QuickCourt</span>
          <span className="px-2 py-0.5 rounded font-label-sm text-label-sm font-semibold bg-error-container text-on-error-container flex items-center">
            <ShieldAlert className="w-3 h-3 mr-1" /> ADMIN
          </span>
        </Link>
        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
          {links.map(link => {
            const isActive = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex items-center px-1 pt-1 border-b-2 font-label-lg text-label-lg font-medium transition-colors h-16",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:border-outline hover:text-on-surface"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
      <div className="flex items-center">
         <Link href="/admin/profile" className="w-8 h-8 rounded-full bg-error flex items-center justify-center cursor-pointer transition-transform hover:scale-105">
            <span className="material-symbols-outlined text-on-error text-[18px]">admin_panel_settings</span>
         </Link>
      </div>
    </header>
  )
}
