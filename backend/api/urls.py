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
    path('get_host_tenders/', views.TenderHostView.as_view(),
         name='get_host_tenders'),
    path('get_tenders_supplier/', views.TenderSupplierView.as_view()),
    path('tender/', views.TenderView.as_view(), name='create_tender'),
    path('tender/<int:pk>', views.TenderView.as_view(), name='create_tender'),
#     path('update_tender_status/', views.UpdateTenderStatus.as_view()),
    path('get_tender/<int:pk>', views.RetrieveTender.as_view(), name='get_tender'),
    path('add_response/', views.ResponseView.as_view(), name='add_response'),
    path('activate/<str:uidb64>/<str:token>', views.activate, name='activate'),
    path('verified/', views.CheckVerifiedView.as_view(), name='verified'),
    # path('get_responses/',views.ResponseListAPIView.as_view(),name='get_responses'),
    path('get_responses/', views.ResponseDetailAPIView.as_view(),
         name='get_responses'),
    path("get_my_response/", views.MyResponseDetailAPIView.as_view(),
         name='get_my_response'),
    path('update_response/<int:response_id>/',
         views.ResponseStatusUpdateAPIView.as_view(), name='response-status-update'),
    path('', views.create_custom_user, name='create_user'),
    path('email', views.email, name='email'),
    path('test/', views.test.as_view(), name='test'),
    path('close_candidate_pool', views.CloseCandidatePool.as_view()),
    path('award_tender', views.AwardResponse.as_view()),
    path('score', views.Similarity),
    path('supplier_confirmation', views.SupplierConfirmation.as_view()),
    path('make_notifications_seen/', views.MakeNotificationsSeen.as_view()),
    path('contract/<int:tender_id>/<int:response_id>/', views.Contract.as_view()),
    path('model/', views.model.as_view()),
    path('list_transactions/', views.TransactionListView.as_view()),
    path('transactions/<int:response_id>/<int:tender_id>/',
         views.TransactionView.as_view()),
#     path('cancel_tender', views.CancelTender.as_view()),


    path('test_update_tender/<int:pk>',views.TestCreateTender.as_view()),
]
