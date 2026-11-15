import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TaskContext, type UiContextValue } from './taskContextInstance';
import type { FilterStatus, ToastMessage } from '../types/task';

const FILTER_STORAGE_KEY = 'study-planner:filter';

export function TaskProvider({ children }: { children: ReactNode }) {
    const [filter, setFilter] = useLocalStorage<FilterStatus>(FILTER_STORAGE_KEY, 'all');
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const showToast = useCallback((text: string, type: ToastMessage['type'] = 'info') => {
        setToast({ id: Date.now(), text, type });
    }, []);

    const dismissToast = useCallback(() => setToast(null), []);

    useEffect(() => {
        if (!toast) return;
        const timerId = window.setTimeout(() => setToast(null), 3000);
        return () => window.clearTimeout(timerId);
    }, [toast]);

    const value = useMemo<UiContextValue>(
        () => ({ filter, setFilter, toast, showToast, dismissToast }),
        [filter, setFilter, toast, showToast, dismissToast]
    );

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}