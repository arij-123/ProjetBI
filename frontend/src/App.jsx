import React, { useState } from 'react'
import { Brain, Smartphone, Activity, BarChart3, Shield, Zap } from 'lucide-react'
import PredictionForm from './components/PredictionForm'
import ResultsCard from './components/ResultsCard'
import StatsCard from './components/StatsCard'
import FeatureImportance from './components/FeatureImportance'
import BackendStatus from './components/BackendStatus'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [predictionResult, setPredictionResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header />
      
      {/* Backend Status */}
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex justify-end">
          <BackendStatus />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-2 bg-primary-100 rounded-full">
            <Brain className="w-6 h-6 text-primary-600" />
            <span className="text-primary-700 font-semibold">AI Prediction System</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mobile Addiction
            <span className="text-primary-600"> Classification</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Système intelligent basé sur le machine learning pour prédire les risques d'addiction au mobile
            avec une précision de <span className="font-semibold text-primary-600">98%</span>
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <StatsCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Précision du Modèle"
              value="98.0%"
              description="F1 Score: 0.9803"
              color="primary"
            />
            <StatsCard
              icon={<Smartphone className="w-6 h-6" />}
              title="Features Analysées"
              value="10"
              description="Variables comportementales"
              color="secondary"
            />
            <StatsCard
              icon={<Zap className="w-6 h-6" />}
              title="Temps de Réponse"
              value="<2s"
              description="Prédiction instantanée"
              color="success"
            />
          </div>
        </section>

        {/* Prediction Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <PredictionForm 
              setPredictionResult={setPredictionResult}
              setIsLoading={setIsLoading}
            />
          </div>
          
          <div>
            <ResultsCard 
              predictionResult={predictionResult}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* Feature Importance Section */}
        <section className="mb-12">
          <FeatureImportance />
        </section>

        {/* How It Works
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça fonctionne ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Notre système analyse 10 indicateurs comportementaux pour évaluer le risque d'addiction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Collecte", desc: "Données utilisateur", icon: <Activity className="w-6 h-6" /> },
              { step: 2, title: "Prétraitement", desc: "Normalisation des données", icon: <Shield className="w-6 h-6" /> },
              { step: 3, title: "Prédiction", desc: "Modèle XGBoost", icon: <Brain className="w-6 h-6" /> },
              { step: 4, title: "Résultats", desc: "Analyse détaillée", icon: <BarChart3 className="w-6 h-6" /> },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600">
                    {item.icon}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section> */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
