import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Info } from 'lucide-react'
import { API_URLS } from '../config/api'

const FeatureImportance = () => {
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatureImportance = async () => {
      try {
        const response = await fetch(API_URLS.FEATURES_IMPORTANCE)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (Array.isArray(data) && !data.error) {
          setFeatures(data.slice(0, 8)) // Top 8 features
        } else if (data.error) {
          console.error('API Error:', data.error)
          // Utiliser des données par défaut si l'API ne répond pas
          setFeatures([
            { feature: 'notifications', importance: 0.628 },
            { feature: 'app_sessions', importance: 0.083 },
            { feature: 'stress_level', importance: 0.077 },
            { feature: 'age', importance: 0.049 },
            { feature: 'social_media_usage', importance: 0.033 },
            { feature: 'gaming_time', importance: 0.032 },
            { feature: 'apps_installed', importance: 0.032 },
            { feature: 'night_usage', importance: 0.030 }
          ])
        }
      } catch (error) {
        console.error('Error fetching feature importance:', error)
        // Utiliser des données par défaut en cas d'erreur
        setFeatures([
          { feature: 'notifications', importance: 0.628 },
          { feature: 'app_sessions', importance: 0.083 },
          { feature: 'stress_level', importance: 0.077 },
          { feature: 'age', importance: 0.049 },
          { feature: 'social_media_usage', importance: 0.033 },
          { feature: 'gaming_time', importance: 0.032 },
          { feature: 'apps_installed', importance: 0.032 },
          { feature: 'night_usage', importance: 0.030 }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFeatureImportance()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-primary-600 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chargement des données...
          </h3>
          <p className="text-gray-600">
            Récupération de l'importance des features
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          Importance des Features
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Les facteurs les plus influents dans la détection d'addiction
        </p>
      </div>

      <div className="p-6">
        {/* Features List */}
        <div className="space-y-4">
          {features.map((feature, index) => {
            const importance = feature.importance * 100
            const width = Math.min(importance, 100) // Cap at 100%
            
            return (
              <div key={feature.feature} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                      {feature.feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <div className="w-2 h-2 bg-primary-100 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-primary-600 rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary-600">
                    {importance.toFixed(1)}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${width}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Insights */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Points Clés
              </h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Les notifications sont le facteur le plus prédictif ({features[0]?.importance ? (features[0].importance * 100).toFixed(1) : 0}%)</li>
                <li>• Le nombre de sessions et le stress sont également critiques</li>
                <li>• L'âge et les habitudes nocturnes influencent significativement</li>
                <li>• Notre modèle XGBoost analyse 10 facteurs comportementaux</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Model Performance */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600 mb-1">98.03%</div>
            <div className="text-sm text-gray-600">F1 Score</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-success-600 mb-1">98.01%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-secondary-600 mb-1">98.03%</div>
            <div className="text-sm text-gray-600">Precision</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureImportance
