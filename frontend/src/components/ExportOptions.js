import React from 'react';

function ExportOptions({ onExportCSV, onExportPDF }) {
  return (
    <div className="export-options">
      <h3>Export Results</h3>
      <div className="export-buttons">
        <button onClick={onExportCSV} className="btn btn-secondary">
          <i className="icon-csv"></i>
          Export to CSV
        </button>
        <button onClick={onExportPDF} className="btn btn-secondary">
          <i className="icon-pdf"></i>
          Export to PDF
        </button>
      </div>
    </div>
  );
}

export default ExportOptions;