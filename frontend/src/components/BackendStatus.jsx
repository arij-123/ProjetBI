import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react'
import { API_URLS } from '../config/api'

const BackendStatus = () => {
  const [status, setStatus] = useState('checking')
  const [modelInfo, setModelInfo] = useState(null)

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(API_URLS.HEALTH)
        if (response.ok) {
          const data = await response.json()
          setStatus('connected')
          setModelInfo(data)
        } else {
          setStatus('error')
        }
      } catch (error) {
        setStatus('disconnected')
      }
    }

    checkBackend()
    
    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkBackend, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'text-success-600',
          bgColor: 'bg-success-50',
          borderColor: 'border-success-200',
          text: 'Backend connecté',
          subtext: modelInfo?.model_loaded ? 'Modèle chargé' : 'Modèle non chargé'
        }
      case 'disconnected':
        return {
          icon: <WifiOff className="w-4 h-4" />,
          color: 'text-error-600',
          bgColor: 'bg-error-50',
          borderColor: 'border-error-200',
          text: 'Backend déconnecté',
          subtext: 'Serveur indisponible'
        }
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'text-warning-600',
          bgColor: 'bg-warning-50',
          borderColor: 'border-warning-200',
          text: 'Erreur backend',
          subtext: 'Réponse invalide'
        }
      default:
        return {
          icon: <Wifi className="w-4 h-4 animate-pulse" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          text: 'Vérification...',
          subtext: 'Test de connexion'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bgColor} ${config.borderColor} ${config.color}`}>
      {config.icon}
      <div className="text-sm">
        <div className="font-medium">{config.text}</div>
        <div className="text-xs opacity-75">{config.subtext}</div>
      </div>
    </div>
  )
}

export default BackendStatus
