
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, '..'))
sys.path.insert(0, parent_dir)

from app.services.preprocess import preprocess_input, get_response
from app.constants.constants import prompts_to_replies
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Test synonym replacement
def test_preprocess_input():
    user_input = "h r u"
    processed_input = preprocess_input(user_input)
    assert processed_input == "how are you"
    
    user_input = "C++ programming!"
    processed_input = preprocess_input(user_input)
    assert processed_input == "c++ programming"
    
    user_input = "12345"
    processed_input = preprocess_input(user_input)
    assert processed_input == "12345"

# Test exact match logic
def test_get_response_exact_match():
    response = get_response("hello")
    assert response in prompts_to_replies["hello"]

# Test no match logic
def test_get_response_no_match():
    response = get_response("unknown prompt")
    assert response != ""

# Test api/chat endpoint with valid message
def test_api_chat_valid():
    response = client.post("/api/chat", data={"message": "hello"})
    assert response.status_code == 200

# Test empty message
def test_api_chat_empty_message():
    response = client.post("/api/chat", data={"message": ""})
    assert response.status_code == 422

# Test special characters
def test_api_chat_special_characters():
    response = client.post("/api/chat", data={"message": "@#$%^&*()"})
    assert response.status_code == 200

# Test numeric message
def test_api_chat_numeric_message():
    response = client.post("/api/chat", data={"message": "12345"})
    assert response.status_code == 200

# Test long message
def test_api_chat_long_message():
    long_message = "a" * 100  # 100 'a's
    response = client.post("/api/chat", data={"message": long_message})
    assert response.status_code == 200

# Test multi-word synonym replacement
def test_preprocess_multi_word_synonym():
    user_input = "h r u"
    processed_input = preprocess_input(user_input)
    assert processed_input == "how are you"
