from django.urls import re_path ,path
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from .consumers import NotificationConsumer
from .jwtauth import JWTAuthMiddleware
from django.core.asgi import get_asgi_application  # Import get_asgi_application

websocket_urlpatterns = [
    re_path(r'ws/notify/', NotificationConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
