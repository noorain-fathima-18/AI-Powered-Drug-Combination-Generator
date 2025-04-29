import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Header from './components/Header';
import PatientForm from './components/PatientForm';
import ResultsDisplay from './components/ResultsDisplay';
import api from './services/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [interactionMatrix, setInteractionMatrix] = useState(null);

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      setPatientData(formData);
      setResults(null);
      setInteractionMatrix(null);
      
      // Generate drug combinations
      const combinationsData = await api.generateCombinations(formData);
      setResults(combinationsData);
      
      // If interaction check is enabled and there are combinations
      if (formData.enable_interaction_check && combinationsData.combinations.length > 0) {
        // Get all unique drugs from combinations and existing medications
        const allDrugs = new Set();
        
        // Add existing medications if provided
        if (formData.existing_medications) {
          formData.existing_medications.split(',').forEach(med => {
            const trimmed = med.trim();
            if (trimmed) allDrugs.add(trimmed);
          });
        }
        
        // Add drugs from combinations
        combinationsData.combinations.forEach(combo => {
          combo.drugs.forEach(drug => allDrugs.add(drug));
        });
        
        // Get interaction matrix if we have at least 2 drugs
        const drugList = Array.from(allDrugs);
        if (drugList.length >= 2) {
          const matrixData = await api.getInteractionMatrix(drugList);
          setInteractionMatrix(matrixData);
        }
      }
      
      setLoading(false);
      toast.success('Treatment combinations generated successfully!');
    } catch (error) {
      setLoading(false);
      toast.error(`Error: ${error.response?.data?.detail || error.message}`);
      console.error('Error submitting form:', error);
    }
  };

  const handleExportCSV = async () => {
    try {
      if (!results) return;
      await api.exportCSV(results);
      toast.success('CSV exported successfully!');
    } catch (error) {
      toast.error(`Error exporting CSV: ${error.message}`);
    }
  };

  const handleExportPDF = async () => {
    try {
      if (!results) return;
      await api.exportPDF(results);
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error(`Error exporting PDF: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <main className="container">
        <div className="row">
          <div className="col-md-4">
            <PatientForm onSubmit={handleFormSubmit} loading={loading} />
          </div>
          <div className="col-md-8">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Generating personalized drug combinations...</p>
              </div>
            ) : (
              results && (
                <ResultsDisplay 
                  results={results} 
                  patientData={patientData}
                  interactionMatrix={interactionMatrix}
                  onExportCSV={handleExportCSV}
                  onExportPDF={handleExportPDF}
                />
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;