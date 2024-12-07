start cmd /K "cd frontend && npm run dev"
start cmd /K "cd backend && npm start"
start cmd /K "cd backendpython && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
