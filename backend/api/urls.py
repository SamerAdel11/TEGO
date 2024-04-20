from django.urls import path, include
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    path('companies/', views.CompanyView.as_view()),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('get_tenders/',views.TenderListView.as_view(), name='get_tenders'),
    path('create_tender/',views.TenderCreateView.as_view(),name='create_tender'),
    path('add_response/',views.ResponseView.as_view(),name='add_response'),
    path('activate/<str:uidb64>/<str:token>', views.activate, name='activate'),
    path('verified/',views.CheckVerifiedView.as_view(),name='verified'),
    # path('get_responses/',views.ResponseListAPIView.as_view(),name='get_responses'),
    path('get_responses/',views.ResponseDetailAPIView.as_view(),name='get_responses'),
    path('update_response/<int:response_id>/', views.ResponseStatusUpdateAPIView.as_view(), name='response-status-update'),
    path('',views.create_custom_user,name='create_user'),
    path('email',views.email,name='email')
]
