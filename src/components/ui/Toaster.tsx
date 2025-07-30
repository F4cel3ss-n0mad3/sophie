import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToasterProps {
  toasts?: Toast[];
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastColors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

let toastQueue: Toast[] = [];
let toastListeners: ((toasts: Toast[]) => void)[] = [];

export const addToast = (message: string, type: Toast['type'] = 'info', duration = 5000) => {
  const toast: Toast = {
    id: Date.now().toString(),
    message,
    type,
    duration,
  };

  toastQueue = [...toastQueue, toast];
  toastListeners.forEach(listener => listener(toastQueue));

  // Auto remove after duration
  setTimeout(() => {
    removeToast(toast.id);
  }, duration);
};

export const removeToast = (id: string) => {
  toastQueue = toastQueue.filter(toast => toast.id !== id);
  toastListeners.forEach(listener => listener(toastQueue));
};

export function Toaster({ toasts: propToasts }: ToasterProps) {
  const [internalToasts, setInternalToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toasts: Toast[]) => setInternalToasts(toasts);
    toastListeners.push(listener);

    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  const toasts = propToasts || internalToasts;

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-lg border shadow-lg max-w-sm transition-all duration-300 ${toastColors[toast.type]}`}
          >
            <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}