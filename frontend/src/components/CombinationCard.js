import React, { useState } from 'react';

function CombinationCard({ combination, index }) {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Calculate a color based on probability score
  const getScoreColor = (score) => {
    if (score >= 80) return '#4caf50'; // Green
    if (score >= 60) return '#ffb74d'; // Orange
    return '#f44336'; // Red
  };

  return (
    <div className="combination-card">
      <div className="combination-header" onClick={toggleExpanded}>
        <div className="combination-title">
          <span className="combination-rank">{index + 1}</span>
          <h3>{combination.name}</h3>
          <div className="probability-score" style={{ backgroundColor: getScoreColor(combination.probability_score) }}>
            {combination.probability_score}%
          </div>
        </div>
        <div className="expand-icon">{expanded ? '−' : '+'}</div>
      </div>
      
      <div className={`combination-details ${expanded ? 'expanded' : ''}`}>
        <div className="detail-section">
          <h4>Drugs</h4>
          <ul className="drug-list">
            {combination.drugs.map((drug, i) => (
              <li key={i} className="drug-item">{drug}</li>
            ))}
          </ul>
        </div>
        
        <div className="detail-section">
          <h4>Mechanisms of Action</h4>
          <ul>
            {combination.mechanisms.map((mechanism, i) => (
              <li key={i}><strong>{combination.drugs[i] || 'Drug'}:</strong> {mechanism}</li>
            ))}
          </ul>
        </div>
        
        <div className="detail-section">
          <h4>Synergistic Effects</h4>
          <p>{combination.synergy}</p>
        </div>
        
        <div className="detail-section">
          <h4>Potential Interactions</h4>
          <p>{combination.interactions || 'No significant interactions noted.'}</p>
        </div>
        
        <div className="detail-section">
          <h4>Dosage Recommendations</h4>
          <p>{combination.dosage}</p>
        </div>
        
        <div className="detail-section">
          <h4>Side Effects</h4>
          <ul className="side-effects-list">
            {combination.side_effects.map((effect, i) => (
              <li key={i}>{effect}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CombinationCard;
