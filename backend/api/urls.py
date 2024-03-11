from django.urls import path,include
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns=[
    # path('register/',views.UserView),
    # path('companies/<str:pk>',views.CompanyView.as_view()),
    path('companies/',views.CompanyView.as_view()),
    path('login/',views.LoginView.as_view()),
    path('user/',views.UserView.as_view()),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('stakeholders/',views.Stakeholders.as_view())
] 