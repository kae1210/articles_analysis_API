import React from "react";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div style={{ marginTop: "16px", textAlign: "center" }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: "6px 12px",
          margin: "0 4px",
          borderRadius: "6px",
          border: "1px solid #ddd",
          background: currentPage === 1 ? "#f5f5f5" : "#fff",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
        }}
      >
        前へ
      </button>

      <span style={{ margin: "0 8px" }}>
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: "6px 12px",
          margin: "0 4px",
          borderRadius: "6px",
          border: "1px solid #ddd",
          background: currentPage === totalPages ? "#f5f5f5" : "#fff",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
        }}
      >
        次へ
      </button>
    </div>
  );
};
