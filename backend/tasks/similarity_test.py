import sys
import json

def compute_similarity(tender, response, offer_previous_work, tender_ad):
    import sys
    import json
    import torch
    import numpy as np
    from joblib import load
    from sklearn.metrics.pairwise import cosine_similarity
    import sys
    try:
        tokenizer = load('api/models/Tokenizer_BERT_Similarity_Model.joblib')
        model = load('api/models/BERT_Similarity_Model.joblib')

        requirements_1 = tender.split('|')
        requirements_2 = response.split('|')
        row_similarities = []

        for req1, req2 in zip(requirements_1, requirements_2):
            tokens1 = tokenizer(req1, return_tensors='pt', padding=True, truncation=True)
            tokens2 = tokenizer(req2, return_tensors='pt', padding=True, truncation=True)
            
            with torch.no_grad():
                output1 = model(**tokens1)
                output2 = model(**tokens2)
            
            embedding1 = output1.last_hidden_state.mean(dim=1).squeeze().numpy()
            embedding2 = output2.last_hidden_state.mean(dim=1).squeeze().numpy()
            similarity_score = cosine_similarity([embedding1], [embedding2])[0][0]
            row_similarities.append(similarity_score)
        
        for previous_work in offer_previous_work:
            tokens1 = tokenizer(previous_work, return_tensors='pt', padding=True, truncation=True)
            tokens2 = tokenizer(tender_ad, return_tensors='pt', padding=True, truncation=True)
            
            with torch.no_grad():
                output1 = model(**tokens1)
                output2 = model(**tokens2)
            
            embedding1 = output1.last_hidden_state.mean(dim=1).squeeze().numpy()
            embedding2 = output2.last_hidden_state.mean(dim=1).squeeze().numpy()
            similarity_score = cosine_similarity([embedding1], [embedding2])[0][0]
            row_similarities.append(similarity_score)

        mean_similarity_score = np.mean(row_similarities)
        return mean_similarity_score * 100
    except:
        return sys.version

if __name__ == "__main__":
    tender = sys.argv[1]
    response = sys.argv[2]
    offer_previous_work = json.loads(sys.argv[3])
    tender_ad = sys.argv[4]
    
    score = compute_similarity(tender, response, offer_previous_work, tender_ad)
    print(score)
