# Frontend & Backend Connection Guide

## Architecture

```
React Frontend (artifacts/festiva-planner)
    ↓
TypeScript API Server (artifacts/api-server) - Acts as proxy
    ↓
Python Festiva Planner Backend (Festiva_planner_AI)
```

## Setup Instructions

### 1. Start Python Backend

Navigate to Festiva_planner_AI and run:

```bash
cd Festiva_planner_AI
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

The backend will be available at: `http://localhost:8000`

### 2. Configure TypeScript API Server

The api-server is pre-configured to proxy requests to the Python backend. You can optionally set a custom backend URL via environment variable:

```bash
# In artifacts/api-server/.env (create if doesn't exist)
PYTHON_BACKEND_URL=http://localhost:8000
```

Or pass it when starting:

```bash
cd Modern-3D-Site
PYTHON_BACKEND_URL=http://localhost:8000 pnpm dev
```

### 3. Start TypeScript API Server

From the root directory:

```bash
pnpm install  # if needed
pnpm --filter @workspace/api-server dev
```

The API server will run on port 8080 by default.

### 4. Start React Frontend

From the root directory:

```bash
pnpm --filter festiva-planner dev
```

The frontend will run on port 19114 (or the PORT env variable you set).

## How It Works

1. **Frontend** → Makes requests to `/api/plan-event`, `/api/plans`, etc.
2. **API Server** → Receives requests, validates them, and proxies `/api/plan-event` to the Python backend at `http://localhost:8000/plan-event`
3. **Python Backend** → Processes event planning using AI agents and returns formatted JSON
4. **API Server** → Stores results in database and returns to frontend
5. **Frontend** → Displays the event plan

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PYTHON_BACKEND_URL` | `http://localhost:8000` | URL of Python Festiva Planner backend |
| `PORT` (api-server) | `8080` | API server port |
| `PORT` (frontend) | `19114` | Frontend dev port |

## Testing the Connection

### Test Python Backend

```bash
curl -X POST http://localhost:8000/plan-event \
  -H "Content-Type: application/json" \
  -d '{
    "user_text": "A casual birthday party",
    "budget": 5000,
    "guests": 30,
    "duration": 1,
    "city": "San Francisco"
  }'
```

### Test API Server → Python Backend

```bash
curl -X POST http://localhost:8080/api/plan-event \
  -H "Content-Type: application/json" \
  -d '{
    "user_text": "A casual birthday party",
    "budget": 5000,
    "guests": 30,
    "duration": 1,
    "city": "San Francisco"
  }'
```

## Troubleshooting

### "Failed to connect to Python backend"

- Check if Python backend is running on port 8000
- Verify `PYTHON_BACKEND_URL` environment variable is correct
- Check logs for connection errors

### CORS Issues

- The API server already has CORS enabled
- If connecting from different domain, ensure CORS headers are set correctly

### Port Already in Use

- Change the port: `PORT=3000 pnpm dev`
- Or kill the process using the port

## Next Steps

- [ ] Start Python backend (port 8000)
- [ ] Start API server (port 8080)
- [ ] Start frontend (port 19114)
- [ ] Open http://localhost:19114 in browser
- [ ] Fill out the event planner form and submit
