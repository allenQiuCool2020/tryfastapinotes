from contextlib import asynccontextmanager
from fastapi import FastAPI
import app.models
from app.database import create_db_and_tables
from app.routers import users

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(users.router)

@app.get("/")
def home():
    return {"message": "Hello World"}
