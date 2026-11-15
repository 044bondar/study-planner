import { useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import { useTaskContext } from './hooks/useTaskContext';
import { useTasksApi } from './hooks/useTasksApi';
import type { Task } from './types/task';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskDetails } from './components/TaskDetails';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { Pagination } from './components/Pagination';
import { Toast } from './components/Toast';
import './App.scss';

function StudyPlannerContent() {
    const { showToast } = useTaskContext();
    const {
        tasks,
        total,
        page,
        totalPages,
        setPage,
        isLoading,
        error,
        retry,
        addTask,
        toggleTask,
        updateTask,
        deleteTask,
    } = useTasksApi(showToast);

    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const selectedFallback = tasks.find((t) => t.id === selectedTaskId);

    return (
        <div className="app">
            <Header />
            <TaskForm
                editingTask={editingTask}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onCancelEdit={() => setEditingTask(null)}
            />

            {selectedTaskId !== null && (
                <TaskDetails
                    taskId={selectedTaskId}
                    fallbackTask={selectedFallback}
                    onClose={() => setSelectedTaskId(null)}
                />
            )}

            <TaskStats tasks={tasks} />
            <TaskFilters tasks={tasks} />
            <TaskList
                tasks={tasks}
                isLoading={isLoading}
                error={error}
                onRetry={retry}
                onSelectTask={setSelectedTaskId}
                onToggleTask={toggleTask}
                onEditTask={setEditingTask}
                onDeleteTask={async (id) => {
                    await deleteTask(id);
                    if (selectedTaskId === id) setSelectedTaskId(null);
                    if (editingTask?.id === id) setEditingTask(null);
                }}
            />
            <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={total}
                disabled={isLoading}
                onPageChange={(nextPage) => {
                    setSelectedTaskId(null);
                    setPage(nextPage);
                }}
            />
            <Toast />
        </div>
    );
}

export function App() {
    return (
        <TaskProvider>
            <StudyPlannerContent />
        </TaskProvider>
    );
}

export default App;