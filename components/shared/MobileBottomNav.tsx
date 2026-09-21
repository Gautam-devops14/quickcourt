"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Compass, CalendarDays, User } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import Link from "next/link";

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, bookings } = useStore();

  const myBookings = currentUser 
    ? bookings.filter(b => b.userId === currentUser.id && b.status === "CONFIRMED")
    : [];
  const badgeCount = myBookings.length;

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Bookings", href: "/bookings", icon: CalendarDays, authRequired: true },
    { name: "Profile", href: "/profile", icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant/30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          const handlePress = (e: React.MouseEvent) => {
            if (item.authRequired && !currentUser) {
              e.preventDefault();
              router.push(`/login?redirect=${encodeURIComponent(item.href)}`);
            }
          };

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handlePress}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                {item.name === "Bookings" && badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-on-error">
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
