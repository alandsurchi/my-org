import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => (
  <div className="card-surface flex flex-col items-center p-10 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <Icon className="h-7 w-7" aria-hidden="true" />
    </div>
    <p className="font-display text-h3">{title}</p>
    {description && <p className="mt-2 max-w-md text-muted-foreground">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
