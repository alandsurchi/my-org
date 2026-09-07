import React from 'react';
import { AlertTriangle, RefreshCw, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title: string;
  detail?: string;
  icon?: LucideIcon;
  onRetry?: () => void;
  retryLabel?: string;
}

const ErrorState = ({ title, detail, icon: Icon = AlertTriangle, onRetry, retryLabel }: ErrorStateProps) => (
  <div role="alert" className="card-surface flex flex-col items-center p-10 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
      <Icon className="h-7 w-7" aria-hidden="true" />
    </div>
    <p className="font-display text-h3 text-destructive">{title}</p>
    {detail && <p className="mt-2 max-w-md text-muted-foreground">{detail}</p>}
    {onRetry && retryLabel && (
      <Button variant="outline" className="mt-6" onClick={onRetry}>
        <RefreshCw aria-hidden="true" />
        {retryLabel}
      </Button>
    )}
  </div>
);

export default ErrorState;
