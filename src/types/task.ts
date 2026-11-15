export type Priority = 'low' | 'medium' | 'high';
export type FilterStatus = 'all' | 'completed' | 'active';

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    priority: Priority;
    category: string;
}

export type NewTaskData = Omit<Task, 'id' | 'completed'>;
export type UpdateTaskData = Partial<NewTaskData>;

export interface PendingDelete {
    task: Task;
    expiresAt: number;
}

export interface ToastMessage {
    id: number;
    text: string;
    type: 'success' | 'info' | 'error' | 'undo';
    canUndo?: boolean;
    expiresAt?: number;
}

export interface TaskState {
    tasks: Task[];
    pendingDelete: PendingDelete | null;
}

export type TaskAction =
    | { type: 'add'; payload: NewTaskData }
    | { type: 'toggle'; payload: number }
    | { type: 'update'; payload: { id: number; data: UpdateTaskData } }
    | { type: 'requestDelete'; payload: number }
    | { type: 'confirmDelete' }
    | { type: 'undoDelete' }
    | { type: 'clearCompleted' }
    | { type: 'reset'; payload: Task[] };