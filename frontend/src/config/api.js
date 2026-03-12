// Configuration centralisée de l'API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8002',
  ENDPOINTS: {
    PREDICT: '/predict',
    MODEL_INFO: '/model/info',
    FEATURES_IMPORTANCE: '/features/importance',
    HEALTH: '/health'
  }
}

// URLs complètes pour faciliter l'utilisation
export const API_URLS = {
  PREDICT: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PREDICT}`,
  MODEL_INFO: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MODEL_INFO}`,
  FEATURES_IMPORTANCE: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FEATURES_IMPORTANCE}`,
  HEALTH: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`
}
