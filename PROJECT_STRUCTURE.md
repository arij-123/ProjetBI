# 📱 Mobile Addiction Classification - Structure du Projet

## 🎯 Vue d'Ensemble
Système complet de classification d'addiction mobile avec Machine Learning (XGBoost 98% F1), backend FastAPI et frontend React.

## 📁 Structure Organisationnelle

```
mobile-addiction-classification/
├── 📋 README_PROJET.md                 # Documentation principale
├── 🤖 models/                          # Modèles ML et métriques
│   ├── best_model_xgboost.pkl         # Modèle XGBoost 98% F1 (notebook)
│   ├── best_model_info.pkl            # Métadonnées du modèle
│   ├── feature_importance.csv         # Importance des features
│   └── model_results.csv              # Résultats comparatifs
├── 📊 data/                           # Données d'entraînement
│   ├── raw/                           # Données brutes (optionnel)
│   └── processed/                     # Données prétraitées
│       ├── X_train_processed.csv      # Features entraînement
│       ├── X_test_processed.csv       # Features test
│       ├── y_train.csv                # Cibles entraînement
│       ├── y_test.csv                 # Cibles test
│       ├── preprocessor.pkl           # Préprocesseur (deprecated)
│       └── column_info.pkl            # Informations colonnes
├── 🧠 notebooks/                      # Recherche et développement ML
│   └── training.ipynb                 # Notebook d'entraînement principal
├── ⚡ backend/                        # API FastAPI
│   ├── main.py                        # Application principale
│   └── models/                        # Copie locale pour le backend
│       └── feature_importance.csv     # Fichier local pour le backend
└── 🎨 frontend/                       # Application React
    ├── src/                          # Code source
    │   ├── components/               # Composants React
    │   │   ├── App.jsx              # Application principale
    │   │   ├── PredictionForm.jsx   # Formulaire de prédiction
    │   │   ├── ResultsCard.jsx     # Affichage résultats
    │   │   ├── FeatureImportance.jsx # Features importantes
    │   │   ├── BackendStatus.jsx    # Status connexion backend
    │   │   ├── Header.jsx           # En-tête
    │   │   ├── Footer.jsx           # Pied de page
    │   │   └── StatsCard.jsx        # Cartes statistiques
    │   ├── config/                   # Configuration
    │   │   └── api.js               # URLs API
    │   └── utils/                    # Utilitaires
    │       └── cn.js                 # Utilitaire classes CSS
    ├── package.json                  # Dépendances React
    └── vite.config.js               # Configuration Vite
```

## 🚀 Composants Principaux

### 1. Machine Learning (98% F1 Score)
- **Modèle** : XGBoost entraîné dans `notebooks/training.ipynb`
- **Performance** : 98% F1, 97.98% Accuracy
- **Pipeline** : Scaler + XGBoost (intégré)
- **Features** : 10 variables comportementales

### 2. Backend FastAPI (Port 8002)
- **Endpoints** : `/predict`, `/model/info`, `/features/importance`, `/health`
- **Modèle** : XGBoost_Real_Notebook (vrai modèle du notebook)
- **CORS** : Configuré pour frontend React
- **Validation** : Pydantic models

### 3. Frontend React (Port 3000)
- **Framework** : React + Vite
- **UI** : TailwindCSS + Lucide Icons
- **Components** : Modularisés et réutilisables
- **API** : Appels asynchrones avec gestion d'erreurs

## 📊 Performance du Système

### Modèle ML
- **F1 Score** : 98.0%
- **Accuracy** : 97.98%
- **Precision** : 97.75%
- **Recall** : 98.25%

### Features les plus influentes
1. Notifications (62.8%)
2. App Sessions (8.3%)
3. Stress Level (7.7%)
4. Age (4.9%)
5. Social Media Usage (3.3%)

## 🔄 Flux de Données

```
Frontend (React) → API Request → Backend (FastAPI) → Model (XGBoost) → Response → Frontend
```

1. **Frontend** : Formulaire avec 10 champs
2. **Backend** : Reçoit données, applique pipeline intégré
3. **Modèle** : Prédiction avec probabilités
4. **Frontend** : Affiche résultats avec recommandations

## 🛠️ Technologies

### Backend
- **FastAPI** : API REST moderne
- **XGBoost** : Machine Learning
- **Joblib** : Persistance des modèles
- **Pandas** : Manipulation des données
- **Pydantic** : Validation des données

### Frontend
- **React** : Framework JavaScript
- **Vite** : Build tool ultra-rapide
- **TailwindCSS** : CSS utility-first
- **Lucide React** : Icônes modernes

### ML/Data
- **XGBoost** : Gradient Boosting
- **Scikit-learn** : Pipeline ML
- **Pandas** : Data manipulation
- **MLflow** : Experiment tracking

## 📝 Notes de Développement

### Points Clés
- Le modèle utilise son propre scaler intégré
- Pas de prétraitement externe nécessaire
- Performance exceptionnelle conservée
- Compatibilité frontend préservée

### Fichiers Importants
- `models/best_model_xgboost.pkl` : Modèle principal
- `backend/main.py` : API backend
- `frontend/src/components/App.jsx` : Interface principale
- `notebooks/training.ipynb` : Recherche ML

## 🎯 Usage

### Démarrage
1. **Backend** : `cd backend && python main.py` (Port 8002)
2. **Frontend** : `cd frontend && npm run dev` (Port 3000)
3. **Accès** : http://localhost:3000

### API Endpoints
- `POST /predict` : Prédiction d'addiction
- `GET /model/info` : Informations modèle
- `GET /features/importance` : Features importantes
- `GET /health` : Status système

## 🏆 Résultats

Système complet fonctionnel avec :
- ✅ Performance ML d'élite (98% F1)
- ✅ Interface utilisateur moderne
- ✅ API REST robuste
- ✅ Prédictions variées et pertinentes
- ✅ Monitoring et status en temps réel
