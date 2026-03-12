import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './AddictionForm.css';

const AddictionForm = () => {
  const [formData, setFormData] = useState({
    age: 25,
    work_study_hours: 8,
    daily_screen_time: 4,
    app_sessions: 50,
    social_media_usage: 2,
    gaming_time: 1,
    notifications: 100,
    night_usage: 1,
    stress_level: 5,
    apps_installed: 30
  });

  const [results, setResults] = useState({
    score: 0,
    riskLevel: '',
    recommendations: [],
    categoryScores: {},
    prediction: '',
    confidence: '',
    probability: 0,
    timestamp: '',
    processingTime: 0
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [retryCount, setRetryCount] = useState(0);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'age' || field === 'app_sessions' || field === 'notifications' || field === 'stress_level' || field === 'apps_installed' 
        ? parseInt(value) 
        : parseFloat(value)
    }));
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
      if (response.ok) {
        setConnectionStatus('connected');
        setApiError(null);
        return true;
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      return false;
    }
  }, []);

  const callPredictionAPI = useCallback(async () => {
    setIsCalculating(true);
    setApiError(null);
    
    // Vérifier la connexion
    const isConnected = await checkConnection();
    if (!isConnected) {
      setApiError('Impossible de se connecter au serveur ML. Vérifiez que le backend est démarré sur http://localhost:8000');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Conversion des résultats de l'API en format attendu par le frontend
      setResults({
        score: Math.round(data.probability * 100),
        riskLevel: data.risk_level,
        recommendations: data.recommendations || [],
        categoryScores: data.feature_importance || {},
        prediction: data.prediction,
        confidence: data.confidence,
        probability: data.probability,
        timestamp: data.timestamp,
        processingTime: data.processing_time_ms
      });
      
      setRetryCount(0); // Reset retry count on success
      
    } catch (error) {
      console.error('Erreur API:', error);
      setApiError(error.message || 'Erreur de connexion au serveur ML.');
      
      // Retry logic
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => callPredictionAPI(), 2000 * (retryCount + 1)); // Exponential backoff
      }
    } finally {
      setIsCalculating(false);
    }
  }, [formData, checkConnection, retryCount]);

  const calculateAddictionScore = () => {
    callPredictionAPI();
  };

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('addictionFormData', JSON.stringify(formData));
      localStorage.setItem('addictionResults', JSON.stringify(results));
      alert('Profil sauvegardé localement !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde locale');
    }
  };

  const downloadReport = () => {
    const report = {
      date: new Date().toLocaleDateString(),
      formData,
      results,
      connectionStatus,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-addiction-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFormData({
      age: 25,
      work_study_hours: 8,
      daily_screen_time: 4,
      app_sessions: 50,
      social_media_usage: 2,
      gaming_time: 1,
      notifications: 100,
      night_usage: 1,
      stress_level: 5,
      apps_installed: 30
    });
    setResults({
      score: 0,
      riskLevel: '',
      recommendations: [],
      categoryScores: {},
      prediction: '',
      confidence: '',
      probability: 0,
      timestamp: '',
      processingTime: 0
    });
    setApiError(null);
  };

  useEffect(() => {
    // Vérifier la connexion au montage
    checkConnection();
    
    // Configurer une vérification périodique
    const interval = setInterval(checkConnection, 30000); // Toutes les 30 secondes
    
    return () => clearInterval(interval);
  }, [checkConnection]);
  
  useEffect(() => {
    const savedData = localStorage.getItem('addictionFormData');
    const savedResults = localStorage.getItem('addictionResults');
    
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error('Erreur lors du chargement des données sauvegardées:', error);
      }
    }
    if (savedResults) {
      try {
        setResults(JSON.parse(savedResults));
      } catch (error) {
        console.error('Erreur lors du chargement des résultats sauvegardés:', error);
      }
    }
  }, []);

  return (
    <div className="addiction-form-container">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card">
              <div className="card-header bg-primary text-white text-center">
                <h2 className="mb-2">
                  <i className="fas fa-mobile-alt me-2"></i>
                  Analyse d'Addiction au Smartphone
                </h2>
                <p className="mb-2">
                  Évaluez votre niveau d'addiction grâce à notre système de machine learning
                </p>
                <div className={`connection-status ${connectionStatus}`}>
                  <i className={`fas ${connectionStatus === 'connected' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                  <span className="ms-2">
                    {connectionStatus === 'connected' ? 'Connecté au serveur ML' : 'Hors ligne'}
                  </span>
                </div>
              </div>

              <div className="card-body">
                {apiError && (
                  <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {apiError}
                    <button type="button" className="btn-close" onClick={() => setApiError(null)}></button>
                  </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); calculateAddictionScore(); }}>
                  {/* Section Informations Personnelles */}
                  <div className="section-card mb-4">
                    <h5 className="section-title">
                      <i className="fas fa-user me-2"></i>
                      Informations Personnelles
                    </h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Âge: <span className="text-primary fw-bold">{formData.age}</span> ans
                        </label>
                        <input
                          type="range"
                          className="form-range"
                          min="13"
                          max="80"
                          value={formData.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Heures travail/étude: <span className="text-primary fw-bold">{formData.work_study_hours}</span>h
                        </label>
                        <input
                          type="range"
                          className="form-range"
                          min="0"
                          max="16"
                          step="0.5"
                          value={formData.work_study_hours}
                          onChange={(e) => handleInputChange('work_study_hours', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section Utilisation Mobile */}
                  <div className="section-card mb-4">
                    <h5 className="section-title">
                      <i className="fas fa-mobile-alt me-2"></i>
                      Utilisation Mobile
                    </h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Temps d'écran quotidien: <span className="text-primary fw-bold">{formData.daily_screen_time}</span>h
                        </label>
                        <input
                          type="range"
                          className="form-range"
                          min="0"
                          max="12"
                          step="0.5"
                          value={formData.daily_screen_time}
                          onChange={(e) => handleInputChange('daily_screen_time', e.target.value)}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Sessions par jour: <span className="text-primary fw-bold">{formData.app_sessions}</span>
                        </label>
                        <input
                          type="range"
                          className="form-range"
                          min="0"
                          max="200"
                          step="5"
                          value={formData.app_sessions}
                          onChange={(e) => handleInputChange('app_sessions', e.target.value)}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Réseaux sociaux: <span className="text-primary fw-bold">{formData.social_media_usage}</span>h
                        </label>
                        <input
                          type="range"
                          className="form-range"
                          min="0"
                          max="8"
                          step="0.5"
                          value={formData.social_media_usage}
                          onChange={(e) => handleInputChange('social_media_usage', e.target.value)}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Gaming: <span className="text-primary fw-bold">{formData.gaming_time}</span>h
                        </label>
                        <input
                          type="range"
                          className="form-range"
                          min="0"
                          max="8"
                          step="0.5"
                          value={formData.gaming_time}
                          onChange={(e) => handleInputChange('gaming_time', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section Comportement */}
                  <div className="section-card mb-4">
                    <h5 className="section-title">
                      <i className="fas fa-brain me-2"></i>
                      Comportement
                    </h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Notifications/jour: <span className="text-primary fw-bold">{formData.notifications}</span>
                        </label>
                        <input
                          type="range"
                          className="form-range"
                          min="0"
                          max="500"
                          step="10"
                          value={formData.notifications}
                          onChange={(e) => handleInputChange('notifications', e.target.value)}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Usage nocturne: <span className="text-primary fw-bold">{formData.night_usage}</span>h
                        </label>
                        <input
                          type="range"
                          className="form-range"
                          min="0"
                          max="6"
                          step="0.5"
                          value={formData.night_usage}
                          onChange={(e) => handleInputChange('night_usage', e.target.value)}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Niveau de stress: <span className="text-primary fw-bold">{formData.stress_level}</span>/10
                        </label>
                        <input
                          type="range"
                          className="form-range"
                          min="1"
                          max="10"
                          value={formData.stress_level}
                          onChange={(e) => handleInputChange('stress_level', e.target.value)}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Apps installées: <span className="text-primary fw-bold">{formData.apps_installed}</span>
                        </label>
                        <input
                          type="range"
                          className="form-range"
                          min="0"
                          max="200"
                          step="5"
                          value={formData.apps_installed}
                          onChange={(e) => handleInputChange('apps_installed', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-4 me-2"
                      disabled={isCalculating || connectionStatus !== 'connected'}
                    >
                      {isCalculating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          {retryCount > 0 ? `Tentative ${retryCount + 1}/3...` : 'Analyse en cours...'}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-chart-line me-2"></i>
                          Évaluer mon risque
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg px-4"
                      onClick={resetForm}
                    >
                      <i className="fas fa-redo me-2"></i>
                      Réinitialiser
                    </button>
                    {connectionStatus !== 'connected' && (
                      <div className="mt-2">
                        <small className="text-muted">
                          <i className="fas fa-info-circle me-1"></i>
                          Le serveur ML doit être démarré pour utiliser cette fonctionnalité
                        </small>
                      </div>
                    )}
                  </div>
                </form>

                {/* Results Section */}
                {results.score > 0 && (
                  <div className="results-section mt-4">
                    <h4 className="text-center mb-4">
                      <i className="fas fa-chart-pie me-2"></i>
                      Résultats de l'Analyse
                    </h4>
                    
                    <div className="row mb-4">
                      <div className="col-md-3 mb-3">
                        <div className="card text-center h-100">
                          <div className="card-body">
                            <h6 className="card-title">Score Global</h6>
                            <div className="h3 fw-bold text-primary">
                              {results.score}
                            </div>
                            <small className="text-muted">/ 100</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="card text-center h-100">
                          <div className="card-body">
                            <h6 className="card-title">Prédiction</h6>
                            <div className={`h5 fw-bold ${
                              results.prediction === 'Addicted' ? 'text-danger' : 'text-success'
                            }`}>
                              {results.prediction}
                            </div>
                            <small className="text-muted">{results.confidence}</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="card text-center h-100">
                          <div className="card-body">
                            <h6 className="card-title">Niveau de Risque</h6>
                            <div className="h5 fw-bold">
                              {results.riskLevel}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="card text-center h-100">
                          <div className="card-body">
                            <h6 className="card-title">Temps</h6>
                            <div className="h5 fw-bold text-info">
                              {results.processingTime > 0 ? `${results.processingTime.toFixed(0)}ms` : 'N/A'}
                            </div>
                            <small className="text-muted">Traitement</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-4">
                      <div className="col-12">
                        <h6 className="mb-3">
                          <i className="fas fa-chart-bar me-2"></i>
                          Analyse des Caractéristiques
                        </h6>
                        <div className="progress-stacked">
                          {Object.entries(results.categoryScores).slice(0, 6).map(([key, value], index) => (
                            <div key={key} className="progress" style={{width: `${Math.abs(value || 0) * 100}%`}}>
                              <div className={`progress-bar bg-${['primary', 'info', 'warning', 'danger', 'secondary', 'success'][index]}`}>
                                {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <button className="btn btn-outline-primary me-2" onClick={saveToLocalStorage}>
                        <i className="fas fa-save me-2"></i>
                        Sauvegarder
                      </button>
                      <button className="btn btn-outline-success me-2" onClick={downloadReport}>
                        <i className="fas fa-download me-2"></i>
                        Télécharger
                      </button>
                      <button className="btn btn-outline-info" onClick={() => {
                        const text = `Mon score d'addiction mobile: ${results.score}/100 (${results.riskLevel})`;
                        navigator.share ? navigator.share({ text }) : navigator.clipboard.writeText(text);
                      }}>
                        <i className="fas fa-share-alt me-2"></i>
                        Partager
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddictionForm;
