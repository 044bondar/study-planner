import type { Task } from '../types/task';
import { TaskItem } from './TaskItem';
import './TaskList.scss';

interface TaskListProps {
    tasks: Task[];
    totalTasksCount: number;
    onToggleTask: (id: number) => void;
    onDeleteTask: (id: number) => void;
}

export function TaskList({
                             tasks,
                             totalTasksCount,
                             onToggleTask,
                             onDeleteTask,
                         }: TaskListProps) {
    if (totalTasksCount === 0) {
        return (
            <div className="task-list__empty">
                <p>Завдань поки немає.</p>
                <p>Додайте перше навчальне завдання за допомогою форми вище.</p>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="task-list__empty">
                <p>За цим фільтром завдань немає.</p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onDelete={onDeleteTask}
                />
            ))}
        </div>
    );
}