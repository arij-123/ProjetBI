# 📱 Mobile Addiction Classification

🚀 **Système complet de classification d'addiction mobile avec 98% de performance F1 Score**

## 🎯 Vue d'Ensemble

Application web complète utilisant le Machine Learning pour prédire le risque d'addiction mobile basé sur les comportements utilisateurs.

### Performance Exceptionnelle
- **🎯 F1 Score**: 98.0%
- **📊 Accuracy**: 97.98%
- **🔍 Precision**: 97.75%
- **📈 Recall**: 98.25%

## 🏗️ Architecture

```
Frontend (React) ←→ Backend (FastAPI) ←→ ML Model (XGBoost)
     (Port 3000)           (Port 8002)           (98% F1)
```

## 🚀 Démarrage Rapide

### Prérequis
- Python 3.8+
- Node.js 16+
- npm ou yarn

### 1. Backend (FastAPI + XGBoost)
```bash
cd backend
python main.py
# Serveur démarré sur http://localhost:8002
```

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
# Application sur http://localhost:3000
```

### 3. Accès
- 🌐 **Application**: http://localhost:3000
- 📚 **API Documentation**: http://localhost:8002/docs
- 🔍 **Health Check**: http://localhost:8002/health

## 📊 Fonctionnalités

### 🧠 Machine Learning
- **Modèle**: XGBoost entraîné sur 10,871 échantillons
- **Features**: 10 variables comportementales
- **Pipeline**: Scaler intégré + XGBoost
- **Performance**: 98% F1 Score

### ⚡ Backend API
- `POST /predict` - Prédiction d'addiction
- `GET /model/info` - Informations du modèle
- `GET /features/importance` - Features importantes
- `GET /health` - Status du système

### 🎨 Frontend React
- **Formulaire interactif** avec validation
- **Résultats détaillés** avec probabilités
- **Graphiques** d'importance des features
- **Status** de connexion backend en temps réel
- **Design moderne** avec TailwindCSS

## 📈 Features les Plus Influentes

1. **Notifications** (62.8%) - Nombre de notifications par jour
2. **App Sessions** (8.3%) - Sessions d'applications quotidiennes
3. **Stress Level** (7.7%) - Niveau de stress (1-10)
4. **Age** (4.9%) - Âge de l'utilisateur
5. **Social Media Usage** (3.3%) - Temps réseaux sociaux

## 🛠️ Technologies

### Backend
- **FastAPI** - API REST moderne et rapide
- **XGBoost** - Gradient Boosting pour ML
- **Pandas** - Manipulation des données
- **Pydantic** - Validation des données

### Frontend
- **React 18** - Framework JavaScript moderne
- **Vite** - Build tool ultra-rapide
- **TailwindCSS** - CSS utility-first
- **Lucide React** - Icônes modernes

### ML/Data
- **XGBoost** - Algorithme de gradient boosting
- **Scikit-learn** - Pipeline ML
- **MLflow** - Experiment tracking
- **Joblib** - Persistance des modèles

## 📁 Structure du Projet

```
mobile-addiction-classification/
├── 📋 README.md                    # Documentation principale
├── 📋 PROJECT_STRUCTURE.md         # Structure détaillée
├── 🤖 models/                      # Modèles ML et métriques
├── 📊 data/processed/              # Données prétraitées
├── 🧠 notebooks/                   # Recherche ML
│   └── training.ipynb             # Entraînement du modèle
├── ⚡ backend/                     # API FastAPI
│   └── main.py                    # Application principale
└── 🎨 frontend/                    # Application React
    ├── src/components/            # Composants React
    └── package.json               # Dépendances
```

## 🎯 Cas d'Usage

### 🟢 Faible Risque
- **Usage modéré**: <2h/jour, <30 notifications
- **Prédiction**: `not addicted` (99%+ confiance)

### 🟡 Risque Moyen  
- **Usage modéré-élevé**: 4-6h/jour, 50-100 notifications
- **Prédiction**: `borderline` (50-70% confiance)

### 🔴 Haut Risque
- **Usage excessif**: >8h/jour, >150 notifications
- **Prédiction**: `addicted` (95%+ confiance)

## 🧪 Tests

### Test API
```bash
curl -X POST http://localhost:8002/predict \
  -H "Content-Type: application/json" \
  -d '{
    "daily_screen_time": 7,
    "app_sessions": 45,
    "social_media_usage": 3,
    "gaming_time": 1,
    "notifications": 80,
    "night_usage": 2,
    "age": 25,
    "work_study_hours": 6,
    "stress_level": 7,
    "apps_installed": 30
  }'
```

### Health Check
```bash
curl http://localhost:8002/health
```

## 📝 Notes de Développement

### Points Clés
- Le modèle utilise son propre scaler intégré
- Performance exceptionnelle conservée (98% F1)
- Compatibilité frontend/backend parfaite
- Prédictions variées selon les profils

### Performance
- **Temps de réponse**: <2 secondes
- **Memory usage**: ~50MB (modèle)
- **CPU usage**: <5% (prédiction)

## 🏆 Résultats

✅ **Système complet fonctionnel**
- Performance ML d'élite (98% F1)
- Interface utilisateur moderne
- API REST robuste
- Monitoring en temps réel
- Documentation complète

🚀 **Prêt pour la production**
- Code propre et organisé
- Tests automatisés
- Documentation détaillée
- Structure claire

---

**Développé avec ❤️ en utilisant les meilleures pratiques ML et Web**
