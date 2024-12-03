import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, '..'))
sys.path.insert(0, parent_dir)

from app.services.preprocess import preprocess_input, get_response
from app.constants.constants import prompts_to_replies, alternative
from fastapi.testclient import TestClient
from app.main import app
from app.services.state import ConversationState

client = TestClient(app)

# Test preprocessing with special characters and numbers
def test_preprocess_input():
    user_input = "C++ programming!"
    processed_input = preprocess_input(user_input)
    assert processed_input == "c++ programming", f"Expected 'c++ programming', got '{processed_input}'"

    user_input = "12345"
    processed_input = preprocess_input(user_input)
    assert processed_input == "12345", f"Expected '12345', got '{processed_input}'"

    user_input = "@user #AI/ML"
    processed_input = preprocess_input(user_input)
    assert processed_input == "@user #ai/ml", f"Expected '@user #ai/ml', got '{processed_input}'"

# Test for exact match
def test_get_response_exact_match():
    response = get_response("hello")
    assert response in prompts_to_replies["hello"], f"Response '{response}' not in expected replies for 'hello'"

# Test for semantically similar input
def test_get_response_semantic_match():
    user_input = "Can you tell me a story?"
    response = get_response(user_input)
    assert response in prompts_to_replies["tell me a story"], f"Response '{response}' not in expected replies for 'tell me a story'"

    user_input = "Are you human?"
    response = get_response(user_input)
    assert response in prompts_to_replies["are you human"], f"Response '{response}' not in expected replies for 'are you human'"

# Test for no suitable match 
def test_get_response_no_match():
    user_input = "Quantum entanglement is fascinating."
    response = get_response(user_input)
    assert response in alternative, f"Response '{response}' not in alternative responses"

# Test API/chat with valid message
def test_api_chat_valid():
    response = client.post("/api/chat", data={"message": "hello"})
    assert response.status_code == 200
    assert response.json()["response"] in prompts_to_replies["hello"], \
        f"API response '{response.json()['response']}' not in expected replies for 'hello'"

# Test API/chat with semantically similar message
def test_api_chat_semantic_message():
    response = client.post("/api/chat", data={"message": "Can you tell me a story?"})
    assert response.status_code == 200
    assert response.json()["response"] in prompts_to_replies["tell me a story"], \
        f"API response '{response.json()['response']}' not in expected replies for 'tell me a story'"

    response = client.post("/api/chat", data={"message": "Are you human?"})
    assert response.status_code == 200
    assert response.json()["response"] in prompts_to_replies["are you human"], \
        f"API response '{response.json()['response']}' not in expected replies for 'are you human'"

# Test API/chat with no matching 
def test_api_chat_no_match():
    response = client.post("/api/chat", data={"message": "Quantum physics is intriguing."})
    assert response.status_code == 200
    assert response.json()["response"] in alternative, \
        f"API response '{response.json()['response']}' not in alternative responses"

# Test API/chat with empty message
def test_api_chat_empty_message():
    response = client.post("/api/chat", data={"message": ""})
    assert response.status_code == 422, f"Expected status code 422 for empty message, got {response.status_code}"

# Test API/chat with special characters
def test_api_chat_special_characters():
    response = client.post("/api/chat", data={"message": "@#$%^&*()"})
    assert response.status_code == 200
    assert response.json()["response"] in alternative, \
        f"API response '{response.json()['response']}' not in alternative responses"

# Test API/chat with numeric 
def test_api_chat_numeric_message():
    response = client.post("/api/chat", data={"message": "12345"})
    assert response.status_code == 200
    assert response.json()["response"] in alternative, \
        f"API response '{response.json()['response']}' not in alternative responses"

# Test API/chat with long message
def test_api_chat_long_message():
    long_message = "a" * 100  # 100 'a's
    response = client.post("/api/chat", data={"message": long_message})
    assert response.status_code == 200
    assert response.json()["response"] in alternative, \
        f"API response '{response.json()['response']}' not in alternative responses"

def test_add_message():
    state = ConversationState()
    state.add_message("Hello!")
    state.add_message("How are you?")
    assert state.get_context() == ["Hello!", "How are you?"]
