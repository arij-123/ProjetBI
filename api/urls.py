from django.urls import path
from .views import PredictView, StatsView, HistoryView

urlpatterns = [
    path('predict/', PredictView.as_view(), name='predict'),
    path('stats/',   StatsView.as_view(),   name='stats'),
    path('history/', HistoryView.as_view(), name='history'),
]
