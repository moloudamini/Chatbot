import re
import random
from spellchecker import SpellChecker
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import faiss
import jellyfish
import numpy as np
from app.constants.constants import synonyms, prompts_to_replies, alternative

spell = SpellChecker()
spell_cache = {}

# Precompute TF-IDF 
prompts = list(prompts_to_replies.keys())
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(prompts)

# Precompute embeddings using SentenceTransformers
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
prompt_embeddings = embedding_model.encode(prompts, convert_to_tensor=True)

# Create FAISS index for embedding search
embedding_dim = prompt_embeddings.shape[1]
faiss_index = faiss.IndexFlatIP(embedding_dim)
faiss_index.add(prompt_embeddings.cpu().numpy())


# Cache and correct spelling 
def spell_correct(word: str) -> str:
    if word in spell_cache:
        return spell_cache[word]
    correction = spell.correction(word)
    spell_cache[word] = correction
    return correction

# Preprocess function
def preprocess_input(user_input: str) -> str:
    if not user_input:
        return ""

    # Multi-word synonym first
    user_input = synonyms.get(user_input.lower(), user_input)

    # Ignore words with special characters or digits
    def should_spell_check(word):
        return not re.search(r'[^\w]', word)

    # Spell correction with caching for eligible words
    corrected_words = [
        spell_correct(word) if should_spell_check(word) else word
        for word in user_input.split()
    ]
    user_input = " ".join(corrected_words)

    # Allow digits and specific special characters (@, #, +, -, *, /)
    user_input = re.sub(r'[^\w\s@#\-+*/]', '', user_input)

    user_input = user_input.lower().strip()

    # Replace single-word synonyms
    user_input = ' '.join([synonyms.get(word, word) for word in user_input.split()])

    return user_input

# Find exact match
def exact_match(user_input: str) -> str:
    if user_input in prompts_to_replies:
        return random.choice(prompts_to_replies[user_input])
    return None

# Jaro-Winkler matcher for short inputs
def jaro_winkler_match(user_input: str) -> str:
    best_match, max_similarity = max(
        ((prompt, jellyfish.jaro_winkler_similarity(user_input, prompt)) for prompt in prompts_to_replies),
        key=lambda x: x[1],
        default=(None, 0)
    )
    if best_match and max_similarity >= 0.75:
        return random.choice(prompts_to_replies[best_match])
    return None

# TF-IDF + Cosine Similarity matcher for mid-length inputs
def tfidf_match(user_input: str) -> str:
    user_vector = tfidf_vectorizer.transform([user_input])
    similarities = cosine_similarity(user_vector, tfidf_matrix)
    best_match_index = similarities.argmax()
    max_similarity = similarities[0, best_match_index]

    if max_similarity >= 0.75:
        best_match = prompts[best_match_index]
        return random.choice(prompts_to_replies[best_match])
    return None

# Embedding-based semantic matching using FAISS
def embedding_match(user_input: str) -> str:
    user_embedding = embedding_model.encode(user_input, convert_to_tensor=True).cpu().numpy()
    _, indices = faiss_index.search(np.array([user_embedding]), k=1)  
    best_match_index = indices[0][0]
    if best_match_index < len(prompts): 
        return random.choice(prompts_to_replies[prompts[best_match_index]])
    return None


# Get response 
def get_response(user_input: str) -> str:
    user_input = preprocess_input(user_input)

    # Step 1: Exact match
    response = exact_match(user_input)
    if response:
        return response

    # Step 2: Jaro-Winkler for short inputs
    if len(user_input.split()) < 5:
        response = jaro_winkler_match(user_input)
        if response:
            return response

    # Step 3: TF-IDF for mid-length inputs
    response = tfidf_match(user_input)
    if response:
        return response

    # Finally: Embedding-based semantic matching
    response = embedding_match(user_input)
    if response:
        return response

    return random.choice(alternative)
