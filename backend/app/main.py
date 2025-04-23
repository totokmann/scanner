# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth

app = FastAPI()

app.include_router(auth.router)

# habilita CORS para el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # poné el dominio del frontend si lo conocés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Scanner API activa"}
