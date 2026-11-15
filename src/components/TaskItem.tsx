import { useState } from 'react';
import type { Task } from '../types/task';
import './TaskItem.scss';

interface TaskItemProps {
    task: Task;
    onSelect: (id: number) => void;
    onToggle: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: number) => void;
}

export function TaskItem({ task, onSelect, onToggle, onEdit, onDelete }: TaskItemProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

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

            <div className="task-item__actions" style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <button
                    type="button"
                    className="task-item__btn"
                    style={{ background: '#f3f4f6', color: '#1f2937' }}
                    onClick={() => onSelect(task.id)}
                >
                    Деталі
                </button>
                <button
                    type="button"
                    className="task-item__btn task-item__btn--toggle"
                    onClick={() => onToggle(task)}
                >
                    {task.completed ? 'Повернути' : 'Виконано'}
                </button>
                <button
                    type="button"
                    className="task-item__btn task-item__btn--edit"
                    onClick={() => onEdit(task)}
                >
                    Редагувати
                </button>

                {!confirmDelete ? (
                    <button
                        type="button"
                        className="task-item__btn task-item__btn--delete"
                        onClick={() => setConfirmDelete(true)}
                    >
                        Видалити
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            className="task-item__btn task-item__btn--delete"
                            onClick={() => onDelete(task.id)}
                        >
                            Підтвердити?
                        </button>
                        <button
                            type="button"
                            className="task-item__btn"
                            onClick={() => setConfirmDelete(false)}
                        >
                            Ні
                        </button>
                    </>
                )}
            </div>
        </article>
    );
}