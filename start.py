#!/usr/bin/env python3
"""
🚀 Mobile Addiction Classification - Script de Démarrage
Lance le backend et le frontend automatiquement
"""

import os
import sys
import subprocess
import time
import threading
from pathlib import Path

def print_banner():
    """Afficher la bannière de démarrage"""
    print("""
    📱 Mobile Addiction Classification
    🚀 Démarrage Automatique du Système
    🎯 Performance ML: 98% F1 Score
    
    =====================================
    """)

def check_requirements():
    """Vérifier les prérequis"""
    print("🔍 Vérification des prérequis...")
    
    # Vérifier Python
    python_version = sys.version_info
    if python_version.major < 3 or python_version.minor < 8:
        print("❌ Python 3.8+ requis")
        return False
    print(f"✅ Python {python_version.major}.{python_version.minor}.{python_version.micro}")
    
    # Vérifier Node.js
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js {result.stdout.strip()}")
        else:
            print("❌ Node.js non trouvé")
            return False
    except FileNotFoundError:
        print("❌ Node.js non trouvé")
        return False
    
    # Vérifier npm
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ npm {result.stdout.strip()}")
        else:
            print("❌ npm non trouvé")
            return False
    except FileNotFoundError:
        print("❌ npm non trouvé")
        return False
    
    return True

def start_backend():
    """Démarrer le backend FastAPI"""
    print("\n⚡ Démarrage du backend FastAPI...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Dossier backend non trouvé")
        return False
    
    try:
        # Changer au dossier backend
        os.chdir(backend_dir)
        
        # Démarrer le backend
        process = subprocess.Popen([
            sys.executable, 'main.py'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        print("✅ Backend en cours de démarrage...")
        print("📡 Port: 8002")
        print("📚 API Docs: http://localhost:8002/docs")
        
        # Attendre que le backend démarre
        time.sleep(3)
        
        # Vérifier que le backend fonctionne
        import requests
        try:
            response = requests.get('http://localhost:8002/health', timeout=5)
            if response.status_code == 200:
                print("✅ Backend prêt!")
                return process
            else:
                print("❌ Backend non prêt")
                return False
        except:
            print("⚠️ Backend démarré (vérification échouée)")
            return process
            
    except Exception as e:
        print(f"❌ Erreur démarrage backend: {e}")
        return False

def start_frontend():
    """Démarrer le frontend React"""
    print("\n🎨 Démarrage du frontend React...")
    
    frontend_dir = Path("../frontend")
    if not frontend_dir.exists():
        print("❌ Dossier frontend non trouvé")
        return False
    
    try:
        # Changer au dossier frontend
        os.chdir(frontend_dir)
        
        # Vérifier si node_modules existe
        if not Path("node_modules").exists():
            print("📦 Installation des dépendances...")
            result = subprocess.run(['npm', 'install'], capture_output=True, text=True)
            if result.returncode != 0:
                print("❌ Erreur installation dépendances")
                return False
            print("✅ Dépendances installées")
        
        # Démarrer le frontend
        print("🚀 Démarrage du serveur de développement...")
        process = subprocess.Popen([
            'npm', 'run', 'dev'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        print("✅ Frontend en cours de démarrage...")
        print("🌐 Port: 3000")
        print("🎯 Application: http://localhost:3000")
        
        return process
        
    except Exception as e:
        print(f"❌ Erreur démarrage frontend: {e}")
        return False

def main():
    """Fonction principale"""
    print_banner()
    
    # Vérifier les prérequis
    if not check_requirements():
        print("\n❌ Prérequis non satisfaits")
        print("Veuillez installer Python 3.8+ et Node.js")
        return
    
    # Sauvegarder le répertoire courant
    original_dir = os.getcwd()
    
    try:
        # Démarrer le backend
        backend_process = start_backend()
        if not backend_process:
            print("\n❌ Impossible de démarrer le backend")
            return
        
        # Démarrer le frontend
        frontend_process = start_frontend()
        if not frontend_process:
            print("\n❌ Impossible de démarrer le frontend")
            if backend_process:
                backend_process.terminate()
            return
        
        print("\n" + "="*50)
        print("🎉 SYSTÈME COMPLET DÉMARRÉ!")
        print("="*50)
        print("🌐 Frontend: http://localhost:3000")
        print("📡 Backend:  http://localhost:8002")
        print("📚 API Docs: http://localhost:8002/docs")
        print("🔍 Health:   http://localhost:8002/health")
        print("="*50)
        print("\n⏹️  Appuyez sur Ctrl+C pour arrêter")
        
        # Attendre que les processus se terminent
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n\n🛑 Arrêt du système...")
            
    finally:
        # Arrêter les processus
        if 'backend_process' in locals() and backend_process:
            backend_process.terminate()
            print("✅ Backend arrêté")
        
        if 'frontend_process' in locals() and frontend_process:
            frontend_process.terminate()
            print("✅ Frontend arrêté")
        
        # Revenir au répertoire original
        os.chdir(original_dir)
        
        print("\n👋 Au revoir!")

if __name__ == "__main__":
    main()
