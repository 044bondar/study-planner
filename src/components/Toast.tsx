import { useTaskContext } from '../hooks/useTaskContext';
import './Toast.scss';

export function Toast() {
    const { toast, dismissToast } = useTaskContext();

    if (!toast) return null;

    return (
        <div key={toast.id} className={`toast toast--${toast.type}`} role="status">
            <div className="toast__body">
                <span className="toast__text">{toast.text}</span>
                <button
                    type="button"
                    className="toast__close-btn"
                    aria-label="Закрити"
                    onClick={dismissToast}
                >
                    &times;
                </button>
            </div>
        </div>
    );
}