import type { Task } from '../types/task';
import './TaskStats.scss';

interface TaskStatsProps {
    tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const active = total - completed;

    return (
        <div className="task-stats">
            <div className="task-stats__card">
                <span className="task-stats__value">{total}</span>
                <span className="task-stats__label">Усього завдань</span>
            </div>
            <div className="task-stats__card">
                <span className="task-stats__value task-stats__value--completed">{completed}</span>
                <span className="task-stats__label">Виконано</span>
            </div>
            <div className="task-stats__card">
                <span className="task-stats__value task-stats__value--active">{active}</span>
                <span className="task-stats__label">Не виконано</span>
            </div>
        </div>
    );
}