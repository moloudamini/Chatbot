import logging
from fastapi import APIRouter, Form, HTTPException, Depends
from app.models.chat import ChatResponse, ChatRequest
from app.services.preprocess import preprocess_input, get_response
from spellchecker import SpellChecker

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api",
    tags=["chat"],
)

spell = SpellChecker()

def chat_request_dependency(message: str = Form(...)) -> ChatRequest:
    if not message.strip():
        raise HTTPException(status_code=422, detail="Message cannot be empty.")
    return ChatRequest(message=message)

# Chat Endpoint
@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_request: ChatRequest = Depends(chat_request_dependency)):
    try:
        # A hybrid approach for preporcessing consists of:
        # - Jaro-Winkler for typo-tolerance,
        # - TF-IDF with Cosine Similarity for contextual relevance,
        # - FAISS-backed Sentence Transformers for semantic understanding

        processed_message = preprocess_input(chat_request.message)
        response_text = get_response(processed_message)
        logger.info(f"Processed message: '{processed_message}' | Response: '{response_text}'")
        return ChatResponse(response=response_text)
    
    except Exception as e:
        logger.error(f"Error processing message: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to process the message.")