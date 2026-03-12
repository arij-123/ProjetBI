import React from 'react'
import { Brain, CheckCircle, AlertTriangle, TrendingUp, Activity } from 'lucide-react'
import { cn } from '../utils/cn'

const ResultsCard = ({ predictionResult, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-primary-600 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Analyse en cours...
          </h3>
          <p className="text-gray-600">
            Notre IA analyse vos données comportementales
          </p>
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!predictionResult) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Résultats de l'analyse
          </h3>
          <p className="text-gray-600">
            Remplissez le formulaire pour obtenir une évaluation personnalisée
          </p>
        </div>
      </div>
    )
  }

  const isAddicted = predictionResult.prediction === 'addicted'
  const confidence = predictionResult.confidence

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          {isAddicted ? (
            <AlertTriangle className="w-5 h-5 text-warning-600" />
          ) : (
            <CheckCircle className="w-5 h-5 text-success-600" />
          )}
          Résultats de l'Analyse
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Basé sur l'analyse de {predictionResult.model_used}
        </p>
      </div>

      <div className="p-6">
        {/* Main Result */}
        <div className={cn(
          'rounded-xl p-6 mb-6 text-center',
          isAddicted 
            ? 'bg-warning-50 border border-warning-200' 
            : 'bg-success-50 border border-success-200'
        )}>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            {isAddicted ? (
              <AlertTriangle className="w-8 h-8 text-warning-600" />
            ) : (
              <CheckCircle className="w-8 h-8 text-success-600" />
            )}
          </div>
          
          <h4 className={cn(
            'text-2xl font-bold mb-2',
            isAddicted ? 'text-warning-800' : 'text-success-800'
          )}>
            {isAddicted ? 'Risque d\'Addiction Détecté' : 'Comportement Sain'}
          </h4>
          
          <p className={cn(
            'text-lg font-medium',
            isAddicted ? 'text-warning-700' : 'text-success-700'
          )}>
             {(confidence * 100).toFixed(1)}%
          </p>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <span className="font-medium text-gray-900">Probabilité Addiction</span>
            </div>
            <div className="text-2xl font-bold text-primary-600">
              {(predictionResult.probability_addicted * 100).toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-500" 
                style={{width: `${predictionResult.probability_addicted * 100}%`}}
              ></div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-secondary-600" />
              <span className="font-medium text-gray-900">Probabilité Sain</span>
            </div>
            <div className="text-2xl font-bold text-secondary-600">
              {(predictionResult.probability_not_addicted * 100).toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-secondary-600 h-2 rounded-full transition-all duration-500" 
                style={{width: `${predictionResult.probability_not_addicted * 100}%`}}
              ></div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Recommandations
          </h5>
          <ul className="space-y-2 text-sm text-blue-800">
            {isAddicted ? (
              <>
                <li>• Limitez le temps d'écran à moins de 4 heures par jour</li>
                <li>• Désactivez les notifications non essentielles</li>
                <li>• Évitez l'utilisation 1 heure avant de dormir</li>
                <li>• Pratiquez des activités sans écran régulièrement</li>
              </>
            ) : (
              <>
                <li>• Continuez à maintenir un équilibre sain</li>
                <li>• Surveillez régulièrement votre temps d'écran</li>
                <li>• Fixez des limites de temps pour certaines applications</li>
                <li>• Pratiquez des "digital detox" occasionnelles</li>
              </>
            )}
          </ul>
        </div>

        {/* Model Info */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Analyse effectuée par {predictionResult.model_used} | 
          Confiance : {(confidence * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

export default ResultsCard
