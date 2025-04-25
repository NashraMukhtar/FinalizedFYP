from django.urls import path
from .views import RegisterView, LoginView, LogoutView, get_user_details, UserListView, get_user_activity, UserDeleteView, dashboard_counts, OCRGroceryExtractView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('get-user/', get_user_details, name='get-user'),
    path('all-users/', UserListView.as_view(), name='all-users'),
    path('users/<int:user_id>/activity/', get_user_activity, name='user-activity'),
    path('users/<int:id>/delete/', UserDeleteView.as_view(), name='delete-user'),
    path('dashboard-counts/', dashboard_counts),
    path('extract-grocery/', OCRGroceryExtractView.as_view(), name='extract-grocery'),
]
