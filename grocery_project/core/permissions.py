from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework import permissions

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.role == 'admin')

class IsAdminUserOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request, so we’ll always allow GET, HEAD, or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the recipe.
        return obj.created_by == request.user
    
class IsOwnerOrAdminOrReadOnly(BasePermission):
    """
    Custom permission to only allow owners of a recipe to edit/delete it.
    Admins can edit/delete any recipe.
    """

    def has_object_permission(self, request, view, obj):
        # SAFE_METHODS are always allowed (GET, HEAD, OPTIONS)
        if request.method in SAFE_METHODS:
            return True

        # Admins can do anything
        if request.user and request.user.is_staff:
            return True

        # Owners can edit/delete their own recipes
        return obj.created_by == request.user