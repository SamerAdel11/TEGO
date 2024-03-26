from .models import UserNotification,CustomUser
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from urllib.parse import parse_qs
import json
from django.contrib.auth.models import AnonymousUser
import jwt


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('connected')
        self.group_name = 'public_room'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

        # Fetch all existing notifications and send them to the client
        notifications = await self.get_all_notifications()
        for notification in notifications:
            await self.send_notification(notification.message)
    
    async def get_all_notifications(self):
        self.user = await self.authenticate_user(self.scope)
        if not self.user:
            print('that use is anonymous or not found')
            await self.close()
        # Fetch all notifications from the database
        return UserNotification.objects.filter(recipient=self.user)
    
    async def send_notification(self, message):
        print("message from notification is",message)
        await self.send(text_data=json.dumps({'message': message}))

    async def send_notification2(self,message):
        print("message from notification22 is",message)
        if(self.user==message['message'].recipient):
            print('yes they are equal')
            await self.send(text_data=json.dumps({'message': message['message'].message}))
        else:
            print('they are not equal')

    async def authenticate_user(self, scope):
        # Extract the token from the query parameters
        query_params = parse_qs(scope['query_string'].decode('utf-8'))
        token = query_params.get('token', [None])[0]
        print("token is ",token)
        # Authenticate the user using the token
        if token:
            try:
                # Decode the token
                payload = jwt.decode(token, options={"verify_signature": False})
                print("payload is ",payload )
                # Return the user associated with the token
                return CustomUser.objects.get(id=payload["user_id"])
            except Exception as e:
                # Token is invalid
                print(f"Invalid token: {e}")
                return AnonymousUser()
        else:
            # Token not provided
            print("Token not provided")
            return AnonymousUser()
