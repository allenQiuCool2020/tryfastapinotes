from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.database import get_db
from app.routers.auth import get_current_user

router = APIRouter(prefix="/notes", tags=["notes"])


@router.post("/", response_model=schemas.NoteRead)
def create_note(
    note: schemas.NoteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_note(db=db, note=note, user_id=current_user.id)


@router.get("/{note_id}", response_model=schemas.NoteRead)
def read_note(note_id: int, db: Session = Depends(get_db)):
    db_note = crud.get_note(db=db, note_id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note
