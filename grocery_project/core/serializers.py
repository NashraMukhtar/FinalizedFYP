from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from grocery_app.models import Recipe, ShoppingItem, GroceryItem

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class UserListSerializer(serializers.ModelSerializer):
    grocery_items_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_active', 'date_joined', 'last_login', 'grocery_items_count']

    def get_grocery_items_count(self, obj):
        return GroceryItem.objects.filter(user=obj).count()

class ActivityRecipeSerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(source='created_by.username')

    class Meta:
        model = Recipe
        fields = ['id', 'name', 'created_by']

class ActivityGrocerySerializer(serializers.ModelSerializer):
    ingredient = serializers.CharField(source='ingredient.name')

    class Meta:
        model = GroceryItem
        fields = ['id', 'ingredient']

class ActivityShoppingSerializer(serializers.ModelSerializer):
    ingredient = serializers.CharField(source='ingredient.name')

    class Meta:
        model = ShoppingItem
        fields = ['id', 'ingredient']

class UserActivitySerializer(serializers.Serializer):
    user = UserListSerializer()
    recipes = ActivityRecipeSerializer(many=True)
    grocery_items = ActivityGrocerySerializer(many=True)
    shopping_items = ActivityShoppingSerializer(many=True)