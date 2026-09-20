import * as React from "react"
import { cn } from "@/lib/utils"

type StatusType = 'AVAILABLE' | 'BOOKED' | 'LOCKED' | 'BLOCKED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'DRAFT' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export function StatusPill({ status, className }: { status: StatusType; className?: string }) {
  const styles: Record<StatusType, string> = {
    AVAILABLE: 'bg-primary-fixed text-secondary border-primary/30',
    APPROVED: 'bg-primary-fixed text-secondary border-primary/30',
    CONFIRMED: 'bg-primary-fixed text-secondary border-primary/30',
    COMPLETED: 'bg-neutral text-white border-neutral',
    BOOKED: 'bg-surface-container-low text-on-surface-variant border-outline-variant/50',
    LOCKED: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    BLOCKED: 'bg-surface-container text-on-surface-variant border-outline',
    REJECTED: 'bg-error-bg text-error-text border-error-border',
    CANCELLED: 'bg-error-bg text-error-text border-error-border',
    DRAFT: 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/50',
  }

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold border", styles[status], className)}>
      {status}
    </span>
  )
}

