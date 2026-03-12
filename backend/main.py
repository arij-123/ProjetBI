from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
from pydantic import BaseModel
from typing import Dict, Any
import os

app = FastAPI(
    title="Mobile Addiction Classification API",
    description="API pour prédire l'addiction au mobile",
    version="1.0.0"
)

# Ajouter le middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserData(BaseModel):
    daily_screen_time: float
    app_sessions: int
    social_media_usage: float
    gaming_time: float
    notifications: int
    night_usage: float
    age: int
    work_study_hours: float
    stress_level: int
    apps_installed: int

# Vérifier que les fichiers existent
def load_models():
    try:
        model = joblib.load('../models/best_model_xgboost.pkl')
        model_info = joblib.load('../models/best_model_info.pkl')
        # Le modèle notebook a déjà son propre scaler, pas besoin de préprocesseur externe
        return model, None, model_info
    except FileNotFoundError as e:
        print(f"Erreur de chargement: {e}")
        print("Assurez-vous d'exécuter les notebooks d'abord!")
        return None, None, None

# Charger les modèles au démarrage
model, preprocessor, model_info = load_models()

@app.get("/")
async def root():
    if not model:
        return {"error": "Modèles non chargés - exécutez les notebooks d'abord"}
    
    return {
        "message": "Mobile Addiction Classification API",
        "model": model_info['model_name'] if model_info else "Non chargé",
        "f1_score": model_info['test_f1'] if model_info else None,
        "version": "1.0.0",
        "status": "ready" if model else "not_ready"
    }

@app.post("/predict")
async def predict(user_data: UserData) -> Dict[str, Any]:
    if not model:
        return {"error": "Modèle non disponible"}
    
    try:
        # Convertir en DataFrame
        user_df = pd.DataFrame([user_data.model_dump()])
        
        # Le modèle notebook a déjà son propre scaler, appliquer directement
        # Pas de prétraitement externe nécessaire
        prediction = model.predict(user_df)[0]
        probability = model.predict_proba(user_df)[0]
        
        return {
            "prediction": "addicted" if prediction == 1 else "not addicted",
            "probability_addicted": float(probability[1]),
            "probability_not_addicted": float(probability[0]),
            "confidence": float(max(probability)),
            "model_used": model_info['model_name']
        }
        
    except Exception as e:
        return {"error": f"Erreur de prédiction: {str(e)}"}

@app.get("/model/info")
async def get_model_info():
    if not model_info:
        return {"error": "Informations modèle non disponibles"}
    return model_info

@app.get("/features/importance")
async def get_feature_importance():
    try:
        # Essayer différents chemins possibles
        paths = ['models/feature_importance.csv', '../models/feature_importance.csv']
        importance_df = None
        
        for path in paths:
            try:
                importance_df = pd.read_csv(path)
                break
            except FileNotFoundError:
                continue
        
        if importance_df is None:
            return {"error": "Fichier d'importance des features non trouvé"}
        
        # Convertir en liste de dictionnaires
        features_list = []
        for _, row in importance_df.iterrows():
            features_list.append({
                'feature': row['feature'],
                'importance': float(row['importance'])
            })
        return features_list
    except Exception as e:
        return {"error": f"Erreur lecture feature importance: {str(e)}"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "has_internal_scaler": model is not None and hasattr(model, 'named_steps') and 'scaler' in model.named_steps,
        "notebook_model": model_info.get('data_type') == 'notebook_preprocessed' if model_info else False
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
