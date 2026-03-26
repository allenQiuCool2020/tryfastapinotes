from contextlib import asynccontextmanager
from fastapi import FastAPI
import app.models
# from app.database import create_db_and_tables
from app.routers import auth, notes, users

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(users.router)
app.include_router(notes.router)
app.include_router(auth.router)

@app.get("/")
def home():
    return {"message": "Hello World"}
