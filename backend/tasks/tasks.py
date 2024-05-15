import time 
from celery import shared_task
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from api.tokens import account_activation_token
from django.core.mail import send_mail, EmailMultiAlternatives
from django.utils.html import strip_tags
from api.models import CustomUser
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str

@shared_task
def activate_account(user_id):
    mail_subject = "Activate your Tego Email."
    user=CustomUser.objects.get(id=user_id)
    html_message=render_to_string('email2.html',{
        'user': user.email,
        'domain': 'localhost:3000',
        'uid': urlsafe_base64_encode(force_bytes(user.id)),
        'token': account_activation_token.make_token(user),
        "protocol": 'http'
    })
    plain_message= strip_tags(html_message)
    message=EmailMultiAlternatives(
        subject=mail_subject,
        body=plain_message,
        to=[user.email]
    )
    message.attach_alternative(html_message,'text/html')
    message.send()
    return "Email sent"

from celery import shared_task
from transformers import AutoTokenizer, AutoModel
import torch
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np



@shared_task
def compute_similarity_task(tender, response):
    tokenizer = AutoTokenizer.from_pretrained("aubmindlab/bert-base-arabertv02")
    model = AutoModel.from_pretrained("aubmindlab/bert-base-arabertv02")
    # Split the requirements from the row
    requirements_1 = tender.split('|')
    requirements_2 = response.split('|')
    
    # List to store similarity scores for this row
    row_similarities = []
    
    # Iterate over each pair of corresponding requirements
    for req1, req2 in zip(requirements_1, requirements_2):
        # Tokenize the requirements
        tokens1 = tokenizer(req1, return_tensors='pt', padding=True, truncation=True)
        tokens2 = tokenizer(req2, return_tensors='pt', padding=True, truncation=True)
        
        # Get embeddings for the requirements
        with torch.no_grad():
            output1 = model(**tokens1)
            output2 = model(**tokens2)
        
        # Compute the mean embeddings
        embedding1 = output1.last_hidden_state.mean(dim=1).squeeze().numpy()
        embedding2 = output2.last_hidden_state.mean(dim=1).squeeze().numpy()
        
        # Compute cosine similarity between the embeddings
        similarity_score = cosine_similarity([embedding1], [embedding2])[0][0]
        row_similarities.append(similarity_score)
    
    # Calculate mean similarity score for this row
    mean_similarity_score = np.mean(row_similarities)
    
    # You can do further processing here if needed
    
    return mean_similarity_score
