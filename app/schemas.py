from datetime import datetime
from pydantic import BaseModel, ConfigDict

class NoteCreate(BaseModel):
    title: str
    content: str
    weather: str | None = None

class NoteRead(NoteCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    created_by: int

class UserCreate(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
