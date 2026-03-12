import React from 'react'
import { Brain, Github, Mail, Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">
                MobileAI
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Système intelligent de prédiction d'addiction au mobile
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Prédiction en temps réel</li>
              <li>Précision de 98%</li>
              <li>10 indicateurs analysés</li>
              <li>Interface moderne</li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h3 className="font-semibold mb-4">Technologie</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>React 18</li>
              <li>FastAPI Backend</li>
              <li>XGBoost ML</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <a href="mailto:contact@mobileai.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@mobileai.com</span>
              </a>
              <a href="https://github.com/mobileai" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
                <span className="text-sm">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 MobileAI. Tous droits réservés.
            </p>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for better digital health
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
