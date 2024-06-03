from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
import requests
from bs4 import BeautifulSoup

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, password=password)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class ImagePagination(PageNumberPagination):
    page_size = 10

class ScrapeImagesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        urls = request.data.get('urls', '')
        if not urls:
            return Response({"error": "No URLs provided"}, status=status.HTTP_400_BAD_REQUEST)

        urls = urls.split(',')
        image_urls = []

        for url in urls:
            try:
                response = requests.get(url)
                soup = BeautifulSoup(response.content, 'html.parser')
                images = soup.find_all('img')
                for img in images:
                    src = img.get('src')
                    if src:
                        if src.startswith('http'):
                            image_urls.append(src)
                        else:
                            image_urls.append(url + src)
            except Exception as e:
                print(f"Error scraping {url}: {e}")

        paginator = ImagePagination()
        result_page = paginator.paginate_queryset(image_urls, request)
        return paginator.get_paginated_response(result_page)
