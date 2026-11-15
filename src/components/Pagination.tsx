import './Pagination.scss';

interface PaginationProps {
    page: number;
    totalPages: number;
    totalItems: number;
    disabled?: boolean;
    onPageChange: (page: number) => void;
}

export function Pagination({
                               page,
                               totalPages,
                               totalItems,
                               disabled,
                               onPageChange,
                           }: PaginationProps) {
    return (
        <div className="pagination">
      <span className="pagination__info">
        Сторінка {page} із {totalPages} (усього в API: {totalItems})
      </span>
            <div className="pagination__controls">
                <button
                    type="button"
                    className="pagination__btn"
                    disabled={disabled || page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    &larr; Попередня
                </button>
                <button
                    type="button"
                    className="pagination__btn"
                    disabled={disabled || page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Наступна &rarr;
                </button>
            </div>
        </div>
    );
}