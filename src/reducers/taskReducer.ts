import type { Task, TaskAction, TaskState } from '../types/task';

export const UNDO_DURATION_MS = 5000;

export function createInitialTaskState(initialTasks: Task[]): TaskState {
    return {
        tasks: initialTasks,
        pendingDelete: null,
    };
}

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case 'add': {
            const newTask: Task = {
                ...action.payload,
                id: Date.now(),
                completed: false,
            };
            return {
                ...state,
                tasks: [newTask, ...state.tasks],
            };
        }

        case 'toggle': {
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.payload ? { ...task, completed: !task.completed } : task
                ),
            };
        }

        case 'update': {
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.payload.id ? { ...task, ...action.payload.data } : task
                ),
            };
        }

        case 'requestDelete': {
            // Якщо вже є інше активне видалення, спочатку остаточно видаляємо його
            const baseTasks = state.pendingDelete
                ? state.tasks.filter((t) => t.id !== state.pendingDelete!.task.id)
                : state.tasks;

            const targetTask = baseTasks.find((t) => t.id === action.payload);
            if (!targetTask) return state;

            return {
                tasks: baseTasks,
                pendingDelete: {
                    task: targetTask,
                    expiresAt: Date.now() + UNDO_DURATION_MS,
                },
            };
        }

        case 'confirmDelete': {
            if (!state.pendingDelete) return state;
            const deleteId = state.pendingDelete.task.id;
            return {
                tasks: state.tasks.filter((task) => task.id !== deleteId),
                pendingDelete: null,
            };
        }

        case 'undoDelete': {
            return {
                ...state,
                pendingDelete: null,
            };
        }

        case 'clearCompleted': {
            return {
                ...state,
                tasks: state.tasks.filter((task) => !task.completed),
                pendingDelete:
                    state.pendingDelete && state.pendingDelete.task.completed ? null : state.pendingDelete,
            };
        }

        case 'reset': {
            return {
                tasks: action.payload,
                pendingDelete: null,
            };
        }

        default:
            return state;
    }
}