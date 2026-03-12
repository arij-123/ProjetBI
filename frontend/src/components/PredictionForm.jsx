import React, { useState } from 'react'
import { Send, Smartphone, Clock, Users, AlertTriangle } from 'lucide-react'
import { cn } from '../utils/cn'
import { API_URLS } from '../config/api'

const PredictionForm = ({ setPredictionResult, setIsLoading }) => {
  const [formData, setFormData] = useState({
    daily_screen_time: 5,
    app_sessions: 40,
    social_media_usage: 3,
    gaming_time: 1,
    notifications: 60,
    night_usage: 2,
    age: 25,
    work_study_hours: 8,
    stress_level: 5,
    apps_installed: 30
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.daily_screen_time || formData.daily_screen_time < 0) {
      newErrors.daily_screen_time = 'Veuillez entrer un temps d\'écran valide'
    }
    if (!formData.app_sessions || formData.app_sessions < 0) {
      newErrors.app_sessions = 'Veuillez entrer un nombre de sessions valide'
    }
    if (!formData.age || formData.age < 13 || formData.age > 100) {
      newErrors.age = 'Veuillez entrer un âge entre 13 et 100'
    }
    if (!formData.notifications || formData.notifications < 0) {
      newErrors.notifications = 'Veuillez entrer un nombre de notifications valide'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch(API_URLS.PREDICT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          daily_screen_time: parseFloat(formData.daily_screen_time),
          app_sessions: parseInt(formData.app_sessions),
          social_media_usage: parseFloat(formData.social_media_usage),
          gaming_time: parseFloat(formData.gaming_time),
          notifications: parseInt(formData.notifications),
          night_usage: parseFloat(formData.night_usage),
          age: parseInt(formData.age),
          work_study_hours: parseFloat(formData.work_study_hours),
          stress_level: parseInt(formData.stress_level),
          apps_installed: parseInt(formData.apps_installed)
        })
      })

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      // S'assurer que les probabilités sont des nombres
      const normalizedResult = {
        ...result,
        probability_addicted: parseFloat(result.probability_addicted) || 0,
        probability_not_addicted: parseFloat(result.probability_not_addicted) || 0,
        confidence: parseFloat(result.confidence) || 0
      }

      setPredictionResult(normalizedResult)
    } catch (error) {
      console.error('Prediction error:', error)
      if (error.message.includes('Failed to fetch')) {
        setErrors({ submit: 'Impossible de contacter le serveur. Vérifiez que le backend est démarré.' })
      } else {
        setErrors({ submit: error.message })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      daily_screen_time: '',
      app_sessions: '',
      social_media_usage: '',
      gaming_time: '',
      notifications: '',
      night_usage: '',
      age: '',
      work_study_hours: '',
      stress_level: '',
      apps_installed: ''
    })
    setErrors({})
    setPredictionResult(null)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary-600" />
          Évaluation du Comportement Mobile
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Remplissez les informations sur l'utilisation mobile pour obtenir une évaluation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {errors.submit && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-error-700">{errors.submit}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Screen Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temps d'écran quotidien (heures)
            </label>
            <div className="relative">
              <input
                type="range"
                min="0.5"
                max="12"
                step="0.5"
                value={formData.daily_screen_time}
                onChange={(e) => setFormData({...formData, daily_screen_time: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0.5h</span>
                <span className="font-bold text-primary-600">{formData.daily_screen_time}h</span>
                <span>12h</span>
              </div>
            </div>
          </div>

          {/* App Sessions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de sessions par jour
            </label>
            <div className="relative">
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={formData.app_sessions}
                onChange={(e) => setFormData({...formData, app_sessions: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>10</span>
                <span className="font-bold text-primary-600">{formData.app_sessions}</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* Social Media Usage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temps réseaux sociaux (heures)
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={formData.social_media_usage}
                onChange={(e) => setFormData({...formData, social_media_usage: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0h</span>
                <span className="font-bold text-primary-600">{formData.social_media_usage}h</span>
                <span>8h</span>
              </div>
            </div>
          </div>

          {/* Gaming Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temps de jeu (heures)
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="6"
                step="0.5"
                value={formData.gaming_time}
                onChange={(e) => setFormData({...formData, gaming_time: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0h</span>
                <span className="font-bold text-primary-600">{formData.gaming_time}h</span>
                <span>6h</span>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notifications (par jour)
            </label>
            <div className="relative">
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={formData.notifications}
                onChange={(e) => setFormData({...formData, notifications: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>5</span>
                <span className="font-bold text-primary-600">{formData.notifications}</span>
                <span>200</span>
              </div>
            </div>
          </div>

          {/* Night Usage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usage nocturne (heures)
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={formData.night_usage}
                onChange={(e) => setFormData({...formData, night_usage: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0h</span>
                <span className="font-bold text-primary-600">{formData.night_usage}h</span>
                <span>5h</span>
              </div>
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Âge (années)
            </label>
            <div className="relative">
              <input
                type="range"
                min="13"
                max="80"
                step="1"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>13 ans</span>
                <span className="font-bold text-primary-600">{formData.age} ans</span>
                <span>80 ans</span>
              </div>
            </div>
          </div>

          {/* Work/Study Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heures de travail/étude (heures)
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="16"
                step="1"
                value={formData.work_study_hours}
                onChange={(e) => setFormData({...formData, work_study_hours: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0h</span>
                <span className="font-bold text-primary-600">{formData.work_study_hours}h</span>
                <span>16h</span>
              </div>
            </div>
          </div>

          {/* Stress Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau de stress (1-10)
            </label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={formData.stress_level}
                onChange={(e) => setFormData({...formData, stress_level: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>1 (très calme)</span>
                <span className="font-bold text-primary-600">{formData.stress_level}/10</span>
                <span>10 (très stressé)</span>
              </div>
            </div>
          </div>

          {/* Apps Installed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Applications installées (nombre)
            </label>
            <div className="relative">
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={formData.apps_installed}
                onChange={(e) => setFormData({...formData, apps_installed: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>5</span>
                <span className="font-bold text-primary-600">{formData.apps_installed}</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Analyser le comportement
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </form>
    </div>
  )
}

export default PredictionForm
