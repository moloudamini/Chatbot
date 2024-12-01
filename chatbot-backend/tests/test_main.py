import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, '..'))
sys.path.insert(0, parent_dir)

from fastapi.testclient import TestClient
from app.main import app  

client = TestClient(app) 

# Test api/chat 
def test_chat_endpoint_valid_input():
    response = client.post("/api/chat", data={"message": "hello"})
    assert response.status_code == 200
    assert "response" in response.json()

# Test invalid input
def test_chat_endpoint_invalid_input():
    response = client.post("/api/chat", data={"message": ""})
    assert response.status_code == 422  

# Test api/health endpoint 
def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}