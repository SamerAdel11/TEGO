import jwt
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.exceptions import DenyConnection


class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        headers = dict(scope['headers'])
        if b'authorization' in headers:
            try:
                token = headers[b'authorization'].decode().split()[1]
                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = decoded_token.get('user_id')
                if user_id is not None:
                    # Assuming you have a custom user model
                    user = await self.get_user(user_id)
                    scope['user'] = user
                    return await self.inner(scope, receive, send)
                else:
                    raise DenyConnection("Invalid token: No user ID found")
            except (jwt.ExpiredSignatureError, jwt.DecodeError, IndexError, KeyError):
                raise DenyConnection("Invalid token")
        else:
            scope['user'] = AnonymousUser()
            raise DenyConnection("Unauthorized: Missing authorization header")

    async def get_user(self, user_id):
        # Implement your logic to get the user based on the user_id
        # For example, if you're using Django's default user model:
        # from django.contrib.auth.models import User
        return await CustomUser.objects.get(id=user_id)
        pass

