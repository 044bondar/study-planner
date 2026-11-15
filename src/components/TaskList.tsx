import { useTaskContext } from '../hooks/useTaskContext';
import type { Task } from '../types/task';
import { TaskItem } from './TaskItem';
import './TaskList.scss';

interface TaskListProps {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
    onSelectTask: (id: number) => void;
    onToggleTask: (task: Task) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: number) => void;
}

export function TaskList({
                             tasks,
                             isLoading,
                             error,
                             onRetry,
                             onSelectTask,
                             onToggleTask,
                             onEditTask,
                             onDeleteTask,
                         }: TaskListProps) {
    const { filter } = useTaskContext();

    if (isLoading) {
        return (
            <div className="task-list__empty">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="task-list__empty" style={{ color: '#dc2626' }}>
                <p>Помилка завантаження: {error}</p>
                <button
                    type="button"
                    className="task-filters__btn"
                    style={{ marginTop: '0.75rem' }}
                    onClick={onRetry}
                >
                    Спробувати ще
                </button>
            </div>
        );
    }

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'active') return !task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        return (
            <div className="task-list__empty">
                <p>Завдань не знайдено.</p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {filteredTasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onSelect={onSelectTask}
                    onToggle={onToggleTask}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                />
            ))}
        </div>
    );
}