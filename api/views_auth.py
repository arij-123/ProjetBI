from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken


def get_tokens_for_user(user):
    """Génère access + refresh token pour un utilisateur"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access':  str(refresh.access_token),
    }


# ─────────────────────────────────────────
# POST /api/auth/signup/
# ─────────────────────────────────────────
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username   = request.data.get('username', '').strip()
        email      = request.data.get('email', '').strip()
        password   = request.data.get('password', '')
        first_name = request.data.get('first_name', '').strip()
        last_name  = request.data.get('last_name', '').strip()

        # Validation
        if not username or not password:
            return Response(
                {'error': 'Username et password sont obligatoires'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Ce username existe déjà'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if email and User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Cet email est déjà utilisé'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(password) < 6:
            return Response(
                {'error': 'Le mot de passe doit avoir au moins 6 caractères'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Créer l'utilisateur
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        tokens = get_tokens_for_user(user)

        return Response({
            'message': 'Compte créé avec succès',
            'user': {
                'id':         user.id,
                'username':   user.username,
                'email':      user.email,
                'first_name': user.first_name,
                'last_name':  user.last_name,
            },
            **tokens
        }, status=status.HTTP_201_CREATED)


# ─────────────────────────────────────────
# POST /api/auth/login/
# ─────────────────────────────────────────
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if not username or not password:
            return Response(
                {'error': 'Username et password sont obligatoires'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {'error': 'Username ou mot de passe incorrect'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        tokens = get_tokens_for_user(user)

        return Response({
            'message': 'Connexion réussie',
            'user': {
                'id':         user.id,
                'username':   user.username,
                'email':      user.email,
                'first_name': user.first_name,
                'last_name':  user.last_name,
            },
            **tokens
        })


# ─────────────────────────────────────────
# POST /api/auth/logout/
# ─────────────────────────────────────────
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Déconnexion réussie'})
        except Exception:
            return Response({'message': 'Déconnecté'})


# ─────────────────────────────────────────
# GET /api/auth/me/
# ─────────────────────────────────────────
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id':         user.id,
            'username':   user.username,
            'email':      user.email,
            'first_name': user.first_name,
            'last_name':  user.last_name,
        })
