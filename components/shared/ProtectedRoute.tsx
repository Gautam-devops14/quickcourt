"use client"
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/contexts/StoreContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('USER' | 'OWNER' | 'ADMIN')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      if (pathname.startsWith('/admin')) {
        router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (pathname.startsWith('/owner')) {
        router.push(`/owner/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    } else if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [currentUser, router, pathname, allowedRoles]);

  if (!isAuthorized) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
