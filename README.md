# Chatbot

This project consists of a **backend** built with **FastAPI** (Python) and a **frontend** built with **React** and **Tailwind CSS**. The backend serves as an API that handles chat requests and responses, while the frontend provides an interface for users to interact with the chatbot.

## Backend Setup (Python with FastAPI)

The backend of the chatbot is built with **FastAPI** (Python). It provides the API that the frontend will interact with to send and receive chat messages.

### Prerequisites

- Python 3.7 or higher
- Install dependencies using `pip` via the `requirements.txt` file.

### Backend Installation

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd chatbot-backend
   ```

2. Create a virtual environment

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Create a virtual environment

   ```bash
    pip install -r requirements.txt
   ```

4. Create .env file and add server URL to run app

   ```bash
   touch .env => add DEBUG=True ALLOWED_ORIGINS=http://localhost:3000 LOG_LEVEL=INFO in .env file
   ```

5. Run the backend server using uvicorn

   ```bash
    uvicorn app.main:app --reload
   ```

6. Testing and coverage

   ```bash
   pytest
   ```

This will start the backend server at http://localhost:8000

## Frontend Setup (React with Tailwind CSS)

The frontend of the chatbot is built with React. It communicates with the backend API to send user messages and display responses from the chatbot. Tailwind CSS is used to style the app.

### Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

### Frontend Installation

1. Clone the repository:

   ```bash
   cd chatbot-frontend
   ```

2. Install the necessary dependencies

   ```bash
   npm install
   ```

3. Create .env file and add server URL to run app

   ```bash
   touch .env => add REACT_APP_API_URL=http://localhost:8000 in .env file
    npm start
   ```

4. Testing and coverage

   ```bash
   npm test -- --coverage
   ```

This will start the frontend at http://localhost:3000
