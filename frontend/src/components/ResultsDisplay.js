import React from 'react';
import CombinationCard from './CombinationCard';
import DrugInteractionMatrix from './DrugInteractionMatrix';
import ExportOptions from './ExportOptions';

function ResultsDisplay({ 
  results, 
  patientData, 
  interactionMatrix,
  onExportCSV,
  onExportPDF
}) {
  if (!results || !results.combinations || results.combinations.length === 0) {
    return <div className="no-results">No combinations found</div>;
  }

  return (
    <div className="results-display">
      <div className="results-header">
        <h2>Treatment Combinations for {patientData.disease}</h2>
        <div className="patient-summary">
          <p>
            <strong>Patient:</strong> {patientData.age} years, {patientData.weight} kg
            {patientData.comorbidities && ` | Comorbidities: ${patientData.comorbidities}`}
          </p>
        </div>
      </div>

      <ExportOptions onExportCSV={onExportCSV} onExportPDF={onExportPDF} />
      
      {interactionMatrix && <DrugInteractionMatrix matrixData={interactionMatrix} />}
      
      <div className="combinations-list">
        <h3>Recommended Combinations</h3>
        {results.combinations.map((combination, index) => (
          <CombinationCard key={index} combination={combination} index={index} />
        ))}
      </div>
    </div>
  );
}

export default ResultsDisplay;