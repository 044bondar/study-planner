import { TaskProvider } from './context/TaskContext';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { Toast } from './components/Toast';
import './App.scss';

export function App() {
    return (
        <TaskProvider>
            <div className="app">
                <Header />
                <TaskForm />
                <TaskStats />
                <TaskFilters />
                <TaskList />
                <Toast />
            </div>
        </TaskProvider>
    );
}

export default App;