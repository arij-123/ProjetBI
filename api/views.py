import pandas as pd
import pickle
from pathlib import Path
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import PredictionHistory
from .serializers import PredictionInputSerializer, PredictionHistorySerializer

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL = None

def load_model():
    global MODEL
    if MODEL is None:
        try:
            model_path = BASE_DIR / 'best_model.pkl'
            with open(model_path, 'rb') as f:
                MODEL = pickle.load(f)
            print("✅ Modèle chargé depuis best_model.pkl")
        except Exception as e:
            print(f"❌ Erreur chargement modèle: {e}")
    return MODEL


# ─────────────────────────────────────────
# POST /api/predict/
# ─────────────────────────────────────────
class PredictView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PredictionInputSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#Récupérer les données
        data = serializer.validated_data
        model = load_model()

        if model is None:
            return Response({'error': 'Modèle non disponible'}, status=500)

        input_df = pd.DataFrame([data])
        prediction_num = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][int(prediction_num)]
        prediction_label = 'addicted' if prediction_num == 1 else 'not addicted'

        # Sauvegarder avec l'utilisateur connecté
        PredictionHistory.objects.create(
            user=request.user,
            **data,
            prediction=prediction_label,
            probability=round(float(probability) * 100, 2)
        )

        return Response({
            'prediction': prediction_label,
            'probability': round(float(probability) * 100, 2),
            'is_addicted': bool(prediction_num == 1)
        })


# ─────────────────────────────────────────
# GET /api/stats/
# ─────────────────────────────────────────
class StatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            df = pd.read_csv(settings.DATASET_PATH)
            if df.columns[0].startswith('Unnamed'):
                df = df.drop(df.columns[0], axis=1)

            total = len(df)
            addicted_count = len(df[df['addicted'] == 'addicted'])
            not_addicted_count = len(df[df['addicted'] == 'not addicted'])

            return Response({
                'total_records': total,
                'addicted_count': addicted_count,
                'not_addicted_count': not_addicted_count,
                'addicted_percent': round(addicted_count / total * 100, 2),
                'averages': {
                    'daily_screen_time':  round(df['daily_screen_time'].mean(), 2),
                    'app_sessions':       round(df['app_sessions'].mean(), 2),
                    'social_media_usage': round(df['social_media_usage'].mean(), 2),
                    'gaming_time':        round(df['gaming_time'].mean(), 2),
                    'notifications':      round(df['notifications'].mean(), 2),
                    'night_usage':        round(df['night_usage'].mean(), 2),
                    'age':                round(df['age'].mean(), 2),
                    'stress_level':       round(df['stress_level'].mean(), 2),
                    'apps_installed':     round(df['apps_installed'].mean(), 2),
                },
                'age_distribution': df['age'].value_counts().sort_index().to_dict(),
                'stress_distribution': df['stress_level'].value_counts().sort_index().to_dict(),
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)


# ─────────────────────────────────────────
# GET /api/history/  → uniquement l'user connecté
# ─────────────────────────────────────────
class HistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Filtrer par utilisateur connecté
        predictions = PredictionHistory.objects.filter(user=request.user)[:50]
        serializer = PredictionHistorySerializer(predictions, many=True)
        return Response({
            'count': PredictionHistory.objects.filter(user=request.user).count(),
            'results': serializer.data
        })

    def delete(self, request):
        PredictionHistory.objects.filter(user=request.user).delete()
        return Response({'message': 'Historique supprimé'})