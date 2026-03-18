from datetime import datetime
from pydantic import BaseModel

class NoteCreate(BaseModel):
    title: str
    content: str
    weather: str | None = None

class NoteRead(NoteCreate):
    id: int
    created_at: datetime
    created_by: int

class UserCreate(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    