import type { Task } from '../types/task';
import './TaskItem.scss';

interface TaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    return (
        <article className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
            <div className="task-item__content">
                <h3 className="task-item__title">{task.title}</h3>
                <p className="task-item__desc">{task.description}</p>
                <div className="task-item__meta">
                    <span className="task-item__badge">{task.category}</span>
                    <span className={`task-item__badge task-item__badge--${task.priority}`}>
            Пріоритет: {task.priority}
          </span>
                    <span className="task-item__badge">
            {task.completed ? 'Виконано' : 'У процесі'}
          </span>
                </div>
            </div>

            <div className="task-item__actions">
                <button
                    type="button"
                    className="task-item__btn task-item__btn--toggle"
                    onClick={() => onToggle(task.id)}
                >
                    {task.completed ? 'Повернути' : 'Виконано'}
                </button>
                <button
                    type="button"
                    className="task-item__btn task-item__btn--delete"
                    onClick={() => onDelete(task.id)}
                >
                    Видалити
                </button>
            </div>
        </article>
    );
}