from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class NoteCreate(BaseModel):
    title: str = Field(min_length=1)
    content: str = Field(min_length=1)
    weather: str | None = None
    summary: str | None = None


class NoteRead(NoteCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    created_by: int


class NoteUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1)
    content: str | None = Field(default=None, min_length=1)
    weather: str | None = None
    summary: str | None = None



class UserCreate(BaseModel):
    username: str
    password: str


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str


class Token(BaseModel):
    access_token: str
    token_type: str
