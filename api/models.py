from django.db import models
from django.contrib.auth.models import User


class PredictionHistory(models.Model):
    # Lien avec l'utilisateur connecté
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='predictions')

    # Inputs
    daily_screen_time   = models.IntegerField()
    app_sessions        = models.IntegerField()
    social_media_usage  = models.IntegerField()
    gaming_time         = models.IntegerField()
    notifications       = models.IntegerField()
    night_usage         = models.IntegerField()
    age                 = models.IntegerField()
    work_study_hours    = models.IntegerField()
    stress_level        = models.IntegerField()
    apps_installed      = models.IntegerField()

    # Output
    prediction  = models.CharField(max_length=20)
    probability = models.FloatField()

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} — {self.prediction} — {self.created_at.strftime('%Y-%m-%d %H:%M')}"