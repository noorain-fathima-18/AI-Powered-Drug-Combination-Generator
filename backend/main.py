from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import os
from dotenv import load_dotenv
import json
import requests
import pandas as pd
from datetime import datetime

# Load environment variables
load_dotenv()

# Get API key from environment
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise Exception("OpenAI API key not found in environment variables. Please add OPENAI_API_KEY to your .env file.")

app = FastAPI(
    title="MediCombine API",
    description="API for generating personalized drug therapies",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class PatientData(BaseModel):
    disease: str
    age: int
    weight: float
    existing_medications: str = ""
    contraindications: str = ""
    comorbidities: str = ""
    lifestyle: str = ""
    enable_interaction_check: bool = True

class DrugInteraction(BaseModel):
    drug1: str
    drug2: str
    severity: str
    description: str

class DrugCombination(BaseModel):
    name: str
    drugs: List[str]
    mechanisms: List[str]
    synergy: str
    interactions: str
    dosage: str
    side_effects: List[str]
    probability_score: int

class CombinationResponse(BaseModel):
    combinations: List[DrugCombination]

# Function to call OpenAI API directly using requests
def call_openai_api(system_message: str, user_message: str) -> str:
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    payload = {
        "model": "gpt-4",
        "messages": [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.5
    }
    
    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers=headers,
        json=payload
    )
    
    if response.status_code != 200:
        raise Exception(f"OpenAI API error: {response.status_code} - {response.text}")
    
    response_data = response.json()
    return response_data["choices"][0]["message"]["content"]

# Function to check drug interactions
def check_drug_interactions(drug_list: List[str]) -> List[DrugInteraction]:
    try:
        # This is a placeholder function that simulates API interaction
        # In a real application, you would integrate with an actual drug interaction API
        interactions = []
        
        # Check each pair of drugs
        for i in range(len(drug_list)):
            for j in range(i+1, len(drug_list)):
                # Simulate finding some interactions
                if hash(drug_list[i] + drug_list[j]) % 3 == 0:  # Arbitrary condition to simulate some interactions
                    interactions.append(DrugInteraction(
                        drug1=drug_list[i],
                        drug2=drug_list[j],
                        severity="Major" if hash(drug_list[i] + drug_list[j]) % 5 == 0 else "Moderate",
                        description=f"Potential interaction between {drug_list[i]} and {drug_list[j]}."
                    ))
        
        return interactions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking drug interactions: {str(e)}")

# Function to generate drug combinations
def generate_drug_combinations(patient_data: PatientData) -> CombinationResponse:
    try:
        # Create a structured prompt for OpenAI
        prompt = f"""
        Generate 5 potential drug combination therapies for {patient_data.disease}, ranked from most to least probable.
        
        Patient details:
        - Age: {patient_data.age}
        - Weight: {patient_data.weight} kg
        - Existing Medications: {patient_data.existing_medications}
        - Contraindications or Allergies: {patient_data.contraindications}
        - Comorbidities: {patient_data.comorbidities}
        - Lifestyle Factors: {patient_data.lifestyle}
        
        For each combination:
        1. List the drugs in the combination
        2. Provide the mechanism of action for each drug
        3. Explain the synergistic effects
        4. Note potential interactions with existing medications
        5. Provide dosage recommendations
        6. List potential side effects
        7. Assign a probability score (0-100) based on suitability
        
        Format the response as a structured JSON object:
        {{
            "combinations": [
                {{
                    "name": "Combination Name",
                    "drugs": ["Drug 1", "Drug 2"],
                    "mechanisms": ["Mechanism 1", "Mechanism 2"],
                    "synergy": "Description of synergistic effects",
                    "interactions": "Potential interactions with existing medications",
                    "dosage": "Dosage recommendations",
                    "side_effects": ["Side effect 1", "Side effect 2"],
                    "probability_score": 85
                }}
            ]
        }}
        """

        # Call OpenAI API directly using requests
        system_message = "You are a clinical pharmacology expert specializing in drug combination therapies."
        response_text = call_openai_api(system_message, prompt)

        # Parse response
        response_data = json.loads(response_text)
        
        # Sort by probability score
        response_data["combinations"].sort(key=lambda x: x["probability_score"], reverse=True)
        
        return CombinationResponse(**response_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating drug combinations: {str(e)}")

# Create interaction matrix data
def create_interaction_matrix(all_drugs: List[str]):
    matrix_data = []
    
    for i in range(len(all_drugs)):
        row = []
        for j in range(len(all_drugs)):
            if i == j:
                row.append({"value": "—", "severity": "none"})
            elif i < j:
                # Simulate interaction check
                if hash(all_drugs[i] + all_drugs[j]) % 3 == 0:
                    severity = "major" if hash(all_drugs[i] + all_drugs[j]) % 5 == 0 else "moderate"
                    row.append({"value": severity.capitalize(), "severity": severity})
                else:
                    row.append({"value": "None", "severity": "none"})
            else:
                # Mirror the value from the other half of the matrix
                result = matrix_data[j][i]
                row.append(result)
        matrix_data.append(row)
    
    return {
        "drugs": all_drugs,
        "matrix": matrix_data
    }

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to MediCombine API"}

@app.post("/api/generate", response_model=CombinationResponse)
async def generate_combinations(patient_data: PatientData):
    if not patient_data.disease:
        raise HTTPException(status_code=400, detail="Disease or condition is required")
    
    return generate_drug_combinations(patient_data)

@app.post("/api/interactions")
async def get_interactions(drug_list: List[str]):
    if len(drug_list) < 2:
        return {"interactions": []}
    
    interactions = check_drug_interactions(drug_list)
    return {"interactions": interactions}

@app.post("/api/interaction-matrix")
async def get_interaction_matrix(drug_list: List[str]):
    if len(drug_list) < 2:
        return {"error": "At least two drugs are required to create a matrix"}
    
    matrix = create_interaction_matrix(drug_list)
    return matrix

@app.post("/api/export-csv")
async def export_csv(combinations: CombinationResponse):
    try:
        # In a real application, you would create and return a CSV file
        # Here we just return a success message
        return {"message": "CSV exported successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting CSV: {str(e)}")

@app.post("/api/export-pdf")
async def export_pdf(combinations: CombinationResponse):
    try:
        # In a real application, you would create and return a PDF file
        # Here we just return a success message
        return {"message": "PDF exported successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting PDF: {str(e)}")
