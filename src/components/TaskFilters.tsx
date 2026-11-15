import { useTaskContext } from '../hooks/useTaskContext';
import type { FilterStatus, Task } from '../types/task';
import './TaskFilters.scss';

export function TaskFilters({ tasks }: { tasks: Task[] }) {
    const { filter, setFilter } = useTaskContext();

    const completedCount = tasks.filter((t) => t.completed).length;
    const filters: { key: FilterStatus; label: string; count: number }[] = [
        { key: 'all', label: 'Всі', count: tasks.length },
        { key: 'active', label: 'Не виконані', count: tasks.length - completedCount },
        { key: 'completed', label: 'Виконані', count: completedCount },
    ];

    return (
        <div className="task-filters">
            {filters.map((item) => (
                <button
                    key={item.key}
                    type="button"
                    className={`task-filters__btn ${
                        filter === item.key ? 'task-filters__btn--active' : ''
                    }`}
                    onClick={() => setFilter(item.key)}
                >
                    {item.label} ({item.count})
                </button>
            ))}
        </div>
    );
}