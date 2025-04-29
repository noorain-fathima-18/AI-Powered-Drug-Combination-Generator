import React, { useState } from 'react';

function PatientForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    disease: '',
    age: '',
    weight: '',
    existing_medications: '',
    contraindications: '',
    comorbidities: '',
    lifestyle: '',
    enable_interaction_check: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.disease || !formData.age || !formData.weight) {
      alert('Please fill out all required fields');
      return;
    }
    
    // Convert string numbers to actual numbers
    const processedData = {
      ...formData,
      age: parseInt(formData.age, 10),
      weight: parseFloat(formData.weight)
    };
    
    onSubmit(processedData);
  };

  return (
    <div className="patient-form-container">
      <h2>Patient Information</h2>
      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-group">
          <label htmlFor="disease">Disease/Condition *</label>
          <input
            type="text"
            id="disease"
            name="disease"
            value={formData.disease}
            onChange={handleChange}
            className="form-control"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="age">Age *</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="form-control"
            min="0"
            max="120"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="weight">Weight (kg) *</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="form-control"
            min="0"
            step="0.1"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="existing_medications">Existing Medications</label>
          <textarea
            id="existing_medications"
            name="existing_medications"
            value={formData.existing_medications}
            onChange={handleChange}
            className="form-control"
            placeholder="List medications separated by commas"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="contraindications">Contraindications/Allergies</label>
          <textarea
            id="contraindications"
            name="contraindications"
            value={formData.contraindications}
            onChange={handleChange}
            className="form-control"
            placeholder="Any known drug allergies or contraindications"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="comorbidities">Comorbidities</label>
          <textarea
            id="comorbidities"
            name="comorbidities"
            value={formData.comorbidities}
            onChange={handleChange}
            className="form-control"
            placeholder="Any additional health conditions"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lifestyle">Lifestyle Factors</label>
          <textarea
            id="lifestyle"
            name="lifestyle"
            value={formData.lifestyle}
            onChange={handleChange}
            className="form-control"
            placeholder="Diet, exercise, alcohol/tobacco use, etc."
            disabled={loading}
          />
        </div>
        
        <div className="form-check">
          <input
            type="checkbox"
            id="enable_interaction_check"
            name="enable_interaction_check"
            checked={formData.enable_interaction_check}
            onChange={handleChange}
            className="form-check-input"
            disabled={loading}
          />
          <label className="form-check-label" htmlFor="enable_interaction_check">
            Check for drug interactions
          </label>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Combinations'}
        </button>
      </form>
    </div>
  );
}

export default PatientForm;