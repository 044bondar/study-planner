import {
    useReducer,
    useEffect,
    useState,
    useCallback,
    useMemo,
    type ReactNode,
} from 'react';
import { initialTasks } from '../data/initialTasks';
import {
    taskReducer,
    createInitialTaskState,
    UNDO_DURATION_MS,
} from '../reducers/taskReducer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TaskContext, type TaskContextValue } from './taskContextInstance';
import type {
    FilterStatus,
    NewTaskData,
    Task,
    ToastMessage,
    UpdateTaskData,
} from '../types/task';

const TASKS_STORAGE_KEY = 'study-planner:tasks';
const FILTER_STORAGE_KEY = 'study-planner:filter';

function loadTasksFromStorage(): Task[] {
    try {
        const raw = localStorage.getItem(TASKS_STORAGE_KEY);
        if (!raw) return initialTasks;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : initialTasks;
    } catch {
        return initialTasks;
    }
}

export function TaskProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(
        taskReducer,
        undefined,
        () => createInitialTaskState(loadTasksFromStorage())
    );

    const [filter, setFilter] = useLocalStorage<FilterStatus>(FILTER_STORAGE_KEY, 'all');
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const showToast = useCallback(
        (text: string, type: ToastMessage['type'] = 'info', duration = 3000, canUndo = false) => {
            setToast({
                id: Date.now(),
                text,
                type,
                canUndo,
                expiresAt: Date.now() + duration,
            });
        },
        []
    );

    const dismissToast = useCallback(() => setToast(null), []);

    // 1. Збереження tasks у localStorage при кожній зміні
    useEffect(() => {
        try {
            localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(state.tasks));
        } catch (error) {
            console.error('Failed to persist tasks:', error);
        }
    }, [state.tasks]);

    // 2. Синхронізація заголовка вкладки браузера з кількістю невиконаних завдань
    useEffect(() => {
        const activeCount = state.tasks.filter((t) => !t.completed).length;
        document.title = `Study Planner — ${activeCount} active tasks`;
    }, [state.tasks]);

    // 3. Таймер для Undoable Delete з обов'язковим cleanup через clearTimeout
    useEffect(() => {
        if (!state.pendingDelete) return;

        const timerId = window.setTimeout(() => {
            dispatch({ type: 'confirmDelete' });
            showToast('Завдання остаточно видалено', 'info', 2500);
        }, UNDO_DURATION_MS);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [state.pendingDelete, showToast]);

    // 4. Автоматичне закриття звичайних Toast-повідомлень
    useEffect(() => {
        if (!toast || toast.canUndo || !toast.expiresAt) return;

        const remaining = Math.max(0, toast.expiresAt - Date.now());
        const timerId = window.setTimeout(() => {
            setToast(null);
        }, remaining);

        return () => window.clearTimeout(timerId);
    }, [toast]);

    const addTask = useCallback(
        (data: NewTaskData) => {
            dispatch({ type: 'add', payload: data });
            showToast('Завдання успішно створено', 'success');
        },
        [showToast]
    );

    const updateTask = useCallback(
        (id: number, data: UpdateTaskData) => {
            dispatch({ type: 'update', payload: { id, data } });
            setEditingTask(null);
            showToast('Завдання оновлено', 'success');
        },
        [showToast]
    );

    const toggleTask = useCallback((id: number) => {
        dispatch({ type: 'toggle', payload: id });
    }, []);

    const requestDelete = useCallback(
        (id: number) => {
            if (editingTask?.id === id) setEditingTask(null);
            dispatch({ type: 'requestDelete', payload: id });
            showToast('Завдання буде видалено через 5 сек...', 'undo', UNDO_DURATION_MS, true);
        },
        [editingTask, showToast]
    );

    const undoDelete = useCallback(() => {
        dispatch({ type: 'undoDelete' });
        showToast('Видалення скасовано', 'success', 2000);
    }, [showToast]);

    const clearCompleted = useCallback(() => {
        dispatch({ type: 'clearCompleted' });
        showToast('Виконані завдання очищено', 'info');
    }, [showToast]);

    const resetTasks = useCallback(() => {
        dispatch({ type: 'reset', payload: initialTasks });
        setEditingTask(null);
        showToast('Дані скинуто до початкових', 'info');
    }, [showToast]);

    const value = useMemo<TaskContextValue>(
        () => ({
            tasks: state.tasks,
            filter,
            setFilter,
            editingTask,
            setEditingTask,
            pendingDeleteTaskId: state.pendingDelete?.task.id ?? null,
            toast,
            dismissToast,
            addTask,
            updateTask,
            toggleTask,
            requestDelete,
            undoDelete,
            clearCompleted,
            resetTasks,
        }),
        [
            state.tasks,
            state.pendingDelete,
            filter,
            setFilter,
            editingTask,
            toast,
            dismissToast,
            addTask,
            updateTask,
            toggleTask,
            requestDelete,
            undoDelete,
            clearCompleted,
            resetTasks,
        ]
    );

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}