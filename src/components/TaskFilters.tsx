import { useTaskContext } from '../hooks/useTaskContext';
import type { FilterStatus } from '../types/task';
import './TaskFilters.scss';

export function TaskFilters() {
    const { tasks, filter, setFilter, clearCompleted, resetTasks } = useTaskContext();

    const completedCount = tasks.filter((t) => t.completed).length;
    const counts = {
        all: tasks.length,
        active: tasks.length - completedCount,
        completed: completedCount,
    };

    const filters: { key: FilterStatus; label: string; count: number }[] = [
        { key: 'all', label: 'Всі', count: counts.all },
        { key: 'active', label: 'Не виконані', count: counts.active },
        { key: 'completed', label: 'Виконані', count: counts.completed },
    ];

    return (
        <div
            className="task-filters"
            style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}
        >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
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

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {completedCount > 0 && (
                    <button type="button" className="task-filters__btn" onClick={clearCompleted}>
                        Очистити виконані
                    </button>
                )}
                <button type="button" className="task-filters__btn" onClick={resetTasks}>
                    Скинути дані
                </button>
            </div>
        </div>
    );
}