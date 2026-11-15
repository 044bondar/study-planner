export type Priority = 'low' | 'medium' | 'high';
export type FilterStatus = 'all' | 'completed' | 'active';

// Domain model (використовується в UI)
export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    priority: Priority;
    category: string;
}

export type NewTaskData = Omit<Task, 'id' | 'completed'>;
export type UpdateTaskData = Partial<Omit<Task, 'id'>>;

// API DTO (модель DummyJSON)
export interface ApiTodo {
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
}

export interface TodosResponse {
    todos: ApiTodo[];
    total: number;
    skip: number;
    limit: number;
}

export interface PaginatedTasks {
    tasks: Task[];
    total: number;
    skip: number;
    limit: number;
}

export interface ToastMessage {
    id: number;
    text: string;
    type: 'success' | 'info' | 'error';
}