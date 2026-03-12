from rest_framework import serializers
from .models import PredictionHistory


class PredictionInputSerializer(serializers.Serializer):
    """Valide les données envoyées par React"""
    daily_screen_time   = serializers.IntegerField(min_value=0)
    app_sessions        = serializers.IntegerField(min_value=0)
    social_media_usage  = serializers.IntegerField(min_value=0)
    gaming_time         = serializers.IntegerField(min_value=0)
    notifications       = serializers.IntegerField(min_value=0)
    night_usage         = serializers.IntegerField(min_value=0)
    age                 = serializers.IntegerField(min_value=1, max_value=100)
    work_study_hours    = serializers.IntegerField(min_value=0)
    stress_level        = serializers.IntegerField(min_value=0, max_value=10)
    apps_installed      = serializers.IntegerField(min_value=0)


class PredictionHistorySerializer(serializers.ModelSerializer):
    """Sérialise l'historique pour l'affichage"""
    class Meta:
        model = PredictionHistory
        fields = '__all__'
