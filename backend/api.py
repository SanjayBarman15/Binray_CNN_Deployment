from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from model_loader import predict_image

import os

app = FastAPI()

# CORS for frontend
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def classify_image(file: UploadFile = File(...)):
    file_bytes = await file.read()
    result = predict_image(file_bytes)
    return result
