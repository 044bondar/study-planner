import { useState, type FormEvent } from 'react';
import type { NewTaskData, Priority, Task, UpdateTaskData } from '../types/task';
import './TaskForm.scss';

interface TaskFormProps {
    editingTask: Task | null;
    onAddTask: (data: NewTaskData) => Promise<void>;
    onUpdateTask: (id: number, data: UpdateTaskData) => Promise<void>;
    onCancelEdit: () => void;
}

function TaskFormInner({
                           editingTask,
                           onAddTask,
                           onUpdateTask,
                           onCancelEdit,
                       }: TaskFormProps) {
    const [title, setTitle] = useState(editingTask?.title ?? '');
    const [description, setDescription] = useState(editingTask?.description ?? '');
    const [category, setCategory] = useState(editingTask?.category ?? 'React');
    const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? 'medium');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Назва завдання є обов’язковою');
            return;
        }

        const payload = {
            title: title.trim(),
            description: description.trim() || 'Без опису',
            category: category.trim() || 'General',
            priority,
        };

        setIsSubmitting(true);
        try {
            if (editingTask) {
                await onUpdateTask(editingTask.id, payload);
                onCancelEdit();
            } else {
                await onAddTask(payload);
                setTitle('');
                setDescription('');
                setCategory('React');
                setPriority('medium');
            }
            setError('');
        } catch {
            // Помилка вже оброблена у Toast
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <h2 className="task-form__title">
                {editingTask ? `Редагування: ${editingTask.title}` : 'Нове навчальне завдання (API)'}
            </h2>

            <div className="task-form__grid">
                <div className="task-form__field">
                    <label className="task-form__label">Назва *</label>
                    <input
                        className="task-form__input"
                        type="text"
                        placeholder="Наприклад: Вивчити Repository Pattern"
                        value={title}
                        disabled={isSubmitting}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (error) setError('');
                        }}
                    />
                </div>

                <div className="task-form__field">
                    <label className="task-form__label">Опис</label>
                    <input
                        className="task-form__input"
                        type="text"
                        placeholder="Короткий опис завдання"
                        value={description}
                        disabled={isSubmitting}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="task-form__field">
                    <label className="task-form__label">Категорія</label>
                    <input
                        className="task-form__input"
                        type="text"
                        placeholder="React, TypeScript..."
                        value={category}
                        disabled={isSubmitting}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>

                <div className="task-form__field">
                    <label className="task-form__label">Пріоритет</label>
                    <select
                        className="task-form__select"
                        value={priority}
                        disabled={isSubmitting}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                    >
                        <option value="low">Low (Низький)</option>
                        <option value="medium">Medium (Середній)</option>
                        <option value="high">High (Високий)</option>
                    </select>
                </div>
            </div>

            {error && <p className="task-form__error">{error}</p>}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="task-form__submit" disabled={isSubmitting}>
                    {isSubmitting
                        ? 'Збереження...'
                        : editingTask
                            ? 'Зберегти зміни'
                            : 'Додати завдання'}
                </button>
                {editingTask && (
                    <button
                        type="button"
                        className="task-filters__btn"
                        disabled={isSubmitting}
                        onClick={onCancelEdit}
                    >
                        Скасувати
                    </button>
                )}
            </div>
        </form>
    );
}

export function TaskForm(props: TaskFormProps) {
    return <TaskFormInner key={props.editingTask?.id ?? 'new'} {...props} />;
}