/**
 * @file Toast.tsx
 * @description Toast notification element with timer-based cleanup hooks.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { type ToastMessage, useUIStore } from '../../store/uiStore';

export function Toast({ id, type, title, message, duration = 4000 }: ToastMessage) {
  const { removeToast } = useUIStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, removeToast]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-destructive" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const bgStyles = {
    success: 'bg-card border-emerald-500/30',
    error: 'bg-card border-destructive/30',
    warning: 'bg-card border-amber-500/30',
    info: 'bg-card border-blue-500/30',
  };

  return (
    <div
      className={`flex w-full max-w-sm gap-3 rounded-lg border p-4 shadow-lg ring-1 ring-black/5 animate-in slide-in-from-right-5 duration-200 ${bgStyles[type]}`}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      
      <div className="flex-1 space-y-1 text-left">
        <h4 className="text-xs font-bold text-foreground">{title}</h4>
        {message && <p className="text-[11px] leading-relaxed text-muted-foreground">{message}</p>}
      </div>

      <button
        onClick={() => removeToast(id)}
        className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default Toast;
