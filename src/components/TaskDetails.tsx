import { useState, useEffect } from 'react';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';
import './TaskDetails.scss';

interface TaskDetailsProps {
    taskId: number;
    fallbackTask?: Task;
    onClose: () => void;
}

export function TaskDetails({ taskId, fallbackTask, onClose }: TaskDetailsProps) {
    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        async function loadDetails() {
            setIsLoading(true);
            setError(null);

            try {
                // Для локально створених завдань (ID > 254) DummyJSON повертає 404, тому беремо дані з fallbackTask
                if (taskId > 254 && fallbackTask) {
                    setTask(fallbackTask);
                    setIsLoading(false);
                    return;
                }

                const fetched = await taskRepository.getById(taskId, controller.signal);
                setTask(fallbackTask ? { ...fetched, ...fallbackTask } : fetched);
            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') return;
                setError(err instanceof Error ? err.message : 'Помилка завантаження деталей');
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        loadDetails();

        return () => controller.abort();
    }, [taskId, fallbackTask, retryCount]);

    return (
        <section className="task-details">
            <div className="task-details__header">
                <h2 className="task-details__title">Деталі завдання #{taskId}</h2>
                <button type="button" className="task-details__close" onClick={onClose}>
                    Закрити
                </button>
            </div>

            {isLoading && <p className="task-details__status">Loading details...</p>}

            {error && (
                <div className="task-details__status task-details__status--error">
                    <p>Помилка завантаження деталей: {error}</p>
                    <button
                        type="button"
                        className="task-filters__btn"
                        style={{ marginTop: '0.5rem' }}
                        onClick={() => setRetryCount((c) => c + 1)}
                    >
                        Спробувати ще
                    </button>
                </div>
            )}

            {!isLoading && !error && task && (
                <div>
                    <p>
                        <strong>Назва:</strong> {task.title}
                    </p>
                    <p style={{ marginTop: '0.35rem' }}>
                        <strong>Опис:</strong> {task.description || 'Без опису'}
                    </p>
                    <div className="task-details__grid">
                        <div>
                            <strong>Категорія:</strong> {task.category}
                        </div>
                        <div>
                            <strong>Пріоритет:</strong> {task.priority}
                        </div>
                        <div>
                            <strong>Статус:</strong> {task.completed ? 'Виконано' : 'Не виконано'}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}