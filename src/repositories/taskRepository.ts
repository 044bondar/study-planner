import { httpClient } from '../api/httpClient';
import type {
    ApiTodo,
    NewTaskData,
    PaginatedTasks,
    Task,
    TodosResponse,
    UpdateTaskData,
} from '../types/task';

// Мапінг API DTO -> Domain Model
function toTask(dto: ApiTodo): Task {
    return {
        id: dto.id,
        title: dto.todo,
        description: `Навчальне завдання #${dto.id} (DummyJSON userId: ${dto.userId})`,
        completed: dto.completed,
        priority: dto.id % 3 === 0 ? 'high' : dto.id % 2 === 0 ? 'medium' : 'low',
        category: dto.userId % 2 === 0 ? 'React' : 'TypeScript',
    };
}

export const taskRepository = {
    async getAll(limit = 10, skip = 0, signal?: AbortSignal): Promise<PaginatedTasks> {
        const data = await httpClient<TodosResponse>(`/todos?limit=${limit}&skip=${skip}`, {
            method: 'GET',
            signal,
        });

        return {
            tasks: data.todos.map(toTask),
            total: data.total,
            skip: data.skip,
            limit: data.limit,
        };
    },

    async getById(id: number, signal?: AbortSignal): Promise<Task> {
        const dto = await httpClient<ApiTodo>(`/todos/${id}`, {
            method: 'GET',
            signal,
        });
        return toTask(dto);
    },

    async create(newTask: NewTaskData): Promise<Task> {
        const dto = await httpClient<ApiTodo>('/todos/add', {
            method: 'POST',
            body: {
                todo: newTask.title,
                completed: false,
                userId: 1,
            },
        });

        // Зберігаємо client-only metadata (description, priority, category), які не підтримує DummyJSON
        return {
            id: dto.id || Date.now(),
            title: dto.todo || newTask.title,
            description: newTask.description,
            completed: dto.completed ?? false,
            priority: newTask.priority,
            category: newTask.category,
        };
    },

    async update(id: number, data: UpdateTaskData): Promise<Partial<Task>> {
        const payload: Record<string, unknown> = {};
        if (data.title !== undefined) payload.todo = data.title;
        if (data.completed !== undefined) payload.completed = data.completed;

        // DummyJSON повертає 404 для щойно створених локально ID (> 254), тому обробляємо це коректно
        if (id <= 254 && Object.keys(payload).length > 0) {
            await httpClient<ApiTodo>(`/todos/${id}`, {
                method: 'PUT',
                body: payload,
            });
        }

        return data;
    },

    async delete(id: number): Promise<void> {
        if (id <= 254) {
            await httpClient<ApiTodo & { isDeleted: boolean }>(`/todos/${id}`, {
                method: 'DELETE',
            });
        }
    },
};