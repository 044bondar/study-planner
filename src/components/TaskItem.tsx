import { useTaskContext } from '../hooks/useTaskContext';
import type { Task } from '../types/task';
import './TaskItem.scss';

interface TaskItemProps {
    task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
    const { toggleTask, requestDelete, setEditingTask, pendingDeleteTaskId } = useTaskContext();

    const isPendingDelete = pendingDeleteTaskId === task.id;

    return (
        <article
            className={`task-item ${task.completed ? 'task-item--completed' : ''} ${
                isPendingDelete ? 'task-item--pending-delete' : ''
            }`}
        >
            <div className="task-item__content">
                <h3 className="task-item__title">
                    {task.title} {isPendingDelete && '(Буде видалено...)'}
                </h3>
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
                    onClick={() => toggleTask(task.id)}
                >
                    {task.completed ? 'Повернути' : 'Виконано'}
                </button>
                <button
                    type="button"
                    className="task-item__btn task-item__btn--edit"
                    onClick={() => setEditingTask(task)}
                >
                    Редагувати
                </button>
                <button
                    type="button"
                    className="task-item__btn task-item__btn--delete"
                    onClick={() => requestDelete(task.id)}
                >
                    Видалити
                </button>
            </div>
        </article>
    );
}