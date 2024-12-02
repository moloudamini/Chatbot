import logging
from fastapi import APIRouter, Form, HTTPException, Depends
from app.models.chat import ChatResponse, ChatRequest
from app.services.preprocess import get_response
from app.services.state import ConversationState 

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api",
    tags=["chat"],
)

def chat_request_dependency(message: str = Form(...)) -> ChatRequest:
    if not message.strip():
        raise HTTPException(status_code=422, detail="Message cannot be empty.")
    return ChatRequest(message=message)

# Chat Endpoint
@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    chat_request: ChatRequest = Depends(chat_request_dependency),
    state: ConversationState = Depends(),
):
    try:
        state.add_message(chat_request.message)
        context = state.get_context()
        logger.debug(f"Conversation context: {context}")
        
        # Get response based on semantic embeddings and a FAISS index to retrieve the most relevant response from predefined prompts
        response_text = get_response(chat_request.message)
        logger.info(f"Processed message: '{chat_request.message}' | Response: '{response_text}'")
        return ChatResponse(response=response_text)
    
    except Exception as e:
        logger.error(f"Error processing message: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to process the message.")
