import { useState } from 'react';
import { initialTasks } from './data/initialTasks';
import type { FilterStatus, NewTaskData, Task } from './types/task';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import './App.scss';

export function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<FilterStatus>('all');

  const handleAddTask = (data: NewTaskData) => {
    const newTask: Task = {
      ...data,
      id: Date.now(),
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: number) => {
    setTasks((prev) =>
        prev.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        )
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
      <div className="app">
        <Header />
        <TaskForm onAddTask={handleAddTask} />
        <TaskStats tasks={tasks} />
        <TaskFilters
            currentFilter={filter}
            counts={{
              all: tasks.length,
              active: tasks.length - completedCount,
              completed: completedCount,
            }}
            onFilterChange={setFilter}
        />
        <TaskList
            tasks={filteredTasks}
            totalTasksCount={tasks.length}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
        />
      </div>
  );
}

export default App;