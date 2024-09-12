from django.urls import path, include
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [

     path('companies/', views.CompanyRegisterationView.as_view()),
     path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
     path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     path('get_host_tenders/', views.ListHostTenders.as_view(),
          name='get_host_tenders'),
     path('get_tenders_supplier/', views.TenderSupplierView.as_view()),
     path('tender/', views.TenderView.as_view(), name='create_tender'),
     path('tender/<int:pk>', views.TenderView.as_view(), name='create_tender'),

     path('response/', views.ResponseView.as_view(), name='add_response'),
     path('response/<int:pk>', views.ResponseView.as_view(), name='add_response'),

     path('activate/<str:uidb64>/<str:token>', views.activate, name='activate'),
     path('verified/', views.CheckVerifiedView.as_view(), name='verified'),
     path('list_responses/<int:tender_id>', views.ListResponses.as_view(),
          name='get_responses'),
     path('update_response/<int:response_id>/',
     views.ResponseStatusUpdateAPIView.as_view(), name='response-status-update'),

     path('close_candidate_pool/<int:pk>', views.CloseCandidatePool.as_view()),
     path('award_tender/<int:tender_id>/<int:response_id>', views.AwardResponse.as_view()),
     path('score', views.Similarity),
     path('supplier_confirmation/<int:tender_id>/<int:response_id>', views.SupplierConfirmation.as_view()),
     path('make_notifications_seen/', views.MakeNotificationsSeen.as_view()),
     path('contract/<int:tender_id>/<int:response_id>/', views.Contract.as_view()),
     path('model/', views.model.as_view()),
     path('list_transactions/', views.TransactionListView.as_view()),
     path('transactions/<int:response_id>/<int:tender_id>/',
          views.TransactionView.as_view()),
     path('use_template/<int:pk>',views.UseTemplate.as_view()),
     path('google_login/', views.googleAuth.as_view(), name='google_login'),
     path('oauth2callback/', views.oauth2callback.as_view(), name='oauth2callback'),

]
