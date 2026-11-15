import { useState, type FormEvent } from 'react';
import type { NewTaskData, Priority } from '../types/task';
import './TaskForm.scss';

interface TaskFormProps {
    onAddTask: (data: NewTaskData) => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('React');
    const [priority, setPriority] = useState<Priority>('medium');
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Назва завдання є обов’язковою');
            return;
        }

        onAddTask({
            title: title.trim(),
            description: description.trim() || 'Без опису',
            category: category.trim() || 'Загальне',
            priority,
        });

        setTitle('');
        setDescription('');
        setCategory('React');
        setPriority('medium');
        setError('');
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <h2 className="task-form__title">Нове навчальне завдання</h2>

            <div className="task-form__grid">
                <div className="task-form__field">
                    <label className="task-form__label">Назва *</label>
                    <input
                        className="task-form__input"
                        type="text"
                        placeholder="Наприклад: Вивчити useState"
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

            <button type="submit" className="task-form__submit">
                Додати завдання
            </button>
        </form>
    );
}