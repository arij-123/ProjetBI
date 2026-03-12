from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from api.views_auth import SignupView, LoginView, LogoutView, MeView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),

    # Auth endpoints
    path('api/auth/signup/',  SignupView.as_view(),  name='signup'),
    path('api/auth/login/',   LoginView.as_view(),   name='login'),
    path('api/auth/logout/',  LogoutView.as_view(),  name='logout'),
    path('api/auth/me/',      MeView.as_view(),      name='me'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]