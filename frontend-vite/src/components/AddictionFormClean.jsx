import React, { useState, useEffect, useCallback } from 'react';

const AddictionFormClean = () => {
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
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = useCallback((field, value) => {
    const numValue = field === 'age' || field === 'app_sessions' || field === 'notifications' || field === 'stress_level' || field === 'apps_installed' 
      ? parseInt(value) 
      : parseFloat(value);
    
    setFormData(prev => ({
      ...prev,
      [field]: numValue
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
    setShowResults(false);
    
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
      
      setRetryCount(0);
      setShowResults(true);
      
    } catch (error) {
      console.error('Erreur API:', error);
      setApiError(error.message || 'Erreur de connexion au serveur ML.');
      
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => callPredictionAPI(), 2000 * (retryCount + 1));
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
      date: new Date().toLocaleDateString('fr-FR'),
      formData,
      results,
      connectionStatus,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-addiction-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert('Rapport téléchargé !');
  };

  const shareResults = async () => {
    const text = `Mon score d'addiction mobile: ${results.score}/100 (${results.riskLevel})`;
    
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        alert('Résultats copiés dans le presse-papiers !');
      }
    } catch (error) {
      alert('Erreur lors du partage');
    }
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
    setShowResults(false);
    setApiError(null);
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
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
        setShowResults(true);
      } catch (error) {
        console.error('Erreur lors du chargement des résultats sauvegardés:', error);
      }
    }
  }, []);

  const formSections = [
    {
      title: 'Informations Personnelles',
      icon: 'fa-user',
      fields: [
        { key: 'age', label: 'Âge', min: 13, max: 80, unit: ' ans' },
        { key: 'work_study_hours', label: 'Heures travail/étude', min: 0, max: 16, step: 0.5, unit: 'h' }
      ]
    },
    {
      title: 'Utilisation Mobile',
      icon: 'fa-mobile-alt',
      fields: [
        { key: 'daily_screen_time', label: 'Temps d\'écran quotidien', min: 0, max: 12, step: 0.5, unit: 'h' },
        { key: 'app_sessions', label: 'Sessions par jour', min: 0, max: 200, step: 5, unit: '' },
        { key: 'social_media_usage', label: 'Réseaux sociaux', min: 0, max: 8, step: 0.5, unit: 'h' },
        { key: 'gaming_time', label: 'Gaming', min: 0, max: 8, step: 0.5, unit: 'h' }
      ]
    },
    {
      title: 'Comportement',
      icon: 'fa-brain',
      fields: [
        { key: 'notifications', label: 'Notifications/jour', min: 0, max: 500, step: 10, unit: '' },
        { key: 'night_usage', label: 'Usage nocturne', min: 0, max: 6, step: 0.5, unit: 'h' },
        { key: 'stress_level', label: 'Niveau de stress', min: 1, max: 10, unit: '/10' },
        { key: 'apps_installed', label: 'Apps installées', min: 0, max: 200, step: 5, unit: '' }
      ]
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #eef2ff, white, #f9fafb)' }}>
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40 safe-top">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <i className="fas fa-mobile-alt text-white"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">Addiction Mobile</h1>
                <p className="text-sm text-gray-600">Analyse ML intelligente</p>
              </div>
            </div>
            <div className={`connection-status ${connectionStatus === 'connected' ? 'connected' : 'disconnected'}`}>
              <i className={`fas text-sm ${connectionStatus === 'connected' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
              <span className="text-xs font-medium">
                {connectionStatus === 'connected' ? 'Connecté' : 'Hors ligne'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Évaluez votre niveau d'addiction mobile
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre système de machine learning analyse vos habitudes d'utilisation pour vous fournir 
            une évaluation précise et personnalisée.
          </p>
        </div>

        {/* Form */}
        <div className="card mb-8 hover-lift mx-auto max-w-3xl">
          <div className="card-header text-center pb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              <i className="fas fa-chart-line mr-2 text-primary-600"></i>
              Questionnaire d'Évaluation
            </h3>
            <p className="text-gray-600">
              Ajustez les curseurs pour refléter votre utilisation quotidienne
            </p>
          </div>
          
          <div className="card-body space-y-8">
            {apiError && (
              <div className="alert alert-error">
                <i className="fas fa-exclamation-triangle"></i>
                <div>
                  <p className="font-medium">Erreur de connexion</p>
                  <p className="text-sm">{apiError}</p>
                </div>
                <button 
                  onClick={() => setApiError(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); calculateAddictionScore(); }}>
              {formSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <i className={`fas mr-2 ${section.icon} text-primary-600`}></i>
                    {section.title}
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    {section.fields.map((field, fieldIndex) => (
                      <div key={field.key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="form-label">{field.label}</label>
                          <span className="text-sm font-medium text-gray-700">
                            {formData[field.key]}{field.unit}
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="range"
                            className="range-slider"
                            min={field.min}
                            max={field.max}
                            step={field.step || 1}
                            value={formData[field.key]}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{field.min}</span>
                            <span>{field.max}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={isCalculating || connectionStatus !== 'connected'}
                >
                  {isCalculating ? (
                    <>
                      <div className="spinner spinner-md"></div>
                      {retryCount > 0 ? `Tentative ${retryCount + 1}/3...` : 'Analyse en cours...'}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-chart-line"></i>
                      Évaluer mon risque
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={resetForm}
                >
                  <i className="fas fa-redo"></i>
                  Réinitialiser
                </button>
              </div>

              {connectionStatus !== 'connected' && (
                <div className="text-center mt-4">
                  <p className="text-sm text-yellow-600 flex items-center justify-center">
                    <i className="fas fa-info-circle mr-2"></i>
                    Le serveur ML doit être démarré pour utiliser cette fonctionnalité
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Results */}
        {showResults && results.score > 0 && (
          <div className="card animate-scale-in mx-auto max-w-3xl">
            <div className="card-header text-center pb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                <i className="fas fa-chart-pie mr-2 text-primary-600"></i>
                Résultats de l'Analyse
              </h3>
              <p className="text-gray-600">
                Basé sur notre modèle de machine learning
              </p>
            </div>
            
            <div className="card-body space-y-6">
              {/* Score Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-primary-50 rounded-xl p-4 text-center hover-lift">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {results.score}
                  </div>
                  <div className="text-sm text-primary-700 font-medium">Score Global</div>
                  <div className="text-xs text-primary-600">/ 100</div>
                </div>
                
                <div className={`rounded-xl p-4 text-center hover-lift ${
                  results.prediction === 'Addicted' 
                    ? 'bg-red-50' 
                    : 'bg-green-50'
                }`}>
                  <div className={`text-2xl font-bold mb-1 ${
                    results.prediction === 'Addicted' 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {results.prediction}
                  </div>
                  <div className={`text-xs font-medium ${
                    results.prediction === 'Addicted' 
                      ? 'text-red-700' 
                      : 'text-green-700'
                  }`}>
                    {results.confidence}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 text-center hover-lift">
                  <div className="text-2xl font-bold text-gray-700 mb-1">
                    {results.riskLevel}
                  </div>
                  <div className="text-xs text-gray-600">Niveau de Risque</div>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4 text-center hover-lift">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {results.processingTime > 0 ? `${results.processingTime.toFixed(0)}ms` : 'N/A'}
                  </div>
                  <div className="text-xs text-blue-600">Temps de Traitement</div>
                </div>
              </div>

              {/* Feature Importance */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <i className="fas fa-chart-bar mr-2 text-primary-600"></i>
                  Analyse des Caractéristiques
                </h4>
                <div className="space-y-2">
                  {Object.entries(results.categoryScores).slice(0, 6).map(([key, value], index) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-32 text-sm text-gray-600 truncate">
                        {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
                      </div>
                      <div className="flex-1">
                        <div className="progress">
                          <div 
                            className={`progress-bar ${
                              ['bg-primary-600', 'bg-gray-600', 'bg-red-600', 'bg-green-600', 'bg-yellow-600', 'bg-blue-600'][index % 6]
                            }`}
                            style={{ width: `${Math.abs(value || 0) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-12 text-sm text-right text-gray-600">
                        {Math.round((value || 0) * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="card-footer flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="btn btn-secondary"
                onClick={saveToLocalStorage}
              >
                <i className="fas fa-save"></i>
                Sauvegarder
              </button>
              
              <button
                className="btn btn-secondary"
                onClick={downloadReport}
              >
                <i className="fas fa-download"></i>
                Télécharger
              </button>
              
              <button
                className="btn btn-outline btn-primary"
                onClick={shareResults}
              >
                <i className="fas fa-share-alt"></i>
                Partager
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              <i className="fas fa-shield-alt mr-2"></i>
              Vos données sont traitées localement et ne sont jamais partagées
            </p>
            <p className="text-sm">
              Powered by Machine Learning • Accuracy: 97.94%
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AddictionFormClean;
