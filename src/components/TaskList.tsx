import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';
import './TaskList.scss';

export function TaskList() {
    const { tasks, filter } = useTaskContext();

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'active') return !task.completed;
        return true;
    });

    if (tasks.length === 0) {
        return (
            <div className="task-list__empty">
                <p>Завдань поки немає.</p>
                <p>Додайте перше навчальне завдання за допомогою форми вище.</p>
            </div>
        );
    }

    if (filteredTasks.length === 0) {
        return (
            <div className="task-list__empty">
                <p>За цим фільтром завдань немає.</p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
}