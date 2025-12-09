# Binary CNN Deployment

Lightweight repository for training, packaging, and deploying a binary image classifier (cats vs dogs) implemented with a CNN. The repo includes training scripts, a Python backend serving predictions, and a Next.js frontend.

**Repository Structure**

- **`backend/`**: Python API and model loader. Contains `api.py`, `model_loader.py`, `final_model.h5`, and `requirements.txt`.
- **`frontend/`**: Next.js app used for interacting with the model and sending images to the backend.
- **`training/`**: Training scripts, dataset folders and utilities (`model.py`, `predict.py`, `training_set/`, `test_set/`).

**Quick Start (development)**

1. Backend (Python)

   - Create a virtual environment and install dependencies:

     ```bash
     python -m venv .venv
     source .venv/Scripts/activate  # Windows (Git Bash) use: source .venv/Scripts/activate
     pip install -r backend/requirements.txt
     ```

   - Run the API server (adjust command if `api.py` uses FastAPI/Flask):

     ```bash
     # If using FastAPI + uvicorn
     uvicorn api:app --reload --app-dir backend --host 0.0.0.0 --port 8000

     # Or with Flask
     python backend/api.py
     ```

   - The backend expects a trained model file in `backend/` (e.g. `final_model.h5`).

2. Frontend (Next.js)

   - Install and run:

     ```bash
     cd frontend
     npm install
     npm run dev
     ```

   - Open `http://localhost:3000` and use the UI to upload images for prediction (frontend posts to the backend API).

3. Training the model

   - Training scripts and data are in `training/`.
   - Typical flow:

     ```bash
     python training/model.py    # train and save a model (may save to training/final_model.h5)
     python training/predict.py  # run inference on local images or test set
     ```

   - After training, copy the produced model (for example `final_model.h5`) into `backend/` so the API can load it.

**Notes & Recommendations**

- The repository contains large binary model files (e.g. `*.h5`). They should be kept out of version control in most cases — use object storage (S3, GCS) or Git LFS when you must track them.
- I added `backend/.gitignore` to ignore common Python artifacts and model files. Adjust patterns if you use a different environment layout.
- If `backend/api.py` uses FastAPI, run with `uvicorn` for production locally; consider `gunicorn` + `uvicorn.workers.UvicornWorker` for more robust deployments.
- For production deployments, containerize the backend (Docker) and serve the model with appropriate memory/CPU settings. Consider using TensorFlow Serving or TorchServe for heavy production loads.

**Troubleshooting**

- If the backend fails to find the model, ensure `final_model.h5` exists in `backend/` and has correct read permissions.
- If the frontend cannot reach the backend, check CORS settings in `backend/api.py` and make sure the backend host/port match the frontend request URL.

**Contact / Next steps**

- If you want, I can:
  - Add a Dockerfile for the backend.
  - Add a CI job to validate the API and build the frontend.
  - Move model storage to Git LFS or cloud storage and update loading logic.

---

Generated on: December 9, 2025
