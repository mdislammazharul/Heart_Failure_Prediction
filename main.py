import pandas as pd
import pickle
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware

# ----------------------------
# Add CORS so GitHub Pages can access API
# ----------------------------
origins = [
    "http://localhost:3000",   # React dev
    "https://mdislammazharul.github.io",  # user site root
    "https://mdislammazharul.github.io/Heart_Failure_Prediction",  # actual app
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Allow GitHub Pages website
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Load model
# ----------------------------
with open('heart_failure_model.pkl', 'rb') as f_in:
    model = pickle.load(f_in)

# ----------------------------
# Pydantic model
# ----------------------------
class PatientData(BaseModel):
    age: float = Field(..., json_schema_extra={"example": 65})
    anaemia: int = Field(..., json_schema_extra={"example": 0})
    creatinine_phosphokinase: int = Field(..., json_schema_extra={"example": 250})
    diabetes: int = Field(..., json_schema_extra={"example": 1})
    ejection_fraction: int = Field(..., json_schema_extra={"example": 35})
    high_blood_pressure: int = Field(..., json_schema_extra={"example": 1})
    platelets: float = Field(..., json_schema_extra={"example": 250000})
    serum_creatinine: float = Field(..., json_schema_extra={"example": 1.9})
    serum_sodium: int = Field(..., json_schema_extra={"example": 130})
    sex: int = Field(..., json_schema_extra={"example": 1})
    smoking: int = Field(..., json_schema_extra={"example": 0})
    time: int = Field(..., json_schema_extra={"example": 120})

# ----------------------------
# Routes
# ----------------------------
@app.get("/")
def read_root():
    return {"hello": "world"}

@app.post("/predict")
def predict(data: PatientData):
    try:
        input_df = pd.DataFrame([data.model_dump()])
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0, 1]
        
        return {
            "prediction": int(prediction),
            "probability_death": float(probability)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))