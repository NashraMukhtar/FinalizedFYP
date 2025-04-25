from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer, LoginSerializer, UserListSerializer, UserActivitySerializer
from .models import User
from grocery_app.models import Recipe, GroceryItem, ShoppingItem, Ingredient
from django.utils.timezone import now
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from PIL import Image
import pytesseract
from rapidfuzz import process
from grocery_app.models import Ingredient


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            if user:
                user.last_login = now()
                user.save()
                token, created = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=status.HTTP_200_OK)
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            # Get the token from the request
            token = request.auth
            # Delete the token to log out the user
            token.delete()
            return Response({"message": "Successfully logged out.", "token":token.key,}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "An error occurred during logout."}, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [IsAdminUser]

class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAdminUser]
    lookup_field = 'id'

@api_view(['GET'])
def get_user_details(request):
    user = request.user
    return Response({
        "username": user.username,
        "email": user.email,
        "role": user.role,
    })

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_user_activity(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        recipes = Recipe.objects.filter(created_by=user)
        groceries = GroceryItem.objects.filter(user=user)
        shopping_items = ShoppingItem.objects.filter(user=user)

        serializer = UserActivitySerializer({
            'user': user,
            'recipes': recipes,
            'grocery_items': groceries,
            'shopping_items': shopping_items
        })

        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)
    
@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_counts(request):
    return Response({
        "ingredients": Ingredient.objects.count(),
        "recipes": Recipe.objects.count(),
        "users": User.objects.count(),
    })

class OCRGroceryExtractView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({"error": "No image uploaded."}, status=400)
        

        # OCR image
        image = Image.open(image_file)
        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        raw_text = pytesseract.image_to_string(image)

        # Preprocess extracted lines
        extracted_lines = [line.strip().lower() for line in raw_text.split('\n') if line.strip()]
        ingredient_names = list(Ingredient.objects.values_list('name', flat=True))

        matched = []
        unmatched = []

        for item in extracted_lines:
            best_match = process.extractOne(item, ingredient_names, score_cutoff=80)
            if best_match:
                matched.append({
                    "input": item,
                    "match": best_match[0],  # matched ingredient
                    "score": best_match[1]   # match score (0-100)
                })
            else:
                unmatched.append(item)

        return Response({
            "matched": matched,
            "unmatched": unmatched,
            "raw": raw_text
        })