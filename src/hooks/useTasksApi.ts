import { useState, useEffect, useCallback } from 'react';
import { taskRepository } from '../repositories/taskRepository';
import type { NewTaskData, Task, UpdateTaskData } from '../types/task';

export const PAGE_LIMIT = 10;

export function useTasksApi(onNotify: (text: string, type?: 'success' | 'info' | 'error') => void) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    // Завантаження списку з пагінацією + скасування попереднього запиту через AbortController
    useEffect(() => {
        const controller = new AbortController();
        const skip = (page - 1) * PAGE_LIMIT;

        async function fetchTasks() {
            setIsLoading(true);
            setError(null);

            try {
                const result = await taskRepository.getAll(PAGE_LIMIT, skip, controller.signal);
                setTasks(result.tasks);
                setTotal(result.total);
            } catch (err) {
                // Скасований запит не є помилкою для користувача
                if (err instanceof DOMException && err.name === 'AbortError') {
                    return;
                }
                setError(err instanceof Error ? err.message : 'Не вдалося завантажити завдання');
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        fetchTasks();

        return () => {
            controller.abort();
        };
    }, [page, reloadTrigger]);

    // Синхронізація заголовка вкладки браузера
    useEffect(() => {
        const activeCount = tasks.filter((t) => !t.completed).length;
        document.title = `Study Planner (Page ${page}) — ${activeCount} active`;
    }, [tasks, page]);

    const retry = useCallback(() => {
        setReloadTrigger((prev) => prev + 1);
    }, []);

    const addTask = useCallback(
        async (data: NewTaskData) => {
            try {
                const created = await taskRepository.create(data);
                setTasks((prev) => [created, ...prev]);
                setTotal((prev) => prev + 1);
                onNotify('Завдання створено через REST API', 'success');
            } catch (err) {
                onNotify(err instanceof Error ? err.message : 'Помилка створення завдання', 'error');
                throw err;
            }
        },
        [onNotify]
    );

    const toggleTask = useCallback(
        async (task: Task) => {
            const nextCompleted = !task.completed;
            try {
                await taskRepository.update(task.id, { completed: nextCompleted });
                setTasks((prev) =>
                    prev.map((item) =>
                        item.id === task.id ? { ...item, completed: nextCompleted } : item
                    )
                );
                onNotify('Статус завдання оновлено', 'info');
            } catch (err) {
                onNotify(err instanceof Error ? err.message : 'Помилка оновлення статусу', 'error');
            }
        },
        [onNotify]
    );

    const updateTask = useCallback(
        async (id: number, data: UpdateTaskData) => {
            try {
                await taskRepository.update(id, data);
                setTasks((prev) =>
                    prev.map((item) => (item.id === id ? { ...item, ...data } : item))
                );
                onNotify('Завдання успішно оновлено', 'success');
            } catch (err) {
                onNotify(err instanceof Error ? err.message : 'Помилка редагування завдання', 'error');
                throw err;
            }
        },
        [onNotify]
    );

    const deleteTask = useCallback(
        async (id: number) => {
            try {
                await taskRepository.delete(id);
                setTasks((prev) => prev.filter((item) => item.id !== id));
                setTotal((prev) => Math.max(0, prev - 1));
                onNotify('Завдання видалено', 'info');
            } catch (err) {
                onNotify(err instanceof Error ? err.message : 'Помилка видалення завдання', 'error');
            }
        },
        [onNotify]
    );

    const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

    return {
        tasks,
        total,
        page,
        totalPages,
        setPage,
        isLoading,
        error,
        retry,
        addTask,
        toggleTask,
        updateTask,
        deleteTask,
    };
}