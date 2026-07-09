/**
 * @file ToastContainer.tsx
 * @description Toast notifications stack container overlay.
 */


import Toast from './Toast';
import { useUIStore } from '../../store/uiStore';

export function ToastContainer() {
  const { toasts } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-3 px-4 md:px-0"
      aria-live="assertive"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

export default ToastContainer;
