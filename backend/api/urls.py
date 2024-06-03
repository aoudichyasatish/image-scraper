from django.urls import path
from .views import ScrapeImagesView, RegisterView, LoginView

urlpatterns = [
    path('scrape-images/', ScrapeImagesView.as_view(), name='scrape-images'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]
