import { useTaskContext } from '../hooks/useTaskContext';
import './Toast.scss';

export function Toast() {
    const { toast, undoDelete, dismissToast } = useTaskContext();

    if (!toast) return null;

    return (
        <div key={toast.id} className={`toast toast--${toast.type}`} role="status">
            <div className="toast__body">
                <span className="toast__text">{toast.text}</span>
                <div className="toast__actions">
                    {toast.canUndo && (
                        <button type="button" className="toast__undo-btn" onClick={undoDelete}>
                            Undo
                        </button>
                    )}
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
            {toast.canUndo && <div className="toast__progress" />}
        </div>
    );
}