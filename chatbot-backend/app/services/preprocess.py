import logging
import random
import re
from functools import lru_cache
from typing import Optional

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

@lru_cache(maxsize=1000) 
def get_user_embedding_cached(user_input: str) -> Optional[np.ndarray]:
    if not user_input:
        return None
    
    embedding = embedding_model.encode([user_input], convert_to_tensor=False)
    normalized_embedding = embedding / np.linalg.norm(embedding, axis=1, keepdims=True)
    return normalized_embedding.astype('float32')[0]

# Get response
def get_response(user_input: str) -> str:
    
    user_input = preprocess_input(user_input)
    if not user_input:
        return random.choice(alternative)
    
    # Retrieve cached embedding or compute if not cached
    cache_info_before = get_user_embedding_cached.cache_info()
    user_embedding = get_user_embedding_cached(user_input)
    cache_info_after = get_user_embedding_cached.cache_info()
    
    if cache_info_after.hits > cache_info_before.hits:
        logger.info(f"Cache hit for: '{user_input}'.")
    else:
        logger.info(f"Embedding for: '{user_input}'.")
        
    if user_embedding is None:
        return random.choice(alternative)
    
    # Reshape for FAISS (needs 2D array)
    user_embedding = user_embedding.reshape(1, -1)
    
    # Search for the most similar prompt
    k = 1  
    D, I = faiss_index.search(user_embedding, k)
    
    similarity = D[0][0]
    best_match_idx = I[0][0]
    
    logger.info(f"Similarity score: {similarity}")
    
    if similarity >= SIMILARITY_THRESHOLD:
        best_prompt = prompts[best_match_idx]
        response = random.choice(prompts_to_replies[best_prompt])
        logger.info(f"Matched Prompt: '{best_prompt}' | Response: '{response}'")
        return response
    else:
        logger.info("No suitable match found. Using alternative response.")
        return random.choice(alternative)
