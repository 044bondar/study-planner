import { createContext } from 'react';
import type {
    FilterStatus,
    NewTaskData,
    Task,
    ToastMessage,
    UpdateTaskData,
} from '../types/task';

export interface TaskContextValue {
    tasks: Task[];
    filter: FilterStatus;
    setFilter: (filter: FilterStatus) => void;
    editingTask: Task | null;
    setEditingTask: (task: Task | null) => void;
    pendingDeleteTaskId: number | null;
    toast: ToastMessage | null;
    dismissToast: () => void;
    addTask: (data: NewTaskData) => void;
    updateTask: (id: number, data: UpdateTaskData) => void;
    toggleTask: (id: number) => void;
    requestDelete: (id: number) => void;
    undoDelete: () => void;
    clearCompleted: () => void;
    resetTasks: () => void;
}

export const TaskContext = createContext<TaskContextValue | null>(null);