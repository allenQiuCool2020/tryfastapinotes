from datetime import datetime
from .database import Base
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

class Note(Base):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String)
    content: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime)
    created_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    weather: Mapped[str | None] = mapped_column(String, nullable=True)

    def __repr__(self) -> str:
        return f"Note(id={self.id!r}, title={self.title!r}, content={self.content!r}, created_at={self.created_at!r}, created_by={self.created_by!r})"
    
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String, unique=True)
    hashed_password: Mapped[str] = mapped_column(String)

    notes: Mapped[list[Note]] = relationship("Note", backref="user")

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, username={self.username!r})"

    
