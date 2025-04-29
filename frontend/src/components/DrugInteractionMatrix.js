import React from 'react';

function DrugInteractionMatrix({ matrixData }) {
  if (!matrixData || !matrixData.drugs || !matrixData.matrix) {
    return null;
  }

  const { drugs, matrix } = matrixData;

  // Function to get CSS class based on severity
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'major':
        return 'severity-major';
      case 'moderate':
        return 'severity-moderate';
      default:
        return 'severity-none';
    }
  };

  return (
    <div className="interaction-matrix-container">
      <h3>Drug Interaction Matrix</h3>
      <div className="interaction-matrix-wrapper">
        <table className="interaction-matrix">
          <thead>
            <tr>
              <th></th>
              {drugs.map((drug, index) => (
                <th key={index} className="drug-header">{drug}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th className="drug-header">{drugs[rowIndex]}</th>
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className={`interaction-cell ${getSeverityClass(cell.severity)}`}
                    title={cell.value !== '—' && cell.value !== 'None' ? 
                      `Interaction between ${drugs[rowIndex]} and ${drugs[cellIndex]}: ${cell.value}` : ''}
                  >
                    {cell.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="matrix-legend">
        <div className="legend-item">
          <span className="legend-color severity-major"></span>
          <span>Major Interaction</span>
        </div>
        <div className="legend-item">
          <span className="legend-color severity-moderate"></span>
          <span>Moderate Interaction</span>
        </div>
        <div className="legend-item">
          <span className="legend-color severity-none"></span>
          <span>No Known Interaction</span>
        </div>
      </div>
    </div>
  );
}

export default DrugInteractionMatrix;