import "./Pagination.css";

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  pageSize,
  onPageSizeChange
}) {
  return (
    <div className="main">
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select> 

      <button
        className="btn1"
        onClick={onPrev}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      <label>
        Page {currentPage} of {totalPages}
      </label>

      <button
        className="next"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}