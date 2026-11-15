import { createContext } from 'react';
import type { FilterStatus, ToastMessage } from '../types/task';

export interface UiContextValue {
    filter: FilterStatus;
    setFilter: (filter: FilterStatus) => void;
    toast: ToastMessage | null;
    showToast: (text: string, type?: ToastMessage['type']) => void;
    dismissToast: () => void;
}

export const TaskContext = createContext<UiContextValue | null>(null);