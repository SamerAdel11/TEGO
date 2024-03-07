from django.urls import path,include
from . import views

urlpatterns=[
    path('register/',views.UserView),
    # path('companies/<str:pk>',views.CompanyView.as_view()),
    path('companies/',views.CompanyView.as_view()),
    # path('stakeholders/',views.Stakeholders.as_view())
]