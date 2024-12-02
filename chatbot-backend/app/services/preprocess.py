import logging
import random
import re

from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

from app.constants.constants import prompts_to_replies, alternative, SIMILARITY_THRESHOLD

logger = logging.getLogger(__name__)

# Initialize SentenceTransformer model
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Precompute embeddings for all prompts
prompts = list(prompts_to_replies.keys())
prompt_embeddings = embedding_model.encode(prompts, convert_to_tensor=False)

# Normalize embeddings for cosine similarity
normalized_prompt_embeddings = prompt_embeddings / np.linalg.norm(prompt_embeddings, axis=1, keepdims=True)

# Create FAISS index for similarity search
embedding_dim = normalized_prompt_embeddings.shape[1]
faiss_index = faiss.IndexFlatIP(embedding_dim) 
faiss_index.add(normalized_prompt_embeddings.astype('float32'))

# preprocess user input
def preprocess_input(user_input: str) -> str:
    user_input = user_input.lower()
    user_input = re.sub(r'[^\w\s@#\-+*/]', '', user_input)
    user_input = user_input.strip()
    return user_input

# Get response
def get_response(user_input: str) -> str:
    
    user_input = preprocess_input(user_input)
    if not user_input:
        return random.choice(alternative)
    
    # Generate embedding for user input
    user_embedding = embedding_model.encode([user_input], convert_to_tensor=False)
    user_embedding = user_embedding / np.linalg.norm(user_embedding, axis=1, keepdims=True)
    
    # Search for the most similar prompt
    k = 1  
    D, I = faiss_index.search(user_embedding.astype('float32'), k)
    
    similarity = D[0][0]
    best_match_idx = I[0][0]
    
    logger.debug(f"Similarity score: {similarity}")
    
    if similarity >= SIMILARITY_THRESHOLD:
        best_prompt = prompts[best_match_idx]
        response = random.choice(prompts_to_replies[best_prompt])
        logger.debug(f"Matched Prompt: '{best_prompt}' | Response: '{response}'")
        return response
    else:
        logger.debug("No suitable match found. Using alternative response.")
        return random.choice(alternative)
