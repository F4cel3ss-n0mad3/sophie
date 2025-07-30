import { addToast, Toast } from '../components/ui/Toaster';

export function useToast() {
  const showToast = (message: string, type: Toast['type'] = 'info', duration?: number) => {
    addToast(message, type, duration);
  };

  return { showToast };
}