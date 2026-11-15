import type { FilterStatus } from '../types/task';
import './TaskFilters.scss';

interface TaskFiltersProps {
    currentFilter: FilterStatus;
    counts: { all: number; active: number; completed: number };
    onFilterChange: (filter: FilterStatus) => void;
}

export function TaskFilters({ currentFilter, counts, onFilterChange }: TaskFiltersProps) {
    const filters: { key: FilterStatus; label: string; count: number }[] = [
        { key: 'all', label: 'Всі', count: counts.all },
        { key: 'active', label: 'Не виконані', count: counts.active },
        { key: 'completed', label: 'Виконані', count: counts.completed },
    ];

    return (
        <div className="task-filters">
            {filters.map((item) => (
                <button
                    key={item.key}
                    type="button"
                    className={`task-filters__btn ${
                        currentFilter === item.key ? 'task-filters__btn--active' : ''
                    }`}
                    onClick={() => onFilterChange(item.key)}
                >
                    {item.label} ({item.count})
                </button>
            ))}
        </div>
    );
}