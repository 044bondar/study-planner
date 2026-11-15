import { useState, type FormEvent } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import type { Priority, Task } from '../types/task';
import './TaskForm.scss';

function TaskFormInner({ editingTask }: { editingTask: Task | null }) {
    const { addTask, updateTask, setEditingTask } = useTaskContext();

    const [title, setTitle] = useState(editingTask?.title ?? '');
    const [description, setDescription] = useState(editingTask?.description ?? '');
    const [category, setCategory] = useState(editingTask?.category ?? 'React');
    const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? 'medium');
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Назва завдання є обов’язковою');
            return;
        }

        const payload = {
            title: title.trim(),
            description: description.trim() || 'Без опису',
            category: category.trim() || 'Загальне',
            priority,
        };

        if (editingTask) {
            updateTask(editingTask.id, payload);
        } else {
            addTask(payload);
            setTitle('');
            setDescription('');
            setCategory('React');
            setPriority('medium');
        }
        setError('');
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <h2 className="task-form__title">
                {editingTask ? `Редагування: ${editingTask.title}` : 'Нове навчальне завдання'}
            </h2>

            <div className="task-form__grid">
                <div className="task-form__field">
                    <label className="task-form__label">Назва *</label>
                    <input
                        className="task-form__input"
                        type="text"
                        placeholder="Наприклад: Вивчити useReducer"
                        value={title}
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
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="task-form__field">
                    <label className="task-form__label">Категорія</label>
                    <input
                        className="task-form__input"
                        type="text"
                        placeholder="React, TypeScript, Git..."
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>

                <div className="task-form__field">
                    <label className="task-form__label">Пріоритет</label>
                    <select
                        className="task-form__select"
                        value={priority}
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
                <button type="submit" className="task-form__submit">
                    {editingTask ? 'Зберегти зміни' : 'Додати завдання'}
                </button>
                {editingTask && (
                    <button
                        type="button"
                        className="task-filters__btn"
                        onClick={() => setEditingTask(null)}
                    >
                        Скасувати
                    </button>
                )}
            </div>
        </form>
    );
}

export function TaskForm() {
    const { editingTask } = useTaskContext();
    return <TaskFormInner key={editingTask?.id ?? 'new'} editingTask={editingTask} />;
}